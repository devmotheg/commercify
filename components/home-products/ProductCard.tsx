/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import Link from "next/link";
import {
	MdOutlineAddShoppingCart,
	MdOutlineRemoveShoppingCart,
} from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { IconButton, Rating } from "@mui/material";
import { Image } from "cloudinary-react";

import type { ProductCardProps } from "../../types";
import { useCart } from "../../hooks";

const ProductCard = ({ product }: ProductCardProps) => {
	const { addItem, isItemInCart, removeItem } = useCart();

	const itemInCartBool = isItemInCart(product._id);

	return (
		<div className="flex w-full flex-col justify-between rounded p-2 shadow transition hover:-translate-y-1 hover:shadow-md">
			<Image
				className="mb-4 h-32 w-full rounded bg-slate-100 object-contain p-1"
				cloudName="devmotheg"
				publicId={product.images[0]}
				alt="product image"
			/>
			<div>
				<span className="mb-2 block break-all">{product.title}</span>
				<div className="flex items-center justify-between gap-3">
					<div>
						<div className="flex items-center gap-1">
							<Rating size="small" value={product.rating.average} readOnly />
							<span className="text-sm text-teal-500">
								{product.rating.quantity} ratings
							</span>
						</div>
						<span className="block text-teal-500">${product.price}</span>
					</div>
					<div className="flex items-center gap-1">
						<IconButton
							onClick={() => {
								if (itemInCartBool) removeItem(product._id);
								else addItem(product._id);
							}}
							disabled={!product.stock}>
							<span className="sr-only">
								{itemInCartBool ? "add to cart" : "remove from cart"}
							</span>
							{itemInCartBool ? (
								<MdOutlineRemoveShoppingCart className="h-7 w-7 text-teal-500" />
							) : (
								<MdOutlineAddShoppingCart
									className={`h-7 w-7 ${
										product.stock ? "text-teal-500" : "text-red-500"
									}`}
								/>
							)}
						</IconButton>
						<Link href={`/${product._id}`}>
							<a>
								<IconButton>
									<span className="sr-only">see product</span>
									<FaEye className="h-7 w-7 text-teal-500" />
								</IconButton>
							</a>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProductCard;
