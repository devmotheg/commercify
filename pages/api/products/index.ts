/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import { v2 as cloudinary } from "cloudinary";

import type {
	NextApiRequestWithMiddleware,
	NextApiResponseWithMiddleware,
} from "../../../types";
import { Product } from "../../../models";
import globalErrorHandler from "../../../lib/global-error-handler";
import getCurrentUser from "../../../lib/get-current-user";
import ApiFeatures from "../../../lib/api-features";
import AppError from "../../../lib/app-error";

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_NAME,
	api_key: process.env.CLOUDINARY_KEY,
	api_secret: process.env.CLOUDINARY_SECRET,
	secure: true,
});

const config = {
	api: {
		bodyParser: {
			sizeLimit: "10mb",
		},
	},
};

const handler = async (
	req: NextApiRequestWithMiddleware,
	res: NextApiResponseWithMiddleware
) => {
	try {
		switch (req.method) {
			case "GET":
				if (req.query.action === "count") {
					let filter = {};
					if (req.query.kind === "userProducts") {
						const user = await getCurrentUser(req);
						filter = { seller: user._id };
					}

					delete req.query.action;
					delete req.query.kind;

					const count = await new ApiFeatures(
						Product.count(filter) as any,
						req.query,
						"count"
					)
						.filter()
						.execute();

					return res.status(200).json({
						status: "success",
						data: {
							count,
						},
					});
				} else {
					let filter = {};
					if (req.query.kind === "userProducts") {
						const user = await getCurrentUser(req);
						filter = { seller: user._id };
					}

					delete req.query.action;
					delete req.query.kind;

					const products = await new ApiFeatures(
						Product.find(filter),
						req.query,
						"find"
					)
						.filter()
						.sort()
						.paginate()
						.execute();

					return res.status(200).json({
						status: "success",
						data: {
							products,
						},
					});
				}
			case "POST":
				if (req.query.kind === "populateIds") {
					const products = [];

					if (!Array.isArray(req.body))
						throw new AppError(
							"Invalid ids format (must be of type array)",
							400
						);

					for (const id of req.body) {
						const product = await Product.findById(id);

						if (!product || !product.stock) continue;

						products.push(product);
					}

					return res
						.status(200)
						.json({ status: "success", data: { products } });
				} else {
					const user = await getCurrentUser(req);

					const body = req.body;
					for (const key of Object.keys(body)) if (!body[key]) delete body[key];

					const imagePublicIds = [];
					for (const image of body.images) {
						const cloudinaryResponse = await cloudinary.uploader.upload(image, {
							upload_preset: "dev_setups",
						});
						imagePublicIds.push(cloudinaryResponse.public_id);
					}

					await Product.create({
						...body,
						seller: user._id,
						images: imagePublicIds,
					});
					return res.status(201).end();
				}
		}
	} catch (err) {
		globalErrorHandler(err, res);
	}
};

export { config };
export default handler;
