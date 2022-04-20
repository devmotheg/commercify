/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import type { Query, Schema, Document, Model } from "mongoose";

import type {
	productConditions,
	productCategories,
	productVariantsKind,
} from "../data";

type ModifiedQuery = Query<any, any> & {
	[index: string]: any;
};

interface UserSchema extends Schema {
	_s: string;
	email: string;
	image: string;
	name: string;
	createdAt: Date;
}

type UserDocument = UserSchema & Document;

type UserModel = Model<UserDocument>;

interface ProductSchema extends Schema {
	seller: Schema.Types.ObjectId | UserDocument;
	title: string;
	stock: number;
	price: number;
	condition: typeof productConditions[number];
	images: string[];
	category: typeof productCategories[number];
	rating: {
		average: number;
		quantity: number;
	};
	variants?: {
		kind: typeof productVariantsKind[number];
		ids: Schema.Types.ObjectId[];
	};
	description?: string;
	bulletPoints?: string[];
	createdAt: Date;
}

type ProductDocument = ProductSchema & Document;

interface ProductModel extends Model<ProductDocument> {
	subscribeToDeletion: (
		fun: (productId: Schema.Types.ObjectId) => Promise<void>
	) => void;
}

interface CartSchema extends Schema {
	customer: Schema.Types.ObjectId | UserDocument;
	items: { product: Schema.Types.ObjectId; quantity: number }[];
}

interface CartDocument extends CartSchema, Document {
	syncCart: (items: [schema.Types.ObjectId, number][]) => Promise<void>;
}

type CartModel = Model<CartDocument>;

interface AnalyticSchema extends Schema, Pick<ProductDocument, "seller"> {
	product: ProductDocument;
	hours: { purchased: number }[];
	createdAt: Date;
}

type AnalyticDocument = AnalyticSchema & Document;

type AnalyticModel = Model<AnalyticDocument>;

interface ReviewSchema extends Schema {
	product: Schema.Types.ObjectId | ProductDocument;
	customer: Schema.Types.ObjectId | UserDocument;
	rating: number;
	comment: string;
	createdAt: Date;
}

type ReviewDocument = ReviewSchema & Document;

interface ReviewModel extends Model<ReviewDocument> {
	updateRatingStats: (productId: Schema.Types.ObjectId) => Promise<void>;
}

type PurchaseSchema = Pick<AnalyticSchema, "product"> &
	Pick<ReviewSchema, "customer" | "createdAt"> & {
		quantity: number;
	};

type PurchaseDocument = PurchaseSchema & Document;

type PurchaseModel = Model<PurchaseDocument>;

export {
	ModifiedQuery,
	UserDocument,
	UserModel,
	ProductDocument,
	ProductModel,
	CartDocument,
	CartModel,
	AnalyticDocument,
	AnalyticModel,
	ReviewDocument,
	ReviewModel,
	PurchaseDocument,
	PurchaseModel,
};
