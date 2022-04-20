/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import type { NextApiResponse } from "next";

import AppError from "./app-error";

const handleCastErrorDB = (err: any) => {
	const message = `Only accepeted data type for ${err.path} is ${err.kind}`;

	return new AppError(message, 400);
};

const handleValidationErrorDB = (err: any) => {
	const errorsSet = new Set(
		Object.keys(err.errors).map(e => {
			const error = err.errors[e];

			if (error.name === "ValidatorError") return error.message;
			if (error.name === "CastError")
				return `Data type for ${error.path} can only be ${error.kind}`;
		})
	);

	const message = [...errorsSet].filter(m => m).join(". ");

	return new AppError(message, 400);
};

const handle11000ErrorDB = (err: any) => {
	const duplicateKey = Object.keys(err.keyValue)[0];
	const message = `There's already an existing ${duplicateKey} with the given value`;

	return new AppError(message, 400);
};

const globalErrorHandler = (err: any, res?: NextApiResponse) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || "error";

	if (process.env.NODE_ENV === "development" && res)
		return res.status(err.statusCode).json({
			status: err.status,
			message: err.message,
			error: err,
			stack: err.stack,
		});

	let errCopy = JSON.parse(JSON.stringify(err));
	if (err.name === "CastError") errCopy = handleCastErrorDB(err);
	if (err.name === "ValidationError") errCopy = handleValidationErrorDB(err);
	if (err.code === 11000) errCopy = handle11000ErrorDB(err);

	if (res && errCopy.fromApp)
		return res.status(errCopy.statusCode).json({
			status: errCopy.status,
			message: errCopy.message,
		});
	else {
		console.error(`Error: ${err}\nError copy: ${errCopy}`);

		if (res)
			return res.status(500).json({
				status: 500,
				message: "Something went wrong from our end",
			});
	}

	throw err;
};

export default globalErrorHandler;
