/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import type { ChangeEvent } from "react";
import type { SelectChangeEvent } from "@mui/material";
import { useState } from "react";
import { useQuery } from "react-query";
import {
	Pagination,
	Divider,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
} from "@mui/material";
import axios from "axios";

import type { ProductDocument, ProductListFiltersState } from "../../types";
import { ProductCard, Loading } from "..";
import { productConditions, productCategories } from "../../data";

const PAGE_LIMIT = 10;

const ProductCardList = () => {
	const [page, setPage] = useState(1);
	const [filters, setFilters] = useState<ProductListFiltersState>({
		condition: "any",
		category: "any",
	});

	let filterStr = "";
	for (const key of Object.keys(filters)) {
		let val: string = filters[key as keyof typeof filters];
		if (val === "any") continue;

		filterStr += `&${key}=${val}`;
	}

	const countQueryKey = ["userProductsCount", filterStr];

	const countQuery = useQuery<unknown, unknown, number, typeof countQueryKey>(
		countQueryKey,
		async ({ queryKey }) => {
			const res = await axios(`/api/products/?action=count${queryKey[1]}`);

			return res.data?.data.count;
		}
	);

	const productsQueryKey = ["userProducts", page, filterStr];

	const productsQuery = useQuery<
		unknown,
		unknown,
		ProductDocument[],
		typeof productsQueryKey
	>(
		productsQueryKey,
		async ({ queryKey }) => {
			const res = await axios(
				`/api/products?page=${queryKey[1]}&limit=${PAGE_LIMIT}${queryKey[2]}`
			);

			return res.data?.data.products;
		},
		{
			keepPreviousData: true,
		}
	);

	const handleFilters = (e: SelectChangeEvent) => {
		const target = e.target;
		const name = target.name;
		setFilters({ ...filters, [name]: target.value });
	};

	const handlePagination = (event: ChangeEvent<unknown>, value: number) =>
		setPage(value);

	if (productsQuery.isLoading || countQuery.isLoading) return <Loading />;

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center gap-2">
				<span className="font-bold capitalize">
					{productsQuery.data?.length} products found
				</span>
				<Divider className="flex-grow" color="primary" variant="middle" />
				{(
					[
						["condition" as const, productConditions],
						["category" as const, productCategories],
					] as const
				).map(g => {
					return (
						<FormControl sx={{ minWidth: 80 }} key={g[0]} size="small">
							<InputLabel className="capitalize">{g[0]}</InputLabel>
							<Select
								label={`${g[0]} *`}
								name={g[0]}
								value={filters[g[0]]}
								onChange={handleFilters}>
								{["any", ...g[1]].map(f => (
									<MenuItem key={f} value={f}>
										{f[0].toUpperCase() + f.slice(1)}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					);
				})}
			</div>
			{productsQuery.data?.length ? (
				<>
					<div className="grid grid-cols-[repeat(auto-fill,minmax(18rem,1fr))] justify-items-center gap-5">
						{productsQuery.data?.map(p => (
							<ProductCard key={p._id} product={p} />
						))}
					</div>
					<Pagination
						className="mx-auto"
						count={Math.ceil(countQuery.data! / PAGE_LIMIT)}
						page={page}
						onChange={handlePagination}
						disabled={productsQuery.isFetching || productsQuery.isPreviousData}
					/>
				</>
			) : (
				<p className="p-3 text-center text-3xl">No products found</p>
			)}
		</div>
	);
};

export default ProductCardList;
