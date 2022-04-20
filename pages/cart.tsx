/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import type { AxiosError } from "axios";
import { useRouter } from "next/router";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useQuery, useMutation } from "react-query";
import { Divider, Button } from "@mui/material";
import axios from "axios";

import type {
	NextPageWithAuth,
	ProductDocument,
	CartProviderState,
} from "../types";
import { Header, Footer, Loading, CartProduct } from "../components";
import { useCart, useNotification } from "../hooks";

const Cart: NextPageWithAuth = () => {
	const { addNotification } = useNotification();
	const router = useRouter();
	const {
		getCartState,
		clearItems,
		getCartItemIds,
		getCartItemQuantity,
		replaceItems,
	} = useCart();
	const { data: session } = useSession();
	const [products, setProducts] = useState<ProductDocument[]>([]);

	const queryKey = ["cartProducts", getCartItemIds()] as const;

	const query = useQuery<unknown, unknown, ProductDocument[], typeof queryKey>(
		queryKey,
		async ({ queryKey }) => {
			const res = await axios({
				method: "POST",
				url: "/api/products/?kind=populateIds",
				data: queryKey[1],
			});

			return res.data?.data.products;
		},
		{
			onSuccess: products => {
				replaceItems(
					getCartState().filter(i => products.find(p => p._id === i.product))
				);
				setProducts(products);
			},
			enabled: !products.length,
		}
	);

	const mutation = useMutation<
		void,
		AxiosError,
		{ cartState: CartProviderState }
	>(
		async ({ cartState }) => {
			const res = await axios.post(
				"/api/stripe/create-checkout-session",
				cartState
			);

			router.push(res.data?.data.url);
		},
		{
			onError: err => {
				addNotification(
					"error",
					"An error occurred with our connection to Stripe"
				);
			},
		}
	);

	const subtotal = products.reduce(
			(acc, val) => acc + val.price * (getCartItemQuantity(val._id) || 1),
			0
		),
		fees = ((5 / 100) * subtotal) | 0;

	return (
		<div className="grid min-h-screen grid-flow-row grid-rows-[auto_1fr_auto]">
			<Header />
			{query.isLoading ? (
				<Loading />
			) : !products.length ? (
				<main className="flex h-full flex-col items-center justify-center">
					<span className="block p-4 text-center text-3xl capitalize">
						your cart is currently empty
					</span>
					<Link href="/">
						<a>
							<Button
								variant="contained"
								className="mx-auto mt-1 block text-lg capitalize">
								fill it
							</Button>
						</a>
					</Link>
				</main>
			) : (
				<main className="container mx-auto flex w-5/6 flex-col gap-4">
					<div className="grid grid-cols-6 items-center justify-items-center gap-3">
						<span className="col-span-2 text-lg font-bold capitalize">
							product
						</span>
						<span className="text-lg font-bold capitalize">price</span>
						<span className="text-lg font-bold capitalize">quantity</span>
						<span className="text-lg font-bold capitalize">subtotal</span>
						<span className="text-lg font-bold capitalize">manage</span>
					</div>
					<Divider variant="middle" />
					<div className="my-2 flex flex-col gap-4">
						{products?.map(p => (
							<CartProduct key={p._id} product={p} setProducts={setProducts} />
						))}
					</div>
					<Divider variant="middle" />
					<Button
						variant="contained"
						className="w-fits mx-auto bg-red-500 capitalize text-white"
						onClick={() => {
							clearItems();
							setProducts([]);
						}}>
						clear cart
					</Button>
					<div className="ml-auto w-fit">
						<div className="mb-2 w-fit rounded px-12 py-4">
							<div className="my-3 text-lg capitalize">
								<div className="mb-1 grid grid-cols-[200px_1fr]">
									<span className="flex-grow">subtotal:</span>${subtotal}
								</div>
								<div className="grid grid-cols-[200px_1fr]">
									<span className="flex-grow">fees:</span>${fees}
								</div>
							</div>
							<Divider variant="middle" />
							<div className="my-4 grid grid-cols-[200px_1fr] text-2xl font-bold capitalize">
								<span className="flex-grow">order total:</span>$
								{subtotal + fees}
							</div>
						</div>
						{!session?.user ? (
							<Link href="/auth/signin">
								<a>
									<Button
										className="block w-full bg-teal-500 text-lg capitalize text-white"
										variant="text">
										sign in to continue
									</Button>
								</a>
							</Link>
						) : (
							<Button
								className="block w-full bg-teal-500 text-lg capitalize text-white"
								variant="contained"
								onClick={() => mutation.mutate({ cartState: getCartState() })}
								disabled={mutation.isLoading}>
								proceed to checkout
							</Button>
						)}
					</div>
				</main>
			)}
			<Footer />
		</div>
	);
};

export default Cart;
