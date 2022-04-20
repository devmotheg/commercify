/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import Router from "next/router";
import { useSession, signOut } from "next-auth/react";

import type { AuthFirewallProps } from "../../types";
import { Loading } from ".";

const AuthFirewall = ({ auth, children }: AuthFirewallProps) => {
	const { data: session } = useSession({
		required: true,
		onUnauthenticated: () => {
			if (auth.usersOnly) Router.push("/auth/signin");
		},
	});

	if (session?.error) signOut();
	if (session?.user && auth.guestsOnly) Router.push("/");
	else if (session?.user || auth.guestsOnly) return <>{children}</>;

	return <Loading />;
};

export default AuthFirewall;
