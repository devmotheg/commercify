/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import { Button } from "@mui/material";

import type { BulletPointListProps } from "../../types";
import { BulletPoint } from ".";

const BulletPointList = ({ info, setInfo }: BulletPointListProps) => {
	const addBulletPoint = () => {
		if (info.bulletPoints.length >= 5) return;

		setInfo({ ...info, bulletPoints: info.bulletPoints.concat("") });
	};

	return (
		<div>
			<div className="mb-4 grid grid-cols-[repeat(auto-fill,minmax(24rem,1fr))] gap-4">
				{info.bulletPoints.map((p, i) => (
					<BulletPoint key={i} index={i} info={info} setInfo={setInfo} />
				))}
			</div>
			<Button className="capitalize" onClick={addBulletPoint}>
				Add a bullet point
			</Button>
		</div>
	);
};

export default BulletPointList;
