/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import { Schema, SchemaTypes, models, model } from "mongoose";

import type { AnalyticDocument, AnalyticModel } from "../types";
import { User } from ".";
import { schema as ProductSchema } from "./product";

const schema = new Schema<AnalyticDocument, AnalyticModel>({
	seller: {
		type: SchemaTypes.ObjectId,
		ref: "user",
		immutable: true,
		required: [true, "Product must belong to a seller"],
		validate: {
			validator: async function (seller: AnalyticDocument["seller"]) {
				return !!(await User.findById(seller));
			},
			message: "Invalid seller",
		},
	},
	product: {
		type: ProductSchema,
	},
	hours: {
		type: [
			{
				_id: false,
				purchased: {
					type: SchemaTypes.Number,
					required: [true, "Analytic hourly purchases is required"],
					min: [0, "Minimum amount for hourly purchases is 0"],
				},
			},
		],
		default: new Array(24).map(() => {
			return {
				purchased: 0,
			};
		}),
		validate: {
			validator: function (hours: AnalyticDocument["hours"]) {
				return hours.length === 24;
			},
			message: "Invalid analytc hourly format",
		},
	},
	createdAt: {
		type: SchemaTypes.Date,
		default: Date.now,
		immutable: true,
	},
});

const Analytic =
	(models.analytic as AnalyticModel) ||
	model<AnalyticDocument, AnalyticModel>("analytic", schema);

export default Analytic;
