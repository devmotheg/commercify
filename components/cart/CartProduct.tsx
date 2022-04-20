/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import { IoMdTrash } from "react-icons/io";
import { Button, ButtonGroup, IconButton } from "@mui/material";
import { Image } from "cloudinary-react";

import type { CartProductProps } from "../../types";
import { useCart } from "../../hooks";

const CartProduct = ({ product, setProducts }: CartProductProps) => {
	const { incrementItem, decrementItem, removeItem, getCartItemQuantity } =
		useCart();

	const itemQuantity = getCartItemQuantity(product._id) || 1;

	return (
		<div className="grid grid-cols-6 items-center justify-items-center gap-3">
			<div className="col-span-2 flex w-full flex-grow items-center gap-2">
				<div className="max-w-fit shrink-0 rounded bg-slate-100 p-1">
					<Image
						className="h-16 w-16 object-contain"
						cloudName="devmotheg"
						publicId={product.images[0]}
						alt="product image"
					/>
				</div>
				<span className="block break-all text-lg">{product.title}</span>
			</div>
			<span className="block text-lg text-teal-500">${product.price}</span>
			<ButtonGroup size="small" aria-label="small outlined button group">
				<Button
					variant="text"
					className="text-lg"
					onClick={() => decrementItem(product._id)}
					disabled={itemQuantity <= 1}>
					-
				</Button>
				<Button className="!border-0 !bg-teal-500 text-lg !text-white" disabled>
					{itemQuantity}
				</Button>
				<Button
					variant="text"
					className="text-lg"
					onClick={() => incrementItem(product._id)}
					disabled={itemQuantity >= product.stock}>
					+
				</Button>
			</ButtonGroup>
			<span className="block text-lg text-teal-500">
				${product.price * itemQuantity}
			</span>
			<IconButton
				onClick={() => {
					removeItem(product._id);
					setProducts(products => products.filter(p => p._id !== product._id));
				}}>
				<span className="sr-only">delete product</span>
				<IoMdTrash className="h-6 w-6 text-red-500" />
			</IconButton>
		</div>
	);
};

export default CartProduct;
