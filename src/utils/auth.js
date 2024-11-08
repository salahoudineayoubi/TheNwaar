import { getToken } from "next-auth/jwt";
import User from "@/models/User";
import dbConnect from "@/utils/dbconnect";

// check if user is logged in
export default async function auth(req) {
    const token = await getToken({ req, secret: process.env.JWT_SECRET });
    if (!token) {
        return { error: "User not authenticated" };  // Added a more specific return for unauthenticated users
    }
    
    try {
        await dbConnect();  // Ensure dbConnect is awaited to handle DB connection properly
        const user = await User.findOne({ email: token.email });
        if (!user) {
            return { error: "User not found" };  // Return a specific error if no user is found
        }
        return user;
    } catch (error) {
        console.error(error);
        return { error: error.message || "Internal server error" };  // Provide a more specific error message
    }
}
