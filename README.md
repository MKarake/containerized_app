# Containerized CRUD App (FastAPI + PostgreSQL + Nginx Frontend)

A beginner-friendly full-stack project that demonstrates how to build a simple CRUD app with FastAPI (Python), a PostgreSQL database, and a static frontend served by Nginx. The entire application is **containerized using Docker** and managed with **Docker Compose**.

---

## 🧠 Project Structure & Technologies

```
containerized_app/
│
├── backend/               # FastAPI backend code
│   ├── app.py             # Main FastAPI app
│   ├── database.py        # Async DB connection setup + retry logic
│   ├── models.py          # SQLAlchemy DB model
│   ├── requirements.txt   # Python dependencies
│   └── Dockerfile         # Dockerfile for backend
│
├── frontend/              # Frontend HTML, CSS, JS
│   ├── public/            # Contains index.html, app.js, styles.css
│   ├── nginx.conf         # Custom Nginx config to serve static files
│   └── Dockerfile         # Dockerfile for frontend (Nginx)
│
├── db/
│   └── init.sql           # SQL script to initialize the database
│
├── docker-compose.yml     # Manages multi-container setup
└── README.md               # This file
```

---

## 🚀 Features

- Add, view, update, and delete items (CRUD)
- Simple UI served via Nginx
- FastAPI backend with async PostgreSQL access
- Fully containerized with Docker
- Service orchestration with Docker Compose

---

## 🛠️ Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/your-username/containerized_app.git
cd containerized_app
```

### 2. Build and run the containers
```bash
docker compose up --build
```
> This builds images for frontend, backend, and pulls the PostgreSQL image. It starts everything up.

### 3. Access the app
Open your browser and go to:
```
Frontend:  http://localhost:8080
Backend:   http://localhost:8000
```

---

## 🔍 Deep Dive: How Each Part Works

### 🔹 Backend (FastAPI)
**Dockerfile:**
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
```
- Uses a minimal Python image
- Installs dependencies listed in `requirements.txt`
- Runs FastAPI server with Uvicorn on port 8000

**requirements.txt**
```
fastapi
uvicorn
asyncpg
sqlalchemy
```
These are used to:
- Serve API endpoints
- Connect to PostgreSQL asynchronously
- Create and manage the item model/table

**Key logic in backend**
- `wait_for_db()` ensures the DB is ready before trying to connect
- Uses `sqlalchemy.ext.asyncio` for performance
- CRUD routes: `POST`, `GET`, `PUT`, and `DELETE /items/`

### 🔹 Database (PostgreSQL)
```yaml
db:
  image: postgres:13
  restart: always
  environment:
    POSTGRES_USER: postgres
    POSTGRES_PASSWORD: password
    POSTGRES_DB: mydatabase
  volumes:
    - ./db/init.sql:/docker-entrypoint-initdb.d/init.sql
  ports:
    - "5432:5432"
  healthcheck:
    test: ["CMD-SHELL", "pg_isready -U postgres -d mydatabase"]
    interval: 5s
    retries: 5
    start_period: 10s
```
- Uses official PostgreSQL image
- Runs the init SQL script to create the DB on first boot
- Healthcheck ensures the backend waits for DB readiness

### 🔹 Frontend (HTML, JS, CSS via Nginx)
**Dockerfile**
```dockerfile
FROM nginx:latest
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY public /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```
- Copies static files to Nginx's default HTML path
- Uses custom Nginx config to handle routing

**nginx.conf**
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri /index.html;
    }
}
```
- Ensures index.html is served even if the route doesn't match

---

## 🔗 Docker Compose: How It Glues Everything Together
```yaml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "8080:80"
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    depends_on:
      db:
        condition: service_healthy
    environment:
      - DATABASE_URL=postgresql+asyncpg://postgres:password@db:5432/mydatabase

  db:
    image: postgres:13
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: mydatabase
    volumes:
      - ./db/init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres -d mydatabase"]
      interval: 5s
      retries: 5
      start_period: 10s
```
- `depends_on` ensures correct startup order
- `build` means Docker Compose will build from the provided Dockerfile
- Environment variables allow secure, flexible DB connection

---

## 📦 Optional: Pushing Images to Docker Hub
```bash
# Tag and push backend
$ docker tag containerized_app-backend mkarake/containerized_app-backend:latest
$ docker push mkarake/containerized_app-backend:latest

# Tag and push frontend
$ docker tag containerized_app-frontend mkarake/containerized_app-frontend:latest
$ docker push mkarake/containerized_app-frontend:latest
```
> You only push the images (frontend/backend). Docker Compose and DB stay local.

---

## 🧼 Clean up
```bash
docker compose down  # Stop all containers
docker system prune  # Optional: free up unused data
```

---

## 🙌 Final Thoughts
This project teaches you:
- How to containerize a **Python backend + static frontend + PostgreSQL DB**
- Use **Dockerfiles** to define environments
- Use **Docker Compose** to orchestrate them
- Understand **volumes**, **healthchecks**, **build contexts**, and **environment variables**

Now you're ready to build, scale, and deploy containerized applications 🚀

