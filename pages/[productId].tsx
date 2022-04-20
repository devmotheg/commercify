/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import type { GetServerSideProps } from "next";

import type { NextPageWithAuth, ProductProps } from "../types";
import { Header, Footer, ProductDetails } from "../components";
import serialize from "../lib/serialize";

const Product: NextPageWithAuth = ({ product }: ProductProps) => {
	return (
		<div className="grid grid-flow-row grid-rows-[auto_1fr_auto]">
			<Header />
			<ProductDetails product={product} />
			<Footer />
		</div>
	);
};

import { Product as ProductCollection } from "../models";

const getServerSideProps: GetServerSideProps = async context => {
	try {
		const product = await ProductCollection.findById(context.query.productId);

		if (!product) return { notFound: true };

		return {
			props: {
				product: serialize(product),
			},
		};
	} catch (error) {
		return { notFound: true };
	}
};

export { getServerSideProps };
export default Product;
