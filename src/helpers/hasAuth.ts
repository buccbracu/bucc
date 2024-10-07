import { auth } from "@/auth";

export async function hasAuth() {

    const session = await auth();
    
    if (!session) {
        return false
    }
    
    return true;

}