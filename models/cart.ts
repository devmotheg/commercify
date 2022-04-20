/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import { Schema, SchemaTypes, models, model } from "mongoose";

import type { CartDocument, CartModel } from "../types";
import { User, Product } from ".";

const schema = new Schema<CartDocument, CartModel>({
	customer: {
		type: SchemaTypes.ObjectId,
		ref: "user",
		immutable: true,
		required: [true, "Cart must belong to a customer"],
		validate: {
			validator: async function (customer: CartDocument["customer"]) {
				return !!(await User.findById(customer));
			},
			message: "Invalid customer",
		},
	},
	items: {
		type: [
			{
				product: {
					type: SchemaTypes.ObjectId,
					ref: "product",
					validate: {
						validator: async function (
							this: CartDocument,
							product: CartDocument["items"][number]["product"]
						) {
							return !!(await Product.findById(product));
						},
						message: "Invalid item",
					},
				},
				quantity: {
					type: SchemaTypes.Number,
					required: [true, "Item quantity is required"],
					min: [1, "Minimum amount for cart item is 1"],
					max: [100, "Maximum amount for cart item is 100"],
				},
			},
		],
		validate: {
			validator: function (items: CartDocument["items"]) {
				return items.length >= 0 && items.length <= 50;
			},
			message: "Items quantity must be in the range 0 to 50",
		},
	},
});

schema.index({ custoemr: 1 }).index({ items: 1 });

schema.method(
	"syncCart",
	async function (this: CartDocument, items: CartDocument["items"]) {
		this.items = items;
		this.save();
	}
);

const Cart =
	(models.cart as CartModel) || model<CartDocument, CartModel>("cart", schema);

Product.subscribeToDeletion(async productId => {
	const carts = await Cart.find({ items: productId });

	for (const cart of carts) {
		cart.items.filter(i => i.toString() !== productId.toString());
		await cart.save();
	}
});

export default Cart;
