#!/bin/sh

service apache2 start

# Start MinIO server
/usr/local/bin/minio server /mnt/data --console-address ":9001" &


# Wait for MinIO to start
sleep 3

# Start Flask app
python app.py