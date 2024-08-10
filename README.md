# INSTRUCTIONS to deploy

# Using docker compose

==> docker-compose up --build

1\. Access localhost:8081 on your web browser.

# Manually creating containers

1\. Run the webviz container using the command below

==> docker run -p 8080:8080 cruise/webviz

2\. change directory to inception

3\. run the following commands

==> docker build -t "flask-minio-apache-app" -f Dockerfile .

==> docker run -p 5001:5001 -p 9001:9001 -p 8081:80 flask-minio-apache-app

4\. Access localhost:8081 on your web browser.

# USAGE

1\. Used a pre-built image for webviz which runs on a seperate container.

2\. Used minIo server from the offical website which gets downloaded and installed on another docker container that gets created from the docker file within the project folder.

This minIO server runs on port 9000 for APIs and 9001 for its web view.

3\. Once all the instructions are followed, start accessing the application on localhost:8081

4\. The landing page has an Upload section which allows user to upload their own bag files, followed by the list of avaialble files which are already uploaded to minIO bucket storage.

NOTE- Currently, I have only uploaded one bag file into the storage and hence it lists that bag file.

5\. To view the visualization, click view button which opens up the visualzation. You can change the layout and choose between - Default, Zoomed In, speed 3x layouts. For some visuals, you might need to adjust the settings in the panel like Follow Orientation, which then displays it properly.

6\. Click Close to close the visualization tab.

# TECHNOLOGIES USED

1\. Flask for backend
2.\ React on frontend
3.\ MinIO for object storage
