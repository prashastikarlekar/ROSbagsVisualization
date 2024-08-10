FROM python:3.9-slim

WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt


# Download and set up MinIO
RUN apt-get update
RUN apt-get install -y wget
RUN wget https://dl.min.io/server/minio/release/linux-amd64/minio -O /usr/local/bin/minio
RUN chmod +x /usr/local/bin/minio

RUN apt-get install -y apache2

COPY ./frontend/dist /var/www/html

# Make port 5000 available to the world outside this container
EXPOSE 5001

# minio api
EXPOSE 9000

# minio web
EXPOSE 9001

EXPOSE 80


# Environment variables for MinIO
ENV MINIO_ROOT_USER=admin
ENV MINIO_ROOT_PASSWORD=password


# Copy entrypoint script
COPY ./entrypoint.sh /usr/local/bin/

# making entrypoint executable
RUN chmod +x /usr/local/bin/entrypoint.sh


# Run the entrypoint script
ENTRYPOINT ["entrypoint.sh"]

