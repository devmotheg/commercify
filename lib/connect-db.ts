/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import { connections, connect } from "mongoose";

const connectDb = async () => {
	if (connections[0].readyState) return;

	let dbConnectionUri = process.env.DB_LOCAL || "";
	if (process.env.DB_REMOTE && process.env.DB_PASS) {
		dbConnectionUri = process.env.DB_REMOTE.replace(
			/<password>/,
			process.env.DB_PASS
		);
	}

	await connect(dbConnectionUri);
	console.info("DB connection established...");
};

export default connectDb;
