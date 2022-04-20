/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import { v2 as cloudinary } from "cloudinary";
import Stripe from "stripe";

import type {
	NextApiRequestWithMiddleware,
	NextApiResponseWithMiddleware,
} from "../../../types";
import { Product } from "../../../models";
import globalErrorHandler from "../../../lib/global-error-handler";
import getCurrentUser from "../../../lib/get-current-user";
import AppError from "../../../lib/app-error";

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_NAME,
	api_key: process.env.CLOUDINARY_KEY,
	api_secret: process.env.CLOUDINARY_SECRET,
	secure: true,
});

const stripe = new Stripe(process.env.STRIPE_TEST_SECRET_KEY!, {
	apiVersion: "2020-08-27",
});

const handler = async (
	req: NextApiRequestWithMiddleware,
	res: NextApiResponseWithMiddleware
) => {
	try {
		const user = await getCurrentUser(req);

		switch (req.method) {
			case "POST": {
				if (!Array.isArray(req.body))
					throw new AppError(
						"Invalid cart format (must be of type array)",
						400
					);

				const items = await Promise.all(
					req.body.map(async i => {
						const product = await Product.findById(i.product);

						if (!product) throw AppError.NotFound("product");

						return {
							price_data: {
								currency: "usd",
								product_data: {
									name: product.title,
									images: product.images.map(i => cloudinary.url(i)),
								},
								unit_amount: product.price * 100,
							},
							quantity: i.quantity,
						};
					})
				);

				const session = await stripe.checkout.sessions.create({
					payment_method_types: ["card"],
					mode: "payment",
					client_reference_id: user._id.toString(),
					success_url: `${process.env.APP_DOMAIN!}/?checkout-completed=true`,
					cancel_url: `${process.env.APP_DOMAIN!}/cart`,
					line_items: items,
				});

				res.status(200).json({ status: "success", data: { url: session.url } });
			}
		}
	} catch (err) {
		globalErrorHandler(err, res);
	}
};

export default handler;
