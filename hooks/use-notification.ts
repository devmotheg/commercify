/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import { useContext } from "react";

import type { NotificationProps } from "../types";
import { NotificationContext } from "../providers";

const useNotification = () => {
	const dispatch = useContext(NotificationContext);

	return {
		addNotification(
			type: NotificationProps["type"],
			message: NotificationProps["message"]
		) {
			dispatch({
				type: "ADD_NOTIFICATION",
				payload: {
					type,
					message,
				},
			});
		},
		removeNotification() {
			dispatch({
				type: "REMOVE_NOTIFICATION",
			});
		},
	};
};

export default useNotification;
