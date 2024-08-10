import { useEffect, useState } from "react";
import { FLASK_SERVER_URL ,WEBVIZ_URL} from "../../constants/constants";

const Webviz = ({ file }) => {
	const [layout, setLayout] = useState("default.json");
	const [error, setError] = useState(false);

	useEffect(() => {
		// Ensure the URL for Webviz is correctly formed
		// const layoutParam =
		// 	layout === "default" ? "default.json" : encodeURIComponent(layout_url);
		const webvizUrl = `${WEBVIZ_URL}/?remote-bag-url=${encodeURIComponent(
			`${FLASK_SERVER_URL}/files/${file}`
		)}&layout-url=${FLASK_SERVER_URL}/layouts/${layout}`;
		const iframe = document.getElementById("webviz-iframe");
		iframe.onload = () => setError(false);
		iframe.onerror = () => setError(true);
		iframe.src = webvizUrl;
	}, [file, layout]);

	const handleLayoutChange = (event) => {
		const selectedLayout = event.target.value;
		setLayout(selectedLayout);
	};

	return (
		<div>
			<div className='mb-5'>
				<label htmlFor='layout' className=' py-5 text-xl '>
					Choose Layout:
				</label>
				<select
					className='border-2 border-gray-300 rounded-lg px-4 py-2 m-2'
					id='layout'
					value={layout}
					onChange={handleLayoutChange}>
					<option value='default.json'>Default</option>
					<option value='zoomed-in.json'>Zoomed In Layout</option>
					<option value='custom2.json'>Speed 3x Layout</option>
				</select>
			</div>
			{error ? (
				<p>
					Error loading Webviz. Please ensure Webviz is running and accessible.
				</p>
			) : (
				<iframe
					id='webviz-iframe'
					width='100%'
					height='600px'
					title='Webviz'></iframe>
			)}
		</div>
	);
};

export default Webviz;
