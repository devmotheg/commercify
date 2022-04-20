/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import type { NextApiHandler } from "next";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import globalErrorHandler from "../../../lib/global-error-handler";
import { User, Cart } from "../../../models";

const handler: NextApiHandler = (req, res) =>
	NextAuth(req, res, {
		providers: [
			GoogleProvider({
				clientId: process.env.GOOGLE_ID || "",
				clientSecret: process.env.GOOGLE_SECRET || "",
			}),
		],
		pages: {
			signIn: "/auth/signin",
			signOut: "/",
			error: "/auth/signin",
			verifyRequest: "/",
			newUser: "/",
		},
		callbacks: {
			signIn: async ({ user, account }) => {
				try {
					if (!(await User.findOne({ _s: account.providerAccountId }))) {
						const userDoc = await User.create({
							...user,
							_s: account.providerAccountId,
						});
						await Cart.create({ customer: userDoc._id });
					}

					return true;
				} catch (err) {
					globalErrorHandler(err);

					return false;
				}
			},
			async jwt({ token, account }) {
				if (account) token.id = account.providerAccountId;

				return token;
			},
			async session({ session, token }) {
				session.id = token.id;

				if (!(await User.findOne({ _s: token.id })))
					return { ...session, error: true };

				return session;
			},
		},
	});

export default handler;
