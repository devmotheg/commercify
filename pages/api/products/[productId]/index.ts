/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import { v2 as cloudinary } from "cloudinary";

import type {
	NextApiRequestWithMiddleware,
	NextApiResponseWithMiddleware,
} from "../../../../types";
import { Product } from "../../../../models";
import globalErrorHandler from "../../../../lib/global-error-handler";
import getCurrentUser from "../../../../lib/get-current-user";
import AppError from "../../../../lib/app-error";

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
			case "GET": {
				const product = await Product.findById(req.query.productId);

				if (!product) throw AppError.NotFound("product");

				return res.status(200).json({
					status: "success",
					data: { product },
				});
			}
			case "PATCH":
				const user = await getCurrentUser(req);

				const body = req.body;
				for (const key of Object.keys(body)) if (!body[key]) delete body[key];

				const imagePublicIds = [];
				for (const image of body.images) {
					if (image.startsWith("dev_setups")) imagePublicIds.push(image);
					else {
						const cloudinaryResponse = await cloudinary.uploader.upload(image, {
							upload_preset: "dev_setups",
						});
						imagePublicIds.push(cloudinaryResponse.public_id);
					}
				}

				const product = await Product.findOneAndUpdate(
					{ _id: req.query.productId, seller: user._id },
					{ ...body, images: imagePublicIds },
					{ runValidators: true }
				);

				if (!product) throw AppError.NotFound("product");

				return res.status(200).end();
			case "DELETE": {
				const user = await getCurrentUser(req);

				await Product.deleteOne({ _id: req.query.productId, seller: user._id });

				return res.status(204).end();
			}
		}
	} catch (err) {
		globalErrorHandler(err, res);
	}
};

export { config };
export default handler;
