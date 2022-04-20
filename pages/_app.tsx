/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import "../styles/globals.css";

import Head from "next/head";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "react-query";
import {
	StyledEngineProvider,
	CssBaseline,
	NoSsr,
	ThemeProvider,
	createTheme,
} from "@mui/material";

import type { AppPropsWithAuth } from "../types";
import { NotificationProvider, CartProvider } from "../providers";
import { ErrorBoundary, Progress, AuthFirewall } from "../components";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
		},
	},
});

const theme = createTheme({
	palette: {
		primary: {
			main: "rgb(20 184 166)",
		},
		secondary: {
			main: "rgb(71 85 105)",
		},
	},
});

const App = ({
	Component,
	pageProps: { session, ...pageProps },
}: AppPropsWithAuth) => {
	return (
		<>
			<Head>
				<title>Commercify</title>
				<link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
			</Head>
			<ErrorBoundary>
				<SessionProvider session={session}>
					<QueryClientProvider client={queryClient}>
						<CartProvider>
							<ThemeProvider theme={theme}>
								<StyledEngineProvider injectFirst>
									<CssBaseline />
									<NotificationProvider>
										<NoSsr>
											<Progress />
										</NoSsr>
										{Component.auth ? (
											<AuthFirewall auth={Component.auth}>
												<Component {...pageProps} />
											</AuthFirewall>
										) : (
											<Component {...pageProps} />
										)}
									</NotificationProvider>
								</StyledEngineProvider>
							</ThemeProvider>
						</CartProvider>
					</QueryClientProvider>
				</SessionProvider>
			</ErrorBoundary>
		</>
	);
};

export default App;
