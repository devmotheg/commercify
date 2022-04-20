/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import { CircularProgress } from "@mui/material";

const Loading = () => {
	return (
		<div className="my-8 mx-auto w-fit">
			<CircularProgress className="text-teal-500" size={45} />
		</div>
	);
};

export default Loading;
