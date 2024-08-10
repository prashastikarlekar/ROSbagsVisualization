import Webviz from "./Webviz";

const FileDetails = ({ file, onSelectFile }) => {
	return (
		<div className='m-5'>
			<div className='text-2xl px-7 text-center  my-10'>
				Details for <span className='font-semibold italic'>{file}</span>
				<div className='my-5'>
					<button
						className='bg-[#64b0dd]  border-[1.5px] border-[#3498db] hover:bg-blue-700 text-white font-bold py-1 px-4 rounded text-lg'
						onClick={() => onSelectFile(null)}>
						Close
					</button>
				</div>
			</div>

			<Webviz file={file} />
		</div>
	);
};

export default FileDetails;
