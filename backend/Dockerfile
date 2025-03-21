# Use official Python image
FROM python:3.9-slim
 
#Ensures all subsequent commands (COPY, RUN, etc.) operate from /app.
#WORKDIR must come before any file operations (COPY), otherwise files might be placed in the wrong directory
#So any files copied, commands run, etc., happen in this folder.
WORKDIR /app 

# This installs your Python libraries early
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt


#This copies all your backend code into the container’s /app folder.
COPY . .

#specify the port on which the backend will open
EXPOSE 8000


# Runs the Uvicorn Server installed from req.txt
#Tells Uvicorn where to find the FastAPI app ;  
#--host 0.0.0.0 makes the API accessible from outside (via http://localhost:8000/)
#Matches the port exposed in the Dockerfile 
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
