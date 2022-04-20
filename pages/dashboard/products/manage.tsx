/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import type { GetServerSideProps } from "next";
import type { ChangeEvent } from "react";
import type { SelectChangeEvent } from "@mui/material";
import { useState } from "react";
import {
	TextField,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
} from "@mui/material";

import type {
	NextPageWithAuth,
	DashboardProductsManageProps,
	ProductManageInfoState,
} from "../../../types";
import {
	ProductControlBar,
	Footer,
	ImageUploadList,
	BulletPointList,
} from "../../../components";
import { productConditions, productCategories } from "../../../data";

const DashboardProductsManage: NextPageWithAuth = ({
	productInfo,
}: DashboardProductsManageProps) => {
	const [info, setInfo] = useState<ProductManageInfoState>(productInfo);

	const handleChange = (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
	) => {
		const target = e.target;
		const name = target.name;
		setInfo({ ...info, [name]: target.value });
	};

	return (
		<div>
			<ProductControlBar info={info} />
			<main className="container mx-auto w-5/6 space-y-8">
				<div className="mx-auto grid w-2/3 gap-3 p-3 shadow">
					<TextField
						label="Title"
						variant="outlined"
						size="small"
						required
						error={!info.title}
						inputProps={{ maxLength: 80 }}
						name="title"
						value={info.title}
						onChange={handleChange}
					/>
					<TextField
						label="Stock"
						variant="outlined"
						size="small"
						type="number"
						required
						error={!info.stock}
						inputProps={{ min: 0, max: 100 }}
						name="stock"
						value={info.stock}
						onChange={handleChange}
						onKeyPress={e => {
							if (e?.key === "-" || e?.key === "+") {
								e.preventDefault();
							}
						}}
					/>
					<TextField
						label="Price"
						variant="outlined"
						size="small"
						type="number"
						required
						error={!info.price}
						inputProps={{ min: 0, max: 100000 }}
						name="price"
						value={info.price}
						onChange={handleChange}
						onKeyPress={e => {
							if (e?.key === "-" || e?.key === "+") {
								e.preventDefault();
							}
						}}
					/>
					<TextField
						label="Description"
						size="small"
						multiline
						maxRows={5}
						inputProps={{ maxLength: 256 }}
						name="description"
						value={info.description}
						onChange={handleChange}
					/>
					<BulletPointList info={info} setInfo={setInfo} />
				</div>
				<div className="mx-auto grid w-2/3 grid-cols-[repeat(auto-fill,minmax(24rem,1fr))] justify-items-center gap-4">
					{(
						[
							["condition" as const, productConditions],
							["category" as const, productCategories],
						] as const
					).map(g => {
						return (
							<FormControl
								sx={{ minWidth: 80 }}
								key={g[0]}
								className="w-full"
								size="small"
								required
								error={!info[g[0]]}>
								<InputLabel className="capitalize">{g[0]}</InputLabel>
								<Select
									label={`${g[0]} *`}
									name={g[0]}
									value={info[g[0]]}
									onChange={handleChange}>
									{g[1].map(c => (
										<MenuItem key={c} value={c}>
											{c[0].toUpperCase() + c.slice(1)}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						);
					})}
				</div>
				<ImageUploadList info={info} setInfo={setInfo} />
			</main>
			<Footer />
		</div>
	);
};

DashboardProductsManage.auth = {
	usersOnly: true,
};

import { Product } from "../../../models";

const getServerSideProps: GetServerSideProps = async context => {
	const productInfo: ProductManageInfoState = {
		title: "",
		stock: "",
		price: "",
		condition: "new",
		images: new Array(5).fill(""),
		category: "other",
		description: "",
		bulletPoints: [],
	};

	if (context.query.product) {
		try {
			const product = await Product.findById(context.query.product);

			if (!product) return { notFound: true };

			productInfo.title = product.title;
			productInfo.stock = String(product.stock);
			productInfo.price = String(product.price);
			productInfo.condition = product.condition;
			productInfo.category = product.category;
			productInfo.description = product.description || "";
			productInfo.bulletPoints = product.bulletPoints || [];

			for (let i = 0; i < product.images.length; i++)
				productInfo.images[i] = product.images[i];
		} catch (error) {
			return { notFound: true };
		}
	}

	return {
		props: {
			productInfo,
		},
	};
};

export { getServerSideProps };
export default DashboardProductsManage;
