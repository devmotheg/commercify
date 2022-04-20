/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import type {
	NextApiRequestWithMiddleware,
	NextApiResponseWithMiddleware,
} from "../../../../../types";
import { Review } from "../../../../../models";
import globalErrorHandler from "../../../../../lib/global-error-handler";
import getCurrentUser from "../../../../../lib/get-current-user";
import ApiFeatures from "../../../../../lib/api-features";

const handler = async (
	req: NextApiRequestWithMiddleware,
	res: NextApiResponseWithMiddleware
) => {
	try {
		switch (req.method) {
			case "GET":
				const reviews = await new ApiFeatures(
					Review.find({
						product: req.query.productId,
					}).populate("customer"),
					req.query,
					"find"
				)
					.sort()
					.paginate()
					.execute();

				return res.status(200).json({
					status: "success",
					data: { reviews },
				});
			case "POST": {
				const user = await getCurrentUser(req);

				let review = await Review.create({
					customer: user._id,
					product: req.query.productId,
					...req.body,
				});

				review = (await Review.findById(review._id).populate(
					"customer"
				)) as any;

				return res.status(201).json({
					status: "success",
					data: { review },
				});
			}
		}
	} catch (err) {
		globalErrorHandler(err, res);
	}
};

export default handler;
