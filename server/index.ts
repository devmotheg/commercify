import next from "next";
import express from "express";

import connectDb from "../lib/connect-db";
import globalErrorHandler from "../lib/global-error-handler";

const port = parseInt(process.env.PORT || "3000", 10);
const framework = next({ dev: process.env.NODE_ENV !== "production" });
const handle = framework.getRequestHandler();

(async () => {
	try {
		await framework.prepare();
		const app = express();

		app.listen(port, () => {
			console.info(`Listening on port ${port}...`);
		});

		app.all(/^\/(?!api($|\/.*))/, (req, res) => handle(req, res));

		await connectDb();
		app.all(/^\/api($|\/.*)/, (req, res) => handle(req, res));
	} catch (err) {
		globalErrorHandler(err);
	}
})();
