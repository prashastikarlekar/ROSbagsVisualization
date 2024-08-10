import React, { useState } from "react";

export const UploadSection = ({
	uploading,
	uploadProgress,
	handleFileChange,
	handleFileUpload,
}) => {
	return (
		<div className='p-5 border-2 border-gray-300 m-5 flex flex-col text-center justify-center gap-3'>
			<div>
				<input type='file' onChange={handleFileChange} />
			</div>
			<div>
				<button
					className='bg-[#64b0dd]  border-[1.5px] border-[#3498db] hover:bg-blue-700 text-white font-bold py-1 px-4 rounded'
					onClick={handleFileUpload}
					disabled={uploading}>
					Upload Bag file
				</button>
			</div>
			{uploading && (
				<div className='mt-2 text-lg'>Uploading: {uploadProgress}%</div>
			)}
			<span className='text-lg'>
				The uploaded bag file will be uploaded to the bucket in MinIO storage.
			</span>
		</div>
	);
};
