/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import type { MouseEvent } from "react";
import type { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { FiMoreVertical } from "react-icons/fi";
import { IoMdTrash } from "react-icons/io";
import { RiEditBoxFill } from "react-icons/ri";
import {
	Avatar,
	Rating,
	Menu,
	MenuItem,
	IconButton,
	ListItemIcon,
	ListItemText,
} from "@mui/material";
import axios from "axios";

import type { ReviewProps, UserDocument, ReviewDocument } from "../../types";
import { ReviewControl } from ".";

const Review = ({ review, setReviews, canReview }: ReviewProps) => {
	const [isEditing, setIsEditing] = useState(false);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const { data: session } = useSession();
	const queryClient = useQueryClient();

	const deleteMutation = useMutation<
		void,
		void,
		{ reviewId: typeof review._id }
	>(
		async ({ reviewId }) => {
			await axios.delete(`/api/products/${review.product}/reviews/${reviewId}`);
		},
		{
			onSuccess: () => {
				setReviews(reviews => reviews.filter(r => r._id !== review._id));
				queryClient.invalidateQueries(["product", review.product]);
			},
		}
	);

	const updateMutation = useMutation<
		ReviewDocument,
		AxiosError,
		{
			reviewId: typeof review._id;
			updatedReview: { rating: number; comment: string };
		}
	>(
		async ({ reviewId, updatedReview }) => {
			const res = await axios.patch(
				`/api/products/${review.product}/reviews/${reviewId}`,
				updatedReview
			);

			return res.data?.data.review;
		},
		{
			onSuccess: updatedReview => {
				setReviews(reviews =>
					reviews.map(r => (r._id === review._id ? updatedReview : r))
				);
				queryClient.invalidateQueries(["product", review.product]);
			},
		}
	);

	const handleClick = (event: MouseEvent<HTMLButtonElement>) =>
		setAnchorEl(event.currentTarget);

	const handleClose = () => setAnchorEl(null);

	const customer = review.customer as UserDocument;

	if (isEditing)
		return (
			<ReviewControl
				initialIsActive={true}
				initialRating={review.rating}
				initialComment={review.comment}
				alt={customer.name}
				src={customer.image}
				clickHandler={(rating, comment) => {
					updateMutation.mutate({
						reviewId: review._id,
						updatedReview: { rating, comment },
					});
				}}
				cancelHandler={() => setIsEditing(false)}
				canReview={canReview && !updateMutation.isLoading}
				text="save"
			/>
		);

	return (
		<div>
			<div className="items-top group flex gap-3 py-2">
				<Avatar
					alt={customer.name}
					src={customer.image}
					sx={{ width: 42, height: 42 }}
					imgProps={{
						referrerPolicy: "no-referrer",
					}}
				/>
				<div className="w-full">
					<span className="mb-1 block text-sm font-bold">{customer.name}</span>
					<Rating size="small" readOnly value={review.rating} />
					<p className="whitespace-pre-wrap break-all">{review.comment}</p>
				</div>
				{session?.user && session.id === customer._s && (
					<>
						<IconButton
							className={`h-fit w-fit transition-all group-hover:visible group-hover:opacity-100 ${
								Boolean(anchorEl)
									? "visible opacity-100"
									: "invisible opacity-0"
							}`}
							onClick={handleClick}>
							<span className="sr-only">review menu</span>
							<FiMoreVertical className="h-6 w-6 text-teal-500" />
						</IconButton>
						<Menu
							anchorEl={anchorEl}
							open={Boolean(anchorEl)}
							onClose={handleClose}>
							<MenuItem
								onClick={() => {
									handleClose(),
										deleteMutation.mutate({ reviewId: review._id });
								}}
								disabled={!canReview || deleteMutation.isLoading}>
								<ListItemIcon>
									<IoMdTrash className="h-5 w-5 text-slate-600" />
								</ListItemIcon>
								<ListItemText>
									<span className="font-bold capitalize text-slate-600">
										delete
									</span>
								</ListItemText>
							</MenuItem>
							<MenuItem
								onClick={() => {
									handleClose(), setIsEditing(true);
								}}>
								<ListItemIcon>
									<RiEditBoxFill className="h-5 w-5 text-slate-600" />
								</ListItemIcon>
								<ListItemText>
									<span className="font-bold capitalize text-slate-600">
										edit
									</span>
								</ListItemText>
							</MenuItem>
						</Menu>
					</>
				)}
			</div>
		</div>
	);
};

export default Review;
