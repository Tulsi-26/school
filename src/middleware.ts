import { withAuth } from "next-auth/middleware";

export default withAuth({
    pages: {
        signIn: "/signup", // Redirect to signup as requested
    },
});

export const config = {
    matcher: [
        "/physics-lab/:path+", // Protect all subroutes of physics-lab
    ],
};
