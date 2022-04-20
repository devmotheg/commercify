/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import type { ChangeEvent } from "react";
import { IoMdTrash } from "react-icons/io";
import { IconButton, TextField } from "@mui/material";

import type { BulletPointProps } from "../../types";

const BulletPoint = ({ index, info, setInfo }: BulletPointProps) => {
	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const newBulletPoints = info.bulletPoints.slice();
		newBulletPoints[index] = e.target.value;

		setInfo({
			...info,
			bulletPoints: newBulletPoints,
		});
	};

	const handleDelete = () => {
		setInfo({
			...info,
			bulletPoints: info.bulletPoints.filter((p, i) => i !== index),
		});
	};

	return (
		<div className="flex items-center justify-between gap-1">
			<TextField
				className="flex-grow"
				label={`Bullet point ${index + 1}`}
				variant="outlined"
				size="small"
				required
				error={!info.bulletPoints[index]}
				inputProps={{ maxLength: 130 }}
				value={info.bulletPoints[index]}
				onChange={handleChange}
			/>
			<IconButton onClick={handleDelete}>
				<span className="sr-only">delete bullet point</span>
				<IoMdTrash className="h-6 w-6 text-red-500" />
			</IconButton>
		</div>
	);
};

export default BulletPoint;
