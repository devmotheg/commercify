/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@mui/material";

import type { NextPageWithAuth } from "../../types";
import { Footer } from "../../components";
import { useNotification } from "../../hooks";

const SignIn: NextPageWithAuth = () => {
	const { addNotification } = useNotification();
	const router = useRouter();

	const handleClick = () => {
		if (router.query.error) {
			addNotification("error", "Your internet connection is slow");
			if (typeof window !== "undefined")
				window.history.replaceState(null, "", "/auth/signin");
		}

		signIn("google", { redirect: false });
	};

	return (
		<div className="grid min-h-screen grid-flow-row grid-rows-[1fr_auto]">
			<main className="flex h-full items-center justify-center gap-4">
				<div>
					<Link href="/">
						<a className="mb-4 block text-center">
							<Button className="rounded-full">
								<span className="sr-only">home</span>
								<Image src="/logo.png" alt="logo" width="60" height="60" />
							</Button>
						</a>
					</Link>
					<Button
						className="mx-auto flex w-fit items-center gap-2 shadow"
						onClick={handleClick}>
						<FcGoogle className="h-8 w-8" />
						<span className="text-lg normal-case text-slate-600">
							Sign in with Google
						</span>
					</Button>
				</div>
			</main>
			<Footer />
		</div>
	);
};

SignIn.auth = {
	guestsOnly: true,
};

export default SignIn;
