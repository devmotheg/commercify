/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import type { AxiosError } from "axios";
import Link from "next/link";
import { useSession, getSession } from "next-auth/react";
import { useLayoutEffect } from "react";
import { useQueryClient, useMutation, useQuery } from "react-query";
import { Virtuoso } from "react-virtuoso";
import { Button } from "@mui/material";
import axios from "axios";

import type { ReviewDocument, ReviewListProps } from "../../types";
import { Review, ReviewControl, Loading } from "..";

const ReviewList = ({
	loadMore,
	canReview,
	product,
	reviews,
	setReviews,
}: ReviewListProps) => {
	const { data: session } = useSession();
	const queryClient = useQueryClient();

	const didPurchaseQuery = useQuery<unknown, unknown, boolean, string>(
		"didPurchase",
		async () => {
			if (!(await getSession())) return false;

			const res = await axios(
				`/api/products/${product._id}/purchases/?kind=boolean`
			);

			return res.data.data.didPurchase;
		}
	);

	const mutation = useMutation<
		ReviewDocument,
		AxiosError,
		{ newReview: { rating: number; comment: string } }
	>(
		async ({ newReview }) => {
			const res = await axios.post(
				`/api/products/${product._id}/reviews`,
				newReview
			);

			return res.data?.data.review;
		},
		{
			onSuccess: newReview => {
				setReviews([newReview, ...reviews]);
				queryClient.invalidateQueries(["product", product._id]);
			},
		}
	);

	useLayoutEffect(() => {
		const $virtuosoScroller: HTMLDivElement | null = document.querySelector(
				"div[data-virtuoso-scroller=true]"
			),
			$virtuosoItemList: HTMLDivElement | null = document.querySelector(
				"div[data-test-id=virtuoso-item-list]"
			);

		if ($virtuosoScroller && $virtuosoItemList) {
			const resizeWatcher = () =>
				setTimeout(
					() =>
						($virtuosoScroller.style.height = `${$virtuosoItemList.scrollHeight}px`)
				);

			const observer = new ResizeObserver(resizeWatcher);

			observer.observe($virtuosoItemList);

			return () => observer.unobserve($virtuosoItemList);
		}
	});

	if (didPurchaseQuery.isLoading) return <Loading />;

	return (
		<div className="max-h-full">
			<span className="mb-2 block text-center text-2xl font-bold capitalize">
				product reviews
			</span>
			<div className="mb-4 w-full">
				{session?.user ? (
					didPurchaseQuery?.data ? (
						<ReviewControl
							initialIsActive={false}
							initialRating={0}
							initialComment=""
							alt={session?.user.name!}
							src={session?.user.image!}
							clickHandler={(rating, comment) => {
								mutation.mutate({ newReview: { rating, comment } });
							}}
							canReview={canReview && !mutation.isLoading}
							text="review"
						/>
					) : (
						<span className="block text-center font-bold text-teal-500">
							Purchase this product to be able to review it
						</span>
					)
				) : (
					<Link href="/auth/signin">
						<a className="mx-auto block w-fit">
							<Button
								className="w-full bg-teal-500 capitalize text-white"
								variant="text">
								Sign in to be able to engage
							</Button>
						</a>
					</Link>
				)}
			</div>
			{reviews.length ? (
				<Virtuoso
					useWindowScroll
					data={reviews}
					atBottomStateChange={atBottom => {
						if (atBottom) loadMore();
					}}
					itemContent={(index, review) => {
						return (
							<Review
								canReview={canReview && !mutation.isLoading}
								review={review}
								setReviews={setReviews}
							/>
						);
					}}
				/>
			) : (
				<span className="block text-center">
					Currently this product has no reviews
				</span>
			)}
		</div>
	);
};

export default ReviewList;
