/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import Link from "next/link";
import { Button } from "@mui/material";

import type { NextPageWithAuth } from "../../../types";
import { Header, Footer, DashboardProductList } from "../../../components";

const DashboardProducts: NextPageWithAuth = () => {
	return (
		<div className="grid min-h-screen grid-flow-row grid-rows-[auto_1fr_auto]">
			<Header />
			<main className="container mx-auto w-5/6 rounded p-2 shadow-lg">
				<div className="mb-4 flex items-center justify-between gap-6 border-b-2 border-dotted border-slate-300 pb-4">
					<span className="text-xl font-bold capitalize">products</span>
					<Link href="products/manage">
						<a>
							<Button
								className="bg-teal-500 capitalize text-white"
								variant="contained">
								add product
							</Button>
						</a>
					</Link>
				</div>
				<DashboardProductList />
			</main>
			<Footer />
		</div>
	);
};

DashboardProducts.auth = {
	usersOnly: true,
};

export default DashboardProducts;
