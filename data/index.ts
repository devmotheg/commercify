/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

const productConditions = ["new", "renewed", "used"] as const;
const productCategories = [
	"beauty",
	"electronics",
	"fashion",
	"fitness",
	"other",
] as const;
const productVariantsKind = ["color", "size"] as const;

export { productConditions, productCategories, productVariantsKind };
