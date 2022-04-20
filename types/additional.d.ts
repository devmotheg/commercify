/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

type Auth = {
	usersOnly?: boolean;
	guestsOnly?: boolean;
};

interface CustomError extends Error {
	[index: string]: any;
}

export { Auth, CustomError };
