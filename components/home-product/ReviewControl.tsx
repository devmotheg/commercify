/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import { useState } from "react";
import { Rating, Avatar, TextField, Button } from "@mui/material";

import type { ReviewControlProps } from "../../types";

const ReviewControl = ({
	initialIsActive,
	initialRating,
	initialComment,
	alt,
	src,
	clickHandler,
	cancelHandler,
	canReview,
	text,
}: ReviewControlProps) => {
	const [isActive, setIsActive] = useState(initialIsActive);
	const [rating, setRating] = useState(initialRating);
	const [comment, setComment] = useState(initialComment);

	const resetReview = () => {
		setIsActive(initialIsActive),
			setRating(initialRating),
			setComment(initialComment);
	};

	return (
		<div className="mb-4 w-full">
			<div className="items-top flex gap-3">
				<Avatar
					alt={alt}
					src={src}
					sx={{ width: 42, height: 42 }}
					imgProps={{
						referrerPolicy: "no-referrer",
					}}
				/>
				<div className="w-full">
					{isActive && (
						<Rating
							size="small"
							value={rating}
							onChange={(event, newValue) => {
								setRating(newValue ?? 0);
							}}
						/>
					)}
					<TextField
						className="w-full"
						placeholder="Add comment..."
						size="small"
						variant="standard"
						multiline
						maxRows={5}
						inputProps={{ maxLength: 600 }}
						onFocus={() => setIsActive(true)}
						value={comment}
						onChange={e => setComment(e.target.value)}
					/>
				</div>
			</div>
			{isActive && (
				<div className="ml-auto mt-1 w-fit">
					<Button
						className="mr-1 inline-block capitalize"
						variant="text"
						onClick={() => {
							resetReview();
							if (cancelHandler) cancelHandler();
						}}>
						cancel
					</Button>
					<Button
						className="inline-block capitalize"
						variant="text"
						onClick={() => {
							clickHandler(rating, comment), resetReview();
							if (cancelHandler) cancelHandler();
						}}
						disabled={!comment || !rating || !canReview}>
						{text}
					</Button>
				</div>
			)}
		</div>
	);
};

export default ReviewControl;
