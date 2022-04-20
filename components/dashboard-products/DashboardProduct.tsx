/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import type { AxiosError } from "axios";
import Link from "next/link";
import { useMutation, useQueryClient } from "react-query";
import { IoMdTrash } from "react-icons/io";
import { RiEditBoxFill } from "react-icons/ri";
import { IconButton } from "@mui/material";
import { Image } from "cloudinary-react";
import axios from "axios";

import type { DashboardProductProps } from "../../types";

const DashboardProduct = ({ product }: DashboardProductProps) => {
	const queryClient = useQueryClient();

	const mutation = useMutation<void, AxiosError, void>(
		async () => {
			await axios.delete(`/api/products/${product._id}`);
		},
		{
			onSuccess: () => queryClient.invalidateQueries("userProducts"),
		}
	);

	return (
		<div className="grid grid-cols-6 items-center justify-items-center gap-3">
			<div className="col-span-3 flex w-full flex-grow items-center gap-2">
				<div className="max-w-fit shrink-0 border-2 border-dotted border-slate-300">
					<Image
						className="h-20 w-20 object-contain"
						cloudName="devmotheg"
						publicId={product.images[0]}
						alt="product image"
					/>
				</div>
				<div>
					<span className="mb-1 block break-all text-lg text-teal-500">
						ID: {product._id}
					</span>
					<span className="block break-all text-lg">
						Title: {product.title}
					</span>
				</div>
			</div>
			<span className="text-center text-lg">{product.stock} in stock</span>
			<span className="text-center text-lg">${product.price}</span>
			<div className="flex items-center gap-1">
				<IconButton onClick={() => mutation.mutate()}>
					<span className="sr-only">delete product</span>
					<IoMdTrash className="h-6 w-6 text-red-500" />
				</IconButton>
				<Link href={`/dashboard/products/manage/?product=${product._id}`}>
					<a>
						<IconButton>
							<span className="sr-only">edit product</span>
							<RiEditBoxFill className="h-6 w-6 text-teal-500" />
						</IconButton>
					</a>
				</Link>
			</div>
		</div>
	);
};

export default DashboardProduct;
