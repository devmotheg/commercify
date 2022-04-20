/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import EventEmitter from "events";
import { Schema, SchemaTypes, models, model } from "mongoose";

import type { ModifiedQuery, ProductDocument, ProductModel } from "../types";
import { User } from ".";
import {
	productConditions,
	productCategories,
	productVariantsKind,
} from "../data";

const productEmitter = new EventEmitter();
productEmitter.setMaxListeners(2);

const schema = new Schema<ProductDocument, ProductModel>({
	seller: {
		type: SchemaTypes.ObjectId,
		ref: "user",
		immutable: true,
		required: [true, "Product must belong to a seller"],
		validate: {
			validator: async function (seller: ProductDocument["seller"]) {
				return !!(await User.findById(seller));
			},
			message: "Invalid seller",
		},
	},
	title: {
		type: SchemaTypes.String,
		trim: true,
		required: [true, "Username is required"],
		minlength: [2, "Minimum length for title is 2"],
		maxlength: [80, "Maximum length for title is 80"],
	},
	stock: {
		type: SchemaTypes.Number,
		required: [true, "Stock is required"],
		min: [0, "Minimum amount for stock is 0"],
		max: [100, "Maximum amount for stock is 100"],
	},
	price: {
		type: SchemaTypes.Number,
		required: [true, "Price is required"],
		min: [0, "Minimum amount for price is 0"],
		max: [100000, "Maxium amount for price is 100k"],
	},
	condition: {
		type: SchemaTypes.String,
		required: [true, "condition is required"],
		enum: {
			values: productConditions,
			message: "Invalid condition",
		},
	},
	images: {
		type: [SchemaTypes.String],
		required: [true, "Condition is required"],
		validate: {
			validator: function (images: string[]) {
				return images.length >= 1 && images.length <= 5;
			},
			message: "Images quantity must be in the range 1 to 5",
		},
	},
	category: {
		type: SchemaTypes.String,
		required: [true, "Category is required"],
		enum: {
			values: productCategories,
			message: "Invalid category",
		},
	},
	rating: {
		type: {
			average: {
				type: SchemaTypes.Number,
				min: [0, "Minimum rating average is 0"],
				max: [5, "Maximum rating average is 5"],
			},
			quantity: {
				type: SchemaTypes.Number,
				min: [0, "Minimum rating quantity is 0"],
			},
		},
		default: {
			average: 0,
			quantity: 0,
		},
	},
	variants: {
		type: {
			kind: {
				type: SchemaTypes.String,
				required: [true, "Variant kind is required"],
				enum: {
					values: productVariantsKind,
					message: "Invalid variant's kind",
				},
			},
			ids: {
				type: [
					{
						type: SchemaTypes.ObjectId,
						ref: "product",
						validate: {
							validator: async function (
								this: ProductDocument,
								id: Schema.Types.ObjectId
							) {
								return !!(await (this.constructor as ProductModel).findById(
									id
								));
							},
							message: "Invalid product ID",
						},
					},
				],
				validate: {
					validator: function (ids: Schema.Types.ObjectId[]) {
						return ids.length >= 1 && ids.length <= 5;
					},
					message: "Product IDs quantity must be in the range 1 to 5",
				},
			},
		},
	},
	description: {
		type: SchemaTypes.String,
		trim: true,
		minlength: [2, "Minimum length for description is 2"],
		maxlength: [256, "Maximum length for description is 256"],
	},
	bulletPoints: {
		type: [
			{
				type: SchemaTypes.String,
				trim: true,
				minlength: [2, "Minimum length for a bullet point is 2"],
				maxlength: [130, "Maximum length for a bullet point is 130"],
			},
		],
		validate: {
			validator: function (bulletPoints: string[]) {
				return bulletPoints.length <= 5;
			},
			message: "Bullet points quantity must be in the range 1 to 5",
		},
	},
	createdAt: {
		type: SchemaTypes.Date,
		default: Date.now,
		immutable: true,
	},
});

schema.index({ price: 1, condition: 1, title: 1, category: 1, rating: 1 });

schema.pre(/delete/i, async function (this: ModifiedQuery, next) {
	const products = await this.model.find(this._conditions);
	for (const product of products) productEmitter.emit("delete", product._id);

	next();
});

schema.static("subscribeToDeletion", function (fun) {
	productEmitter.once("delete", fun);
});

const Product =
	(models.product as ProductModel) ||
	model<ProductDocument, ProductModel>("product", schema);

export { schema };
export default Product;
