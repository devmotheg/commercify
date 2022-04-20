/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import { useMemo } from "react";
import { useQuery } from "react-query";
import { BiArrowToTop, BiArrowToBottom } from "react-icons/bi";
import { AiOutlineLine } from "react-icons/ai";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";
import axios from "axios";

import type { NextPageWithAuth } from "../../types";
import { Header, Footer, Loading } from "../../components";

const getTotalQuantity = (monthAnalytics: any) =>
	monthAnalytics.reduce((acc: number, val: any) => acc + val.salesQuantity, 0);

const DashboardAnalytics: NextPageWithAuth = () => {
	const query = useQuery<unknown, unknown, any, string>(
		"lastTwoMonthsAnalaytics",
		async () => {
			const res = await axios("/api/analytics");

			return res.data?.data;
		}
	);

	const boxData = useMemo(() => {
		if (!query.data) return;

		const { previousMonthAnalytics, currentMonthAnalytics } = query.data;

		const totalPreviousMonthQuantity = getTotalQuantity(previousMonthAnalytics),
			totalCurrentMonthQuantity = getTotalQuantity(currentMonthAnalytics);

		return (
			Math.floor(
				(totalCurrentMonthQuantity - totalPreviousMonthQuantity) /
					totalPreviousMonthQuantity
			) * 100
		);
	}, [query]);

	const chartData = useMemo(() => {
		if (!query.data) return;

		const { previousMonthAnalytics, currentMonthAnalytics } = query.data;

		const data = [];
		const len = Math.max(
			previousMonthAnalytics.length,
			currentMonthAnalytics.length
		);

		for (let i = 0; i < len; i++) {
			const currDayAnalytic: { [index: string]: any } = {
				name: !Math.floor((i + 1) / 10) ? `0${i + 1}` : i + 1,
			};

			if (previousMonthAnalytics[i])
				currDayAnalytic["Previous Month"] =
					previousMonthAnalytics[i].salesMoney;
			if (currentMonthAnalytics[i])
				currDayAnalytic["Current Month"] = currentMonthAnalytics[i].salesMoney;

			data.push(currDayAnalytic);
		}

		return data;
	}, [query]);

	return (
		<div className="grid min-h-screen grid-flow-row grid-rows-[auto_1fr_auto]">
			<Header />
			<main className="container mx-auto flex h-full w-5/6 flex-col items-center gap-5">
				{query.isLoading ? (
					<Loading />
				) : (
					<>
						<div className="self-start rounded p-6 pr-12 shadow-lg">
							<span className="mb-1 block text-xl font-bold capitalize">
								sales qunatity
							</span>
							<div className="mb-4 flex items-center gap-5">
								<span className="text-3xl font-bold">
									{getTotalQuantity(query.data.currentMonthAnalytics)}
								</span>
								<div className="flex items-center gap-1">
									<span
										className={`${
											Number.isFinite(boxData)
												? "text-lg"
												: "text-sm capitalize"
										}`}>
										{Number.isFinite(boxData)
											? `${boxData}%`
											: "no sales in previous month"}
									</span>
									{!boxData || !Number.isFinite(boxData) ? (
										<AiOutlineLine className="h-8 w-8 text-slate-600" />
									) : boxData < 0 ? (
										<BiArrowToBottom className="h-8 w-8 text-red-500" />
									) : (
										<BiArrowToTop className="h-8 w-8 text-teal-500" />
									)}
								</div>
							</div>
							<span className="block text-sm capitalize">
								compared to last month
							</span>
						</div>
						<div className="w-full">
							<span className="block text-center text-xl font-bold capitalize">
								sales money analytics
							</span>
							<ResponsiveContainer width="100%" height={500}>
								<LineChart
									data={chartData}
									margin={{
										top: 10,
										right: 40,
										left: 20,
										bottom: 10,
									}}>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="name" />
									<YAxis tickFormatter={value => `$${value}`} />
									<Tooltip formatter={(value: number) => `$${value}`} />
									<Legend />
									<Line
										type="linear"
										dataKey="Previous Month"
										stroke="rgb(59 130 246)"
										activeDot={{ r: 8 }}
									/>
									<Line
										type="linear"
										dataKey="Current Month"
										stroke="rgb(20 184 166)"
										activeDot={{ r: 8 }}
									/>
								</LineChart>
							</ResponsiveContainer>
						</div>
					</>
				)}
			</main>
			<Footer />
		</div>
	);
};

DashboardAnalytics.auth = {
	usersOnly: true,
};

export default DashboardAnalytics;
