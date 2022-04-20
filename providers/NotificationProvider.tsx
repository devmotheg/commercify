/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import { createContext, useReducer } from "react";

import type {
	WrapperProps,
	NotificationContextVal,
	NotificationProviderState,
	NotificationProviderAction,
} from "../types";
import { Notification } from "../components";

const NotificationContext = createContext<NotificationContextVal>(() => {});

const NotificationProvider = ({ children }: WrapperProps) => {
	const [state, dispatch] = useReducer(
		(
			state: NotificationProviderState,
			action: NotificationProviderAction
		): NotificationProviderState => {
			switch (action.type) {
				case "ADD_NOTIFICATION":
					return {
						open: true,
						type: action.payload?.type,
						message: action.payload?.message,
					};
				case "REMOVE_NOTIFICATION":
					return {
						...state,
						open: false,
					};
				default:
					return state;
			}
		},
		{
			open: false,
			type: "success",
			message: "",
		}
	);

	return (
		<NotificationContext.Provider value={dispatch}>
			<Notification {...state} />
			{children}
		</NotificationContext.Provider>
	);
};

export { NotificationContext };
export default NotificationProvider;
