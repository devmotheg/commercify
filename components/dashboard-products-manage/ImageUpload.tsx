/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import NextImage from "next/image";
import { RiUploadCloud2Fill } from "react-icons/ri";
import { IoMdTrash } from "react-icons/io";
import { IconButton, Button } from "@mui/material";
import { Image as CloudinaryImage } from "cloudinary-react";

import type { ImageUploadProps } from "../../types";
import { useNotification } from "../../hooks";

const readFile = (file: Blob): Promise<null | string> =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);

		reader.addEventListener("loadend", () => {
			resolve(reader.result as string);
		});

		reader.addEventListener("error", () => reject(null));
	});

const uploadFile = (): Promise<null | Promise<null | string>> => {
	const allowedTypes = {
		"image/png": true,
		"image/jpeg": true,
		"image/svg": true,
	};

	return new Promise((resolve, reject) => {
		const $input = document.createElement("input") as HTMLInputElement & {
			files: FileList;
		};
		document.body.appendChild($input);

		$input.type = "file";
		$input.click(), $input.remove();

		$input.onchange = () => {
			if (!$input.files.length || !($input.files[0].type in allowedTypes))
				return resolve(null);
			resolve(readFile($input.files[0]));
		};
	});
};

const ImageUpload = ({ index, info, setInfo }: ImageUploadProps) => {
	const { addNotification } = useNotification();

	const handleClick = async () => {
		const image = await uploadFile();

		if (!image) {
			addNotification("error", "Unsupported file format, try with another one");

			return;
		}

		const newImages = info.images.slice();
		newImages[index] = image;

		setInfo({ ...info, images: newImages });
	};

	const handleDelete = () => {
		const newImages = info.images.slice();
		newImages[index] = "";

		setInfo({ ...info, images: newImages });
	};

	return (
		<div className="relative flex h-32 w-full flex-col items-center justify-center border-2 border-dotted border-slate-300">
			{info.images[index] ? (
				<>
					<div className="relative h-full w-3/5">
						{info.images[index].startsWith("dev_setups") ? (
							<CloudinaryImage
								className="h-full w-full object-contain"
								cloudName="devmotheg"
								publicId={info.images[index]}
								alt="product image"
							/>
						) : (
							<NextImage
								src={info.images[index]}
								alt="product image"
								layout="fill"
								objectFit="contain"
							/>
						)}
					</div>
					<IconButton
						className="absolute right-1 bottom-1"
						onClick={handleDelete}>
						<span className="sr-only">delete image</span>
						<IoMdTrash className="h-6 w-6 text-red-500" />
					</IconButton>
				</>
			) : (
				<>
					<RiUploadCloud2Fill className="h-10 w-10 text-slate-600" />
					<Button className="text-lg capitalize" onClick={handleClick}>
						add file
					</Button>
				</>
			)}
		</div>
	);
};

export default ImageUpload;
