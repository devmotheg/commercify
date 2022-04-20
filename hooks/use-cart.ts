/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import { useContext } from "react";

import type { ProductDocument } from "../types";
import { CartContext } from "../providers";

const useCart = () => {
	const { state, dispatch } = useContext(CartContext);

	const facadeHelper = (type: string, productId: ProductDocument["_id"]) =>
		dispatch({
			type,
			payload: {
				productId,
			},
		});

	return {
		getCartState() {
			return state;
		},
		getCartItemIds() {
			return state.map(i => i.product);
		},
		getCartQuantity() {
			return state.reduce((acc, val) => acc + val.quantity, 0);
		},
		getCartItemQuantity(productId: ProductDocument["_id"]) {
			return state.find(i => i.product === productId)?.quantity;
		},
		isItemInCart(productId: ProductDocument["_id"]) {
			return state.find(i => i.product === productId);
		},
		addItem(productId: ProductDocument["_id"]) {
			facadeHelper("ADD_ITEM", productId);
		},
		removeItem(productId: ProductDocument["_id"]) {
			facadeHelper("REMOVE_ITEM", productId);
		},
		incrementItem(productId: ProductDocument["_id"]) {
			facadeHelper("INCREMENT_ITEM", productId);
		},
		decrementItem(productId: ProductDocument["_id"]) {
			facadeHelper("DECREMENT_ITEM", productId);
		},
		clearItems() {
			dispatch({
				type: "CLEAR_ITEMS",
			});
		},
		replaceItems(newState: typeof state) {
			dispatch({
				type: "LOAD_ITEMS",
				payload: {
					cart: newState,
				},
			});
		},
	};
};

export default useCart;
