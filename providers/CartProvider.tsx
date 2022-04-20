/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import { getSession } from "next-auth/react";
import { createContext, useState, useReducer, useEffect } from "react";
import { useQuery, useMutation } from "react-query";
import axios from "axios";

import type {
	WrapperProps,
	CartContextVal,
	CartProviderState,
	CartProviderAction,
	CartDocument,
} from "../types";
import { useNotification } from "../hooks";

const CartContext = createContext<CartContextVal>({
	state: [],
	dispatch: () => {},
});

const CartProvider = ({ children }: WrapperProps) => {
	const [lastModified, setLastModified] = useState<number | null>(null);
	const [hasLoaded, setHasLoaded] = useState(false);
	const { addNotification } = useNotification();
	const [state, dispatch] = useReducer(
		(
			state: CartProviderState,
			action: CartProviderAction
		): CartProviderState => {
			setLastModified(Date.now());

			switch (action.type) {
				case "ADD_ITEM":
					if (state.length >= 50) {
						addNotification(
							"error",
							"Cart limit exceeded, consider emptying some items"
						);

						return state;
					}

					return [
						...state,
						{ product: action.payload?.productId, quantity: 1 },
					];
				case "REMOVE_ITEM":
					return state.filter(i => i.product !== action.payload?.productId);
				case "INCREMENT_ITEM":
					return state.map(i => {
						if (i.product === action.payload?.productId)
							return { ...i, quantity: Math.min(i.quantity + 1, 100) };
						return i;
					});
				case "DECREMENT_ITEM":
					return state.map(i => {
						if (i.product === action.payload?.productId)
							return { ...i, quantity: Math.max(i.quantity - 1, 1) };
						return i;
					});
				case "CLEAR_ITEMS":
					return [];
				case "LOAD_ITEMS":
					return action.payload?.cart;
				default:
					return state;
			}
		},
		[]
	);

	const queryKey = ["userCart"];

	useQuery<unknown, unknown, CartDocument, typeof queryKey>(
		queryKey,
		async () => {
			const session = await getSession();

			let res;
			if (session) res = await axios(`/api/carts/?kind=currentUser`);

			const dbItems: CartDocument["items"] = res
				? res.data?.data.cart.items
				: [];
			const lsItems: CartDocument["items"] = JSON.parse(
				localStorage.getItem("cart") || "[]"
			);

			const dbMap = new Map<string, number>();
			const lsMap = new Map<string, number>();

			for (const [map, items] of [
				[dbMap, dbItems],
				[lsMap, lsItems],
			] as const)
				for (let i = 0; i < items.length; i++)
					map.set(items[i].product.toString(), i);

			for (const dbItem of dbItems) {
				if (lsMap.has(dbItem.product.toString())) {
					const lsItem = lsItems[lsMap.get(dbItem.product.toString())!];
					lsItem.quantity = dbItem.quantity;
				} else {
					if (lsItems.length < 50) lsItems.push(dbItem);
				}
			}

			return lsItems;
		},
		{
			onSuccess: items => {
				dispatch({
					type: "LOAD_ITEMS",
					payload: {
						cart: items,
					},
				});
				setHasLoaded(true);
			},
			enabled: !hasLoaded,
		}
	);

	const mutation = useMutation<void, unknown, { items: CartDocument["items"] }>(
		async variables =>
			await axios.patch(`/api/carts/?kind=currentUser`, variables.items)
	);

	useEffect(() => {
		if (hasLoaded) localStorage.setItem("cart", JSON.stringify(state));
	}, [state, hasLoaded]);

	useEffect(() => {
		if (lastModified) {
			const timeout = setTimeout(() => {
				mutation.mutate({ items: state });
				setLastModified(null);
			}, 1000 * 15);

			return () => clearTimeout(timeout);
		}
	}, [state, lastModified, mutation]);

	useEffect(() => {
		if (typeof window !== "undefined") {
			const listener = function () {
				mutation.mutate({ items: state });
			};

			window.addEventListener("beforeunload", listener);

			return () => window.removeEventListener("beforeunload", listener);
		}
	});

	return (
		<CartContext.Provider value={{ state, dispatch }}>
			{children}
		</CartContext.Provider>
	);
};

export { CartContext };
export default CartProvider;
