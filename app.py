from flask import Flask, jsonify,Response, request
from minio import Minio
from minio.error import S3Error
from flask_cors import CORS
import io
import time

app = Flask(__name__)

CORS(app, origins='*', methods=['GET', 'HEAD', 'OPTIONS','DELETE'],
     expose_headers=['ETag', 'Content-Type', 'Accept-Ranges', 'Content-Length', 'Range'],
     allow_headers=['*'], send_wildcard=True, vary_header=True)

# Configure MinIO client
minio_client = Minio(
    'localhost:9000',
    access_key='admin',
    secret_key='password',
    secure=False
)

BAG_BUCKET_NAME = 'inception-robotics-ros'
LAYOUTS_BUCKET_NAME  ="layouts"

@app.route('/', methods=['GET'])
def index():
    return "<h1>Server is up & running!</h1>"


@app.route('/files', methods=['GET'])
def list_files():
    try:
        objects = minio_client.list_objects(BAG_BUCKET_NAME)
        files = [obj.object_name for obj in objects]
        return jsonify(files)
    except Exception as e:
        return str(e), 500


@app.route('/layouts/<filename>', methods=['GET'])
def get_layout(filename):
    try:
        r = minio_client.get_object("layouts", filename)
        content = r.data
        headers = dict(r.headers)
        response = Response(content, headers=headers)
        response.status_code = r.status
        return response
    except Exception as e:
        return str(e), 500

        

@app.route('/files/<filename>', methods=['GET'])
def get_file(filename):
    try:
        range_header = request.headers.get('Range', None)
        # print(f"Received Range Header: {range_header}")
        stat = minio_client.stat_object(BAG_BUCKET_NAME, filename)
        r = minio_client.get_object(BAG_BUCKET_NAME, filename)
        
        if range_header:
            byte_range = range_header.split('=')[1]
            start, end = byte_range.split('-')
            start = int(start)
            end = int(end) if end else stat.size - 1

            r.read(start)  # Move the pointer to the start position
            content = r.read(end - start + 1)
            
            response = Response(content, content_type=r.headers.get('Content-Type'))
            response.headers['Content-Range'] = f'bytes {start}-{end}/{stat.size}'
            response.headers['Accept-Ranges'] = 'bytes'
            response.status_code = 206
            # print(f"Response Headers: {response.headers}")
        else:
            content = r.read()
            response = Response(content, content_type=r.headers.get('Content-Type'))
            response.headers['Accept-Ranges'] = 'bytes'
            response.status_code = 200
        
        return response
    except Exception as e:
        # print(str(e))
        return str(e), 500
    

@app.route('/files/<filename>', methods=['DELETE'])
def delete_file(filename):
    try:
        minio_client.remove_object(BAG_BUCKET_NAME, filename)
        return jsonify({'message': 'File deleted successfully'}), 200
    except Exception as e:
        return str(e), 500


@app.route('/upload', methods=['POST'])
def upload_file():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            print("No selected file")
            return jsonify({'error': 'No selected file'}), 400
        
        if file:
            file_content = file.read()
            file.seek(0)

            print(f'Uploading file: {file.filename}')
            minio_client.put_object(
                BAG_BUCKET_NAME, 
                file.filename, 
                io.BytesIO(file_content), 
                len(file_content)
            )
            return jsonify({'message': 'File uploaded successfully'}), 200
    
    except S3Error as e:
        return jsonify({'error': str(e)}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500


def inflate_data():
      
    # Check if the bucket already exists
    found = minio_client.bucket_exists(BAG_BUCKET_NAME)
    if not found:
        print("creating bucket")
        minio_client.make_bucket(BAG_BUCKET_NAME)
        files_to_upload = [
            {"file_path": "/app/bags/2024-08-02-18-53-37.bag", "object_name": "2024-08-02-18-53-37"}
        ]

        # Upload files
        for file in files_to_upload:
            try:
                minio_client.fput_object(
                    BAG_BUCKET_NAME, file["object_name"], file["file_path"]
                )
                print(f"File '{file['object_name']}' uploaded successfully")
            except Exception as exc:
                print(f"Error occurred while uploading '{file['object_name']}':", exc)
    else:
        print("bucket found")        


    # creating layouts bucket
    # File paths and names to upload
    files_to_upload = [
        {"file_path": "/app/layouts/default.json", "object_name": "default.json"},
        {"file_path": "/app/layouts/zoomed-in.json", "object_name": "zoomed-in.json"},
        {"file_path": "/app/layouts/custom2.json", "object_name": "custom2.json"}
    ]

    # Check if the bucket exists, create if not
    found = minio_client.bucket_exists(LAYOUTS_BUCKET_NAME)
    if not found:
        minio_client.make_bucket(LAYOUTS_BUCKET_NAME)
        print(f"Bucket '{LAYOUTS_BUCKET_NAME}' created successfully")
    
        # Upload files
        for file in files_to_upload:
            try:
                minio_client.fput_object(
                    LAYOUTS_BUCKET_NAME, file["object_name"], file["file_path"]
                )
                print(f"File '{file['object_name']}' uploaded successfully")
            except S3Error as exc:
                print(f"Error occurred while uploading '{file['object_name']}':", exc)





if __name__ == '__main__':
    
    inflate_data()
    app.run(host='0.0.0.0', port=5001)
