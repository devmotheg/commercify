/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import type { ErrorInfo } from "react";
import { Component } from "react";

import type {
	CustomError,
	ErrorBoundaryProps,
	ErrorBoundaryState,
} from "../../types";

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props);

		this.state = {
			hasError: false,
		};
	}

	static getDerivedStateFromError(error: CustomError) {
		return { hasError: true };
	}

	componentDidCatch(error: CustomError, errorInfo: ErrorInfo) {
		if (process.env.NODE_ENV === "development") console.error(errorInfo);
	}

	render() {
		if (this.state.hasError)
			return this.props.fallback ? (
				this.props.fallback
			) : (
				<main className="flex min-h-screen items-center justify-center">
					<strong className="block p-4 text-center text-3xl font-bold capitalize">
						an error has occurred, come back later
					</strong>
				</main>
			);

		return this.props.children;
	}
}

export default ErrorBoundary;
