/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import { useRouter } from "next/router";
import { useState, useEffect } from "react";

const Progress = () => {
	const router = useRouter();
	const [state, setState] = useState({
		isFocused: true,
		isMounted: false,
		progress: 0,
	});

	useEffect(() => {
		const handleStart = () =>
			setState(prevState => {
				return { ...prevState, isMounted: true };
			});

		const handleEnd = () =>
			setState(prevState => {
				return { ...prevState, isMounted: false };
			});

		router.events.on("routeChangeStart", handleStart);
		router.events.on("routeChangeError", handleEnd);
		router.events.on("routeChangeComplete", handleEnd);

		return () => {
			router.events.off("routeChangeStart", handleStart);
			router.events.off("routeChangeError", handleEnd);
			router.events.off("routeChangeComplete", handleEnd);
		};
	}, [router]);

	useEffect(() => {
		const focusHandler = function (this: Window) {
			setState(() => {
				return { ...state, isFocused: true };
			});
		};

		const blurHandler = function (this: Window) {
			setState(() => {
				return { ...state, isFocused: false };
			});
		};

		window.addEventListener("focus", focusHandler);
		window.addEventListener("blur", blurHandler);

		return () => {
			window.removeEventListener("focus", focusHandler);
			window.removeEventListener("blur", blurHandler);
		};
	});

	useEffect(() => {
		if (!state.isMounted) {
			let innerTimeout: NodeJS.Timeout | undefined;
			const outerTimeout = setTimeout(() => {
				setState(state => {
					return { ...state, progress: 1 };
				});
				innerTimeout = setTimeout(
					() =>
						setState(state => {
							return { ...state, progress: 0 };
						}),
					175
				);
			}, 25);

			return () => {
				clearTimeout(outerTimeout);
				if (innerTimeout) clearTimeout(innerTimeout);
			};
		}
	}, [state.isMounted]);

	useEffect(() => {
		if (!state.isFocused || !state.isMounted || state.progress >= 0.95) return;

		const interval = setInterval(
			() =>
				setState(prevState => {
					return {
						...prevState,
						progress:
							prevState.progress +
							Math.min(
								Math.random() * 0.015,
								(1 - prevState.progress) * Math.random() * 0.015
							),
					};
				}),
			200
		);

		return () => clearInterval(interval);
	}, [state]);

	return (
		<div
			className="pointer-events-none relative z-50 transition duration-500"
			style={{
				opacity: state.isMounted ? 1 : 0,
			}}>
			<div
				className="fixed top-0 left-0 h-1 w-full bg-teal-500 transition-all"
				style={{
					width: `${state.progress * 100}%`,
				}}>
				<div className="absolute right-0 block h-full w-24 -translate-y-1 rotate-3 opacity-100 shadow-md shadow-teal-500"></div>
			</div>
		</div>
	);
};

export default Progress;
