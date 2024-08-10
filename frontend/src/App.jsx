import FileList from "./components/FileList";

function App() {
	return (
		<>
			{/* <div className='absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]'> */}
			<div className='absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#d1dbef_1px,transparent_1px)] [background-size:16px_16px]'>
				<div className='absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]'></div>
				{/* <div className='App'> */}
				<header className='relative z-0 text-black-500'>
					<FileList />
				</header>
			</div>
		</>
	);
}

export default App;
