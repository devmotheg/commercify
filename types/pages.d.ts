/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import type { NextPage } from "next";

import type { Auth } from ".";

type NextPageWithAuth = NextPage<any> & {
	auth?: Auth;
};

export { NextPageWithAuth };
