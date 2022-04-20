/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import type { Dispatch } from "react";

import type { CartProviderState } from ".";

type ProviderAction = {
	type: string;
	payload?: {
		[index: string]: any;
	};
};

type NotificationProviderAction = ProviderAction;

type NotificationContextVal = Dispatch<NotificationProviderAction>;

type CartProviderAction = ProviderAction;

type CartContextVal = {
	state: CartProviderState;
	dispatch: Dispatch<CartProviderAction>;
};

export {
	NotificationContextVal,
	NotificationProviderAction,
	CartContextVal,
	CartProviderAction,
};
