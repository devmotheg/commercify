/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import type {
	NextApiRequestWithMiddleware,
	NextApiResponseWithMiddleware,
} from "../../types";
import { Cart } from "../../models";
import globalErrorHandler from "../../lib/global-error-handler";
import getCurrentUser from "../../lib/get-current-user";
import AppError from "../../lib/app-error";

const handler = async (
	req: NextApiRequestWithMiddleware,
	res: NextApiResponseWithMiddleware
) => {
	try {
		const user = await getCurrentUser(req);

		switch (req.method) {
			case "GET":
				if (req.query.kind === "currentUser") {
					const cart = await Cart.findOne({ customer: user._id });

					if (!cart) throw AppError.NotFound("cart");

					return res.status(200).json({
						status: "success",
						data: { cart },
					});
				}
			case "PATCH":
				if (req.query.kind === "currentUser") {
					const cart = await Cart.findOne({ customer: user._id });

					if (!cart) throw AppError.NotFound("cart");

					await cart.syncCart(req.body);

					return res.status(200).end();
				}
		}
	} catch (err) {
		globalErrorHandler(err, res);
	}
};

export default handler;
