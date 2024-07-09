export { default } from "next-auth/middleware";

// Add the routes that should be only reachable by people that have been authenticated
export const config = {
	matcher: ["/properties/add", "/profile", "/properties/saved", "/messages"],
};
