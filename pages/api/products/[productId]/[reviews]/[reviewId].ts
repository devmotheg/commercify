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
import AppError from "../../../../../lib/app-error";

const handler = async (
	req: NextApiRequestWithMiddleware,
	res: NextApiResponseWithMiddleware
) => {
	try {
		const user = await getCurrentUser(req);

		switch (req.method) {
			case "PATCH":
				const review = await Review.findOneAndUpdate(
					{ _id: req.query.reviewId, customer: user._id },
					{ ...req.body },
					{ new: true, runValidators: true }
				).populate("customer");

				if (!review) throw AppError.NotFound("review");

				return res.status(200).json({
					status: "success",
					data: { review },
				});
			case "DELETE":
				await Review.deleteOne({ _id: req.query.reviewId, customer: user._id });

				return res.status(204).end();
		}
	} catch (err) {
		globalErrorHandler(err, res);
	}
};

export default handler;
