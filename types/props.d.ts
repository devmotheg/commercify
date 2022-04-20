/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import type { NextComponentType, NextPage } from "next";
import type { AppProps } from "next/app";
import type { ReactElement, Dispatch, SetStateAction } from "react";

import type {
	Auth,
	ProductManageInfoState,
	ProductDocument,
	ReviewDocument,
} from ".";

type AppPropsWithAuth = AppProps & {
	Component: NextComponentType & {
		auth?: Auth;
	};
};

type DashboardProductsManageProps = { productInfo: ProductManageInfoState };

type ProductProps = { product: ProductDocument };

type WrapperProps = {
	children: ReactElement | ReactElement[];
};

type AuthFirewallProps = WrapperProps & {
	auth: Auth;
};

type ErrorBoundaryProps = WrapperProps & {
	fallback?: ReactElement;
};

type NotificationProps = {
	open: boolean;
	type: "success" | "error";
	message: string;
};

type ImageUploadListProps = {
	info: ProductManageInfoState;
	setInfo: Dispatch<SetStateAction<ProductManageInfoState>>;
};

type ImageUploadProps = ImageUploadListProps & {
	index: number;
};

type BulletPointListProps = ImageUploadListProps;

type BulletPointProps = ImageUploadProps;

type ProductControlBarProps = Pick<ImageUploadListProps, "info">;

type DashboardProductProps = ProductProps;

type ProductCardProps = DashboardProductProps;

type ProductDetailsProps = ProductCardProps;

type ReviewListProps = ProductDetailsProps & {
	loadMore: () => void;
	canReview: boolean;
	reviews: ReviewDocument[];
	setReviews: Dispatch<SetStateAction<ReviewDocument[]>>;
};

type ReviewProps = Pick<ReviewListProps, "canReview" | "setReviews"> & {
	review: ReviewDocument;
};

type ReviewControlProps = Pick<ReviewListProps, "canReview"> & {
	initialIsActive: boolean;
	initialRating: number;
	initialComment: string;
	alt: string;
	src: string;
	clickHandler: (rating: number, comment: string) => void;
	cancelHandler?: () => void;
	text: string;
};

type CartProductProps = ProductDetailsProps & {
	setProducts: Dispatch<SetStateAction<ProductDocument[]>>;
};

export {
	AppPropsWithAuth,
	AuthFirewallProps,
	DashboardProductsManageProps,
	ProductProps,
	WrapperProps,
	ErrorBoundaryProps,
	NotificationProps,
	ImageUploadListProps,
	ImageUploadProps,
	BulletPointListProps,
	BulletPointProps,
	ProductControlBarProps,
	DashboardProductProps,
	ProductCardProps,
	ProductDetailsProps,
	ReviewListProps,
	ReviewProps,
	ReviewControlProps,
	CartProductProps,
};
