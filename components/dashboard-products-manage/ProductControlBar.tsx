/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import type { AxiosError } from "axios";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { useMutation, useQueryClient } from "react-query";
import { ButtonGroup, Button } from "@mui/material";
import axios from "axios";

import type { ProductControlBarProps } from "../../types";
import { useNotification } from "../../hooks";

const ProductControlBar = ({ info }: ProductControlBarProps) => {
	const queryClient = useQueryClient();
	const router = useRouter();
	const { addNotification } = useNotification();

	const mutation = useMutation<void, AxiosError, { info: typeof info }>(
		async ({ info }) => {
			if (router.query.product)
				await axios.patch(`/api/products/${router.query.product}`, info);
			else await axios.post("/api/products", info);
		},
		{
			onSuccess: () => {
				queryClient.invalidateQueries("userProducts");
				router.push("/dashboard/products");
			},
			onError: err => {
				let message = err.response?.data?.message || "Something went wrong";
				if (err.response?.status === 413)
					message =
						"Image sizes are too large, consider uploading them separately";

				addNotification("error", message);
			},
		}
	);

	const handleSubmit = () => {
		const requiredTexts = {
			title: true,
			stock: true,
			price: true,
			condition: true,
			category: true,
		};

		for (const text of Object.keys(requiredTexts))
			if (!info[text as keyof typeof requiredTexts])
				return addNotification("error", "Fill in all the required fields");

		if (info.images.every(i => i === ""))
			return addNotification("error", "Atleast upload one image");

		if (info.bulletPoints.includes(""))
			return addNotification("error", "Fill in the added bullet points");

		mutation.mutate({
			info: { ...info, images: info.images.filter(i => !!i) },
		});
	};

	return (
		<header className="container mx-auto my-2 grid w-5/6 p-2">
			<nav className="flex items-center justify-between gap-8">
				<Link href="/">
					<a className="block text-center">
						<Button className="rounded-full">
							<span className="sr-only">home</span>
							<Image src="/logo.png" alt="logo" width="60" height="60" />
						</Button>
					</a>
				</Link>
				<ButtonGroup>
					<Button
						className="bg-red-500 capitalize text-white"
						variant="contained"
						onClick={() => router.back()}
						disabled={mutation.isLoading}>
						discard
					</Button>
					<Button
						className="bg-teal-500 capitalize text-white"
						variant="contained"
						onClick={handleSubmit}
						disabled={mutation.isLoading}>
						save
					</Button>
				</ButtonGroup>
			</nav>
		</header>
	);
};

export default ProductControlBar;
