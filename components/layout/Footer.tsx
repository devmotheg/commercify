/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import { FaCcStripe } from "react-icons/fa";
import { Link } from "@mui/material";

const Footer = () => {
	return (
		<footer className="mb-4 mt-7">
			<p className="text-center text-sm">
				Secured payment gateway by
				<FaCcStripe className="ml-1 inline-block h-6 w-6" />
			</p>
			<Link href="https://github.com/devmotheg" underline="always">
				<p
					className="mt-1 text-center text-sm"
					dangerouslySetInnerHTML={{
						__html: "&copy; by Mohamed Muntasir",
					}}></p>
			</Link>
		</footer>
	);
};

export default Footer;
