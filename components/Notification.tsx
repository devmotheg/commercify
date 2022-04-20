/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import type { SyntheticEvent } from "react";
import { Alert, Snackbar } from "@mui/material";

import type { NotificationProps } from "../types";
import { useNotification } from "../hooks";

const Notification = ({ open, type, message }: NotificationProps) => {
	const { removeNotification } = useNotification();
	const handleClose = (event?: SyntheticEvent | Event, reason?: string) => {
		if (reason === "clickaway") return;

		removeNotification();
	};

	return (
		<Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
			<Alert
				elevation={6}
				variant="filled"
				onClose={handleClose}
				severity={type}
				sx={{
					width: "100%",
					backgroundColor:
						type === "success" ? "rgb(20 184 166)" : "rgb(239 68 68)",
				}}>
				{message}
			</Alert>
		</Snackbar>
	);
};

export default Notification;
