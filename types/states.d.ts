/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import type { NotificationProps, ProductDocument } from ".";
import type { productConditions, productCategories } from "../data";

type ErrorBoundaryState = {
	hasError: boolean;
};

type NotificationProviderState = NotificationProps;

type ProductManageInfoState = {
	title: string;
	stock: string;
	price: string;
	condition: typeof productConditions[number];
	images: string[];
	category: typeof productCategories[number];
	description: string;
	bulletPoints: string[];
};

type ProductListFiltersState = {
	condition: typeof productConditions[number] | "any";
	category: typeof productCategories[number] | "any";
};

type CartProviderState = {
	product: ProductDocument["_id"];
	quantity: number;
}[];

export {
	ErrorBoundaryState,
	NotificationProviderState,
	ProductManageInfoState,
	ProductListFiltersState,
	CartProviderState,
};
