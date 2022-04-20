/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import { Schema, SchemaTypes, models, model } from "mongoose";

import type { PurchaseDocument, PurchaseModel } from "../types";
import { User } from ".";
import { schema as ProductSchema } from "./product";

const schema = new Schema<PurchaseDocument, PurchaseModel>({
	customer: {
		type: SchemaTypes.ObjectId,
		ref: "user",
		immutable: true,
		required: [true, "Purchase must belong to a customer"],
		validate: {
			validator: async function (customer: PurchaseDocument["customer"]) {
				return !!(await User.findById(customer));
			},
			message: "Invalid customer",
		},
	},
	product: {
		type: ProductSchema,
	},
	quantity: {
		type: SchemaTypes.Number,
		required: [true, "Quantity is required"],
		min: [1, "Minimum amount for cart item is 1"],
		max: [100, "Maximum amount for cart item is 100"],
	},
	createdAt: {
		type: SchemaTypes.Date,
		default: Date.now,
		immutable: true,
	},
});

schema.index({ customer: 1, product: 1 });

const Purchase =
	(models.purchase as PurchaseModel) ||
	model<PurchaseDocument, PurchaseModel>("purchase", schema);

export default Purchase;
