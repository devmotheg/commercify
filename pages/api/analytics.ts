/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import moment from "moment";

import type {
	NextApiRequestWithMiddleware,
	NextApiResponseWithMiddleware,
} from "../../types";
import { Analytic } from "../../models";
import globalErrorHandler from "../../lib/global-error-handler";
import getCurrentUser from "../../lib/get-current-user";

const handler = async (
	req: NextApiRequestWithMiddleware,
	res: NextApiResponseWithMiddleware
) => {
	try {
		const user = await getCurrentUser(req);

		switch (req.method) {
			case "GET":
				const previousMonth = moment().startOf("month").toDate();

				const currentMonth = moment().add(1, "month").endOf("month").toDate();

				const analytics = await Analytic.aggregate([
					{
						$match: {
							seller: user._id,
							$expr: {
								$and: [
									{ $gte: ["$createdAt", previousMonth] },
									{ $lte: ["$createdAt", currentMonth] },
								],
							},
						},
					},
					{
						$unwind: {
							path: "$hours",
							includeArrayIndex: "arrayIndex",
						},
					},
					{
						$group: {
							_id: {
								month: { $month: "$createdAt" },
								day: { $dayOfMonth: "$createdAt" },
							},
							products: { $addToSet: "$product" },
							salesQuantity: { $sum: "$hours.purchased" },
						},
					},
					{
						$addFields: {
							salesMoney: {
								$reduce: {
									input: "$products",
									initialValue: 0,
									in: { $sum: ["$$value", "$$this.price"] },
								},
							},
						},
					},
					{
						$project: { products: 0 },
					},
				]);

				const map = new Map();

				for (let i = 0; i < analytics.length; i++)
					map.set(JSON.stringify(analytics[i]._id), i);

				const previousMonthAnalytics: object[] = [];
				const currentMonthAnalytics: object[] = [];

				for (const [month, monthAnalytics] of [
					[previousMonth.getMonth(), previousMonthAnalytics],
					[currentMonth.getMonth(), currentMonthAnalytics],
				] as const)
					for (let i = 1; i <= moment(month).daysInMonth(); i++) {
						const _id = { month, day: i };

						monthAnalytics.push(
							analytics[map.get(JSON.stringify(_id))] || {
								_id,
								salesMoney: 0,
								salesQuantity: 0,
							}
						);
					}

				res.status(200).json({
					status: "success",
					data: {
						previousMonthAnalytics,
						currentMonthAnalytics,
					},
				});
		}
	} catch (err) {
		globalErrorHandler(err, res);
	}
};

export default handler;
