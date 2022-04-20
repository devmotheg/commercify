/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import type { NextApiResponse, NextApiRequest } from "next";

type NextApiRequestWithMiddleware = NextApiRequest & {
	[index: string]: any;
};

type NextApiResponseWithMiddleware = NextApiResponse & {
	[index: string]: any;
};

type NextApiHandlerWithMiddleware<T = any> = (
	req: NextApiRequestWithMiddleware,
	res: NextApiResponseWithMiddleware<T>,
	next: (result?: any) => void
) => void | Promise<void>;

type ClientDataApiResponse = {
	status: "success";
	message?: string;
	length?: number;
	data?: {
		[index: string]: any;
	};
};

type ClientErrorApiResponse = {
	status: "fail" | "error";
	message?: string;
	error?: {
		[index: string]: any;
	};
	stack?: string;
};

export {
	NextApiRequestWithMiddleware,
	NextApiResponseWithMiddleware,
	NextApiHandlerWithMiddleware,
	ClientDataApiResponse,
	ClientErrorApiResponse,
};
