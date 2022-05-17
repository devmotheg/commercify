/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import { useState } from "react";
import { useQuery, useInfiniteQuery } from "react-query";
import axios from "axios";
import { Rating, Button } from "@mui/material";
import { Image } from "cloudinary-react";

import type {
	ProductDetailsProps,
	ProductDocument,
	ReviewDocument,
} from "../../types";
import { Loading, ReviewList } from "..";
import { useCart } from "../../hooks";

const ProductDetails = ({ product }: ProductDetailsProps) => {
	const { addItem, isItemInCart, removeItem } = useCart();
	const [activeImage, setActiveImage] = useState(0);
	const [reviews, setReviews] = useState<ReviewDocument[]>([]);

	const reviewsQueryKey = ["productReviews", product._id];

	const reviewsQuery = useInfiniteQuery<
		ReviewDocument[],
		void,
		ReviewDocument[],
		typeof reviewsQueryKey
	>(
		reviewsQueryKey,
		async ({ queryKey, pageParam = 1 }) => {
			const res = await axios(
				`/api/products/${queryKey[1]}/reviews/?page=${pageParam}`
			);

			return res.data?.data.reviews;
		},
		{
			getNextPageParam(lastPage, allPages) {
				return lastPage.length < 10 ? undefined : allPages.length + 1;
			},
			onSuccess: data => {
				setReviews([...reviews, ...data.pages[data.pages.length - 1]]);
			},
		}
	);

	const productQueryKey = ["product", product._id];

	const productQuery = useQuery<
		unknown,
		unknown,
		ProductDocument,
		typeof productQueryKey
	>(
		productQueryKey,
		async ({ queryKey }) => {
			const res = await axios(`/api/products/${queryKey[1]}`);

			return res.data?.data.product;
		},
		{
			initialData: product,
		}
	);

	const itemInCartBool = isItemInCart(product._id);

	return (
		<main className="container mx-auto min-h-full w-5/6">
			<div className="mb-14 grid justify-center gap-12 lg:grid-cols-2">
				<div className="relative flex h-fit max-h-full w-full max-w-sm flex-row-reverse items-start justify-center gap-4 justify-self-center lg:sticky lg:top-2 lg:justify-self-end">
					<Image
						className="h-auto max-h-96 w-full rounded bg-slate-100 object-contain p-1 align-top shadow-lg"
						cloudName="devmotheg"
						publicId={productQuery.data?.images[activeImage]}
						alt="product image"
					/>
					<div className="space-y-2">
						{productQuery.data?.images.map((m, i) => (
							<div
								key={m}
								className="group h-14 w-14 cursor-zoom-in"
								onMouseEnter={() => setActiveImage(i)}>
								<Image
									className={`h-full w-full rounded bg-slate-100 object-contain p-1 transition-all group-hover:ring-2 group-hover:ring-teal-500 ${
										activeImage === i ? "ring-2 ring-teal-500" : ""
									}`}
									cloudName="devmotheg"
									publicId={m}
									alt="product image"
								/>
							</div>
						))}
					</div>
				</div>
				<div className="justify-self-start">
					<div className="mb-3">
						<p className="mb-1 break-all text-3xl">
							{productQuery.data?.title}
						</p>
						<div className="mb-1 flex items-center gap-1">
							<Rating
								size="small"
								value={productQuery.data?.rating.average}
								readOnly
							/>
							<span className="text-sm text-teal-500">
								{productQuery.data?.rating.quantity} reviews
							</span>
						</div>
						<p className="capitalize">
							price:{" "}
							<span className="text-teal-500">${productQuery.data?.price}</span>
						</p>
					</div>
					{!!productQuery.data?.bulletPoints?.length && (
						<div className="mb-3">
							<span className="block text-lg font-bold">About this item</span>
							<ul className="list-inside list-disc">
								{productQuery.data?.bulletPoints?.map((p, i) => (
									<li key={i}>{p}</li>
								))}
							</ul>
						</div>
					)}
					{!!productQuery.data?.description && (
						<div className="mb-3">
							<span className="block text-lg font-bold">
								More details on this item
							</span>
							<p className="whitespace-pre-wrap break-all">
								{productQuery.data?.description}
							</p>
						</div>
					)}
					<div>
						<span
							className="mb-1 block font-bold capitalize"
							style={{
								color: productQuery.data?.stock
									? "rgb(20 184 166)"
									: "rgb(239 68 68)",
							}}>
							{!!productQuery.data?.stock
								? `in stock (${productQuery.data?.stock})`
								: "out of stock"}
						</span>
						<Button
							className="mr-1 inline-block bg-teal-500 capitalize text-white disabled:bg-red-500 disabled:text-white"
							variant="text"
							onClick={() => {
								if (itemInCartBool) removeItem(product._id);
								else addItem(product._id);
							}}
							disabled={!productQuery.data?.stock}>
							{itemInCartBool ? "remove from cart" : "add to cart"}
						</Button>
					</div>
				</div>
			</div>
			{reviewsQuery.isLoading ? (
				<Loading />
			) : (
				<ReviewList
					canReview={!reviewsQuery.isFetching && !productQuery.isFetching}
					product={product}
					loadMore={() => {
						if (reviewsQuery.hasNextPage) reviewsQuery.fetchNextPage();
					}}
					reviews={reviews}
					setReviews={setReviews}
				/>
			)}
		</main>
	);
};

export default ProductDetails;
