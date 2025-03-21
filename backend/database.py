import asyncio
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import OperationalError

DATABASE_URL = "postgresql+asyncpg://postgres:password@db:5432/mydatabase"

engine = create_async_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)

async def wait_for_db():
    """Wait for the database to be ready before connecting."""
    retries = 10  
    for i in range(retries):
        try:
            async with engine.begin() as conn:
                await conn.run_sync(lambda _: None)  # Test connection
            print(" Database is ready!")
            return
        except OperationalError:
            print(f" Database not ready, retrying ({i+1}/{retries})...")
            await asyncio.sleep(3)  # Wait 3 seconds before retrying
    raise Exception(" Database connection failed after multiple retries.")

async def get_db():
    async with SessionLocal() as session:
        yield session
