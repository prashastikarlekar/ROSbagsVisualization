import React, { useEffect, useState } from "react";
import axios from "axios";
import FileDetails from "./FileDetails";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UploadSection } from "./UploadSection";
import { FLASK_SERVER_URL } from "../../constants/constants";
const FileList = () => {
	const [files, setFiles] = useState([]);
	const [selectedFile, setSelectedFile] = useState(null);
	const [uploadedFile, setUploadedFile] = useState(null);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [uploading, setUploading] = useState(false);

	const handleFileChange = (event) => {
		setUploadedFile(event.target.files[0]);
	};

	const handleFileUpload = () => {
		if (!uploadedFile) {
			toast.error("Please select a file first.");
			return;
		}

		const formData = new FormData();
		formData.append("file", uploadedFile);

		const xhr = new XMLHttpRequest();
		xhr.open("POST", `${FLASK_SERVER_URL}/upload`, true);

		xhr.upload.onprogress = (event) => {
			if (event.lengthComputable) {
				const percentComplete = Math.round((event.loaded / event.total) * 100);
				setUploadProgress(percentComplete);
			}
		};

		xhr.onload = () => {
			if (xhr.status >= 200 && xhr.status < 300) {
				console.log(JSON.parse(xhr.responseText));
				toast.success("File uploaded successfully");
				fetchFileList();
				setUploadProgress(0);
				setUploading(false);
				setUploadedFile(null); // Clear the selected file
				document.querySelector('input[type="file"]').value = ""; // Clear file input
			} else {
				console.error("Upload failed:", xhr.responseText);
				toast.error("Failed to upload file");
				setUploadProgress(0);
				setUploading(false);
			}
		};

		xhr.onerror = () => {
			console.error("Error during upload");
			toast.error("Error during upload");
			setUploadProgress(0);
			setUploading(false);
		};

		setUploading(true);
		xhr.send(formData);
	};

	const fetchFileList = () => {
		axios
			.get(`${FLASK_SERVER_URL}/files`)
			.then((response) => setFiles(response.data))
			.catch((error) => console.error("Error fetching files:", error));
	};

	const handleFileClick = (file) => {
		console.log(file);
		setSelectedFile(file);
	};

	const handleDeleteFile = (filename) => {
		// Create a custom confirmation dialog using toast
		toast.info(
			<div>
				<p>Are you sure you want to delete {filename}?</p>
				<button
					onClick={() => {
						axios
							.delete(`${FLASK_SERVER_URL}/files/${filename}`)
							.then((response) => {
								toast.success("File deleted successfully");
								fetchFileList(); // Refresh the file list
							})
							.catch((error) => {
								console.error("Error deleting file:", error);
								toast.error("Failed to delete file");
							});
						toast.dismiss(); // Dismiss the confirmation toast
					}}
					className='bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded mr-2'>
					Yes
				</button>
				<button
					onClick={() => toast.dismiss()} // Dismiss the confirmation toast
					className='bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-4 rounded'>
					No
				</button>
			</div>,
			{
				position: "top-center",
				autoClose: false,
				closeOnClick: false,
				draggable: false,
				pauseOnHover: false,
			}
		);
	};

	useEffect(() => {
		fetchFileList();
	}, []);

	return (
		<div>
			<ToastContainer />
			<div className='text-4xl text-center font-semibold p-5 my-8'>
				Object Storage and Visualization System <br />
				for <span className='text-gray-600 italic'>ROS Bag Files</span>
			</div>

			{/* Upload File Section */}
			<UploadSection
				uploadProgress={uploadProgress}
				uploading={uploading}
				handleFileChange={handleFileChange}
				handleFileUpload={handleFileUpload}
			/>

			{/* File list */}

			<div className='m-5 text-3xl text-black'>Available Files</div>
			<div className='grid grid-cols-2 max-w-3xl gap-4 p-4 border-2 border-gray-300 m-5'>
				{files.map((file) => (
					<React.Fragment key={file}>
						<div className='flex justify-center text-xl font-semibold'>
							{file}
						</div>
						<div className='flex justify-center'>
							<button
								className='bg-[#64b0dd]  border-[1.5px] border-[#3498db] hover:bg-blue-700 text-white font-bold py-1 px-4 rounded'
								onClick={(e) => {
									e.preventDefault();
									handleFileClick(file);
								}}>
								Click to view
							</button>
							<button
								className='bg-[#837e7e] hover:bg-red-700 text-white font-bold py-1 px-4 rounded ml-2'
								onClick={(e) => {
									e.preventDefault();
									handleDeleteFile(file);
								}}>
								Delete
							</button>
						</div>
					</React.Fragment>
				))}
			</div>

			{selectedFile && (
				<FileDetails file={selectedFile} onSelectFile={setSelectedFile} />
			)}
		</div>
	);
};

export default FileList;
