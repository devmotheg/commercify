/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import { Schema, SchemaTypes, models, model } from "mongoose";

import type { ModifiedQuery, ReviewDocument, ReviewModel } from "../types";
import { User, Product } from ".";

const schema = new Schema<ReviewDocument, ReviewModel>({
	customer: {
		type: SchemaTypes.ObjectId,
		ref: "user",
		immutable: true,
		required: [true, "Review must belong to a customer"],
		validate: {
			validator: async function (customer: ReviewDocument["customer"]) {
				return !!(await User.findById(customer));
			},
			message: "Invalid customer",
		},
	},
	product: {
		type: SchemaTypes.ObjectId,
		ref: "product",
		immutable: true,
		required: [true, "Review must belong to a product"],
		validate: {
			validator: async function (product: ReviewDocument["product"]) {
				return !!(await Product.findById(product));
			},
			message: "Invalid product",
		},
	},
	rating: {
		type: SchemaTypes.Number,
		default: 0,
		min: [0, "Minimum amount for rating is 0"],
		max: [5, "Maximum amount for rating is 5"],
	},
	comment: {
		type: SchemaTypes.String,
		trim: true,
		required: [true, "Comment is required"],
		minlength: [1, "Minimum length for comment is 1"],
		maxlength: [200, "Maximum length for comment is 200"],
	},
	createdAt: {
		type: SchemaTypes.Date,
		default: Date.now,
		immutable: true,
	},
});

schema.index({ product: 1 });

schema.post("save", async function (this: ReviewDocument) {
	await (this.constructor as ReviewModel).updateRatingStats(
		this.product as Schema.Types.ObjectId
	);
});

schema.pre(/delete|update/i, async function (this: ModifiedQuery, next) {
	this.reviews = await this.model.find(this._conditions);

	next();
});

schema.post(/delete|update/i, async function (this: ModifiedQuery) {
	for (const productId of [
		...new Set(this.reviews.map((r: ReviewDocument) => r.product)),
	])
		await (this.model as ReviewModel).updateRatingStats(
			productId as Schema.Types.ObjectId
		);
});

schema.static(
	"updateRatingStats",
	async function (this: ReviewModel, productId) {
		const stats = (
			await this.aggregate([
				{ $match: { product: productId } },
				{
					$group: {
						_id: "$product",
						average: { $avg: "$rating" },
						quantity: { $sum: 1 },
					},
				},
			])
		)[0];

		await Product.findByIdAndUpdate(productId, {
			rating: {
				average: stats ? stats.average : 0,
				quantity: stats ? stats.quantity : 0,
			},
		});
	}
);

const Review =
	(models.review as ReviewModel) ||
	model<ReviewDocument, ReviewModel>("review", schema);

Product.subscribeToDeletion(async productId => {
	await Review.deleteMany({ product: productId });
});

export default Review;
