from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.exc import NoResultFound
from pydantic import BaseModel  
from prometheus_fastapi_instrumentator import Instrumentator

from database import get_db, engine, wait_for_db
from models import Item, Base

app = FastAPI()
Instrumentator().instrument(app).expose(app)


#  Enable CORS for frontend-backend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#  Define a request model for Item creation/update
class ItemRequest(BaseModel):
    name: str
    description: str  
    

@app.on_event("startup")
async def startup():
    await wait_for_db()
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

@app.get("/")
def home():
    return {"message": "Welcome to the CRUD API!"}

# CREATE ITEM (Receives JSON body instead of query parameters)
@app.post("/items/")
async def create_item(item: ItemRequest, db: AsyncSession = Depends(get_db)):
    new_item = Item(name=item.name, description=item.description)
    db.add(new_item)
    await db.commit()
    await db.refresh(new_item)
    return new_item

#  READ ITEMS
@app.get("/items/")
async def read_items(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Item))
    return result.scalars().all()

#  UPDATE ITEM (Receives JSON body)
@app.put("/items/{item_id}")
async def update_item(item_id: int, item: ItemRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Item).where(Item.id == item_id))
    item_obj = result.scalars().first()
    
    if not item_obj:
        raise HTTPException(status_code=404, detail="Item not found")

    item_obj.name = item.name
    item_obj.description = item.description
    await db.commit()
    return item_obj

# DELETE ITEM
@app.delete("/items/{item_id}")
async def delete_item(item_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Item).where(Item.id == item_id))
    item_obj = result.scalars().first()
    
    if not item_obj:
        raise HTTPException(status_code=404, detail="Item not found")

    await db.delete(item_obj)
    await db.commit()
    return {"message": "Item deleted successfully"}
