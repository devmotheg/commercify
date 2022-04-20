/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import Stripe from "stripe";
import moment from "moment";

import type {
	NextApiRequestWithMiddleware,
	NextApiResponseWithMiddleware,
} from "../../../types";
import { Product, Purchase, Analytic, Cart } from "../../../models";
import globalErrorHandler from "../../../lib/global-error-handler";

const config = {
	api: {
		bodyParser: false,
	},
};

const stripe = new Stripe(process.env.STRIPE_TEST_SECRET_KEY!, {
	apiVersion: "2020-08-27",
});

async function buffer(readable: NextApiRequestWithMiddleware) {
	const chunks = [];
	for await (const chunk of readable) {
		chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
	}

	return Buffer.concat(chunks);
}

const handler = async (
	req: NextApiRequestWithMiddleware,
	res: NextApiResponseWithMiddleware
) => {
	try {
		switch (req.method) {
			case "POST": {
				const buf = await buffer(req);
				const sig = req.headers["stripe-signature"];

				let event;

				try {
					event = stripe.webhooks.constructEvent(
						buf.toString(),
						sig!,
						process.env.WEBHOOK_SIGNING_SECRET!
					);
				} catch (err: any) {
					return console.error(`Webhook Error: ${err.message}`);
				}

				switch (event.type) {
					case "checkout.session.completed":
						const session: { [index: string]: any } = event.data.object;
						const client = session.client_reference_id;

						const cart = await Cart.findOne({
							customer: client,
						});

						for (const item of cart!.items) {
							const product = await Product.findById(item.product);

							await Purchase.create({
								customer: client,
								product,
								quantity: item.quantity,
							});

							let analytic;
							if (
								!(analytic = await Analytic.findOne({
									seller: client,
									product,
									$expr: {
										$and: [
											{ $eq: [{ $year: "$createdAt" }, moment().year()] },
											{
												$eq: [
													{ $dayOfYear: "$createdAt" },
													moment().dayOfYear(),
												],
											},
										],
									},
								}))
							) {
								analytic = await Analytic.create({
									seller: client,
									product,
									hours: new Array(24).fill({ purchased: 0 }).map((v, i) => {
										if (i === moment().hour())
											return { purchased: item.quantity };
										return v;
									}),
								});
							} else {
								analytic.hours[moment().hour()].purchased += item.quantity;
								await analytic.save();
							}
						}
					default:
						res.status(200).end();
				}
			}
		}
	} catch (err) {
		console.log(err);
		globalErrorHandler(err, res);
	}
};

export { config };
export default handler;
