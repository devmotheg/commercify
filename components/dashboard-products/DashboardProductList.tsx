/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import type { ChangeEvent } from "react";
import { useState } from "react";
import { useQuery } from "react-query";
import { Pagination } from "@mui/material";
import axios from "axios";

import type { ProductDocument } from "../../types";
import { DashboardProduct, Loading } from "..";

const PAGE_LIMIT = 5;

const DashboardProductList = () => {
	const [page, setPage] = useState(1);

	const countQueryKey = ["userProductsCount"];

	const countQuery = useQuery<unknown, unknown, number, typeof countQueryKey>(
		countQueryKey,
		async () => {
			const res = await axios(`/api/products/?action=count&kind=userProducts`);

			return res.data?.data.count;
		}
	);

	const productsQueryKey = ["userProducts", page];

	const productsQuery = useQuery<
		unknown,
		unknown,
		ProductDocument[],
		typeof productsQueryKey
	>(
		productsQueryKey,
		async ({ queryKey }) => {
			const res = await axios(
				`/api/products?kind=userProducts&page=${queryKey[1]}&limit=${PAGE_LIMIT}`
			);

			return res.data?.data.products;
		},
		{
			keepPreviousData: true,
		}
	);

	const handleChange = (event: ChangeEvent<unknown>, value: number) =>
		setPage(value);

	if (productsQuery.isLoading || countQuery.isLoading) return <Loading />;

	return (
		<div className="flex flex-col gap-4">
			{productsQuery.data?.length ? (
				<>
					<div className="grid grid-cols-6 justify-items-center gap-3">
						<span className="col-span-3 text-xl font-bold capitalize">
							product
						</span>
						<span className="text-xl font-bold capitalize">inventory</span>
						<span className="text-xl font-bold capitalize">price</span>
						<span className="text-xl font-bold capitalize">manage</span>
					</div>
					{productsQuery.data?.map(p => (
						<DashboardProduct key={p._id} product={p} />
					))}
					<Pagination
						count={Math.ceil(countQuery.data! / PAGE_LIMIT)}
						page={page}
						onChange={handleChange}
						disabled={productsQuery.isFetching || productsQuery.isPreviousData}
					/>
				</>
			) : (
				<p className="p-3 text-center text-3xl">
					No products found, click the above button to add new products
				</p>
			)}
		</div>
	);
};

export default DashboardProductList;
