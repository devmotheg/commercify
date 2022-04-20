/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import type {
	NextApiRequestWithMiddleware,
	NextApiResponseWithMiddleware,
} from "../../../../types";
import { Purchase } from "../../../../models";
import globalErrorHandler from "../../../../lib/global-error-handler";
import getCurrentUser from "../../../../lib/get-current-user";

const handler = async (
	req: NextApiRequestWithMiddleware,
	res: NextApiResponseWithMiddleware
) => {
	try {
		const user = await getCurrentUser(req);

		switch (req.method) {
			case "GET": {
				if (req.query.kind === "boolean") {
					const didPurchase = !!(await Purchase.count({
						customer: user._id,
						$expr: {
							$eq: [{ $toString: "$product._id" }, req.query.productId],
						},
					}));

					res.status(200).json({ status: "success", data: { didPurchase } });
				}
			}
		}
	} catch (err) {
		globalErrorHandler(err, res);
	}
};

export default handler;
