/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import { useRouter } from "next/router";
import { useEffect } from "react";

import type { NextPageWithAuth } from "../types";
import { Header, Footer, ProductCardList } from "../components";
import { useCart } from "../hooks";

const Home: NextPageWithAuth = () => {
	const router = useRouter();
	const { clearItems, getCartState } = useCart();

	useEffect(() => {
		if (router.query["checkout-completed"] && getCartState()) clearItems();
	}, [router, clearItems, getCartState]);

	return (
		<div>
			<Header />
			<main className="container mx-auto w-5/6">
				<ProductCardList />
			</main>
			<Footer />
		</div>
	);
};

export default Home;
