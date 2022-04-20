/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import type { ParsedUrlQuery } from "querystring";
import type { ParsedQs } from "qs";
import type { Query } from "mongoose";

class ApiFeatures {
	dbQuery: Query<any[], any, {}, any>;
	urlQuery: ParsedUrlQuery | ParsedQs;
	action: "find" | "count";

	constructor(
		dbQuery: Query<any[], any, {}, any>,
		urlQuery: ParsedUrlQuery | ParsedQs,
		action: "find" | "count"
	) {
		this.dbQuery = dbQuery;
		this.urlQuery = urlQuery;
		this.action = action;
	}

	filter() {
		const urlQueryCopy = JSON.parse(
			JSON.stringify(this.urlQuery).replace(
				/\blt|lte|gt|gte\b/g,
				match => `$${match}`
			)
		);
		for (const specialField of ["sort", "limit", "page"])
			delete urlQueryCopy[specialField];

		this.dbQuery[this.action](urlQueryCopy);

		return this;
	}

	sort() {
		if (this.urlQuery.sort) this.dbQuery.sort(this.urlQuery.sort);
		else this.dbQuery.sort("-createdAt");

		return this;
	}

	paginate() {
		const limit = Number(this.urlQuery.limit) || 10;
		const page = Number(this.urlQuery.page) || 1;

		this.dbQuery.limit(limit).skip((page - 1) * limit);

		return this;
	}

	async execute() {
		return await this.dbQuery;
	}
}

export default ApiFeatures;
