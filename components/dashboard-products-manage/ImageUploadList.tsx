/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import { ImageUpload } from ".";

import type { ImageUploadListProps } from "../../types";

const ImageUploadList = ({ info, setInfo }: ImageUploadListProps) => {
	return (
		<div className="mx-auto grid w-2/3 grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] justify-items-center gap-2 border-2 border-dotted border-slate-300 p-2">
			{info.images.map((b, i) => (
				<ImageUpload key={i} index={i} info={info} setInfo={setInfo} />
			))}
		</div>
	);
};

export default ImageUploadList;
