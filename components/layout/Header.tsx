/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import type { MouseEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { FaShoppingCart, FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { AiFillTags } from "react-icons/ai";
import { MdAnalytics } from "react-icons/md";
import {
	Avatar,
	Menu,
	MenuItem,
	ListItemIcon,
	ListItemText,
	Tooltip,
	Button,
} from "@mui/material";

import { useCart } from "../../hooks";

const Header = () => {
	const { data: session } = useSession();
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const { getCartQuantity } = useCart();

	const handleClick = (event: MouseEvent<HTMLButtonElement>) =>
		setAnchorEl(event.currentTarget);

	const handleClose = () => setAnchorEl(null);

	return (
		<header className="container mx-auto my-2 grid w-5/6 p-2">
			<nav className="flex items-center justify-between gap-8">
				<Link href="/">
					<a className="block text-center">
						<Button className="rounded-full">
							<span className="sr-only">home</span>
							<Image src="/logo.png" alt="logo" width="60" height="60" />
						</Button>
					</a>
				</Link>
				<div className="flex items-center gap-2">
					<Link href="/cart">
						<a>
							<Button className="flex items-end">
								<div className="relative">
									<FaShoppingCart className="mr-1 h-8 w-8 text-teal-500" />
									<span className="absolute -top-1 -right-4 translate-x-1/2 font-bold text-slate-600">
										{getCartQuantity()}
									</span>
								</div>
								<span className="text-sm font-bold capitalize">cart</span>
							</Button>
						</a>
					</Link>
					{session?.user ? (
						<>
							<Tooltip title="Account menu">
								<Button className="flex items-end" onClick={handleClick}>
									<Avatar
										alt={session!.user!.name!}
										src={session!.user!.image!}
										sx={{ width: 38, height: 38 }}
										imgProps={{
											referrerPolicy: "no-referrer",
										}}
									/>
								</Button>
							</Tooltip>
							<Menu
								anchorEl={anchorEl}
								open={Boolean(anchorEl)}
								onClose={handleClose}>
								<Link href="/dashboard/products">
									<a>
										<MenuItem onClick={handleClose}>
											<ListItemIcon>
												<AiFillTags className="h-5 w-5 text-slate-600" />
											</ListItemIcon>
											<ListItemText>
												<span className="font-bold capitalize text-slate-600">
													products
												</span>
											</ListItemText>
										</MenuItem>
									</a>
								</Link>
								<Link href="/dashboard/analytics">
									<a>
										<MenuItem onClick={handleClose}>
											<ListItemIcon>
												<MdAnalytics className="h-5 w-5 text-slate-600" />
											</ListItemIcon>
											<ListItemText>
												<span className="font-bold capitalize text-slate-600">
													analytics
												</span>
											</ListItemText>
										</MenuItem>
									</a>
								</Link>
								<MenuItem
									onClick={() => {
										handleClose();
										signOut();
									}}>
									<ListItemIcon>
										<FaSignOutAlt className="h-5 w-5 text-slate-600" />
									</ListItemIcon>
									<ListItemText>
										<span className="font-bold capitalize text-slate-600">
											sign out
										</span>
									</ListItemText>
								</MenuItem>
							</Menu>
						</>
					) : (
						<Link href="/auth/signin">
							<a>
								<Button className="flex items-end">
									<FaSignInAlt className="mr-1 h-8 w-8" />
									<span className="text-sm font-bold capitalize">sign in</span>
								</Button>
							</a>
						</Link>
					)}
				</div>
			</nav>
		</header>
	);
};

export default Header;
