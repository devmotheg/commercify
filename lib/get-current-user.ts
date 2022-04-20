/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import type { IncomingMessage } from "http";
import type { NextApiRequestCookies } from "next/dist/server/api-utils";
import { getToken } from "next-auth/jwt";

import { User } from "../models";
import AppError from "./app-error";

const getCurrentUser = async (
	req: IncomingMessage & { cookies: NextApiRequestCookies }
) => {
	const token = await getToken({ req });
	const user = await User.findOne({ _s: token?.id });

	if (!user) throw AppError.NotFound("user");

	return user;
};

export default getCurrentUser;
