import { auth } from "@/auth";

export async function hasAuth(permittedDesignations: string[] = [], permittedDepartments: string[] = []) {


    let isPermitted = true;

    const session = await auth();
    
    if (!session) {
        isPermitted = false;
        return { session: null, isPermitted: false };
    }
    
    // If Permitted Designations is an empty array, then all designations are allowed or else check if the user's designation is in the permittedDesignations array

    if (permittedDesignations.length > 0) {
        if (permittedDesignations.includes(session.user.designation)) {
            isPermitted = true;
        }
        else {
            isPermitted = false;
        }
    } else {
        isPermitted = true;
    }

    // If Permitted Departments is an empty array, then all departments are allowed or else check if the user's department is in the permittedDepartments array

    if (permittedDepartments.length > 0) {
        if (permittedDepartments.includes(session.user.buccDepartment)) {
            isPermitted = true;
        }
        else {
            isPermitted = false;
        }
    } else {
        isPermitted = true;
    }



    return {session, isPermitted};

    

}