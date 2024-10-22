import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";


export async function hasAuth(permittedDesignations: string[] = [], permittedDepartments: string[] = []) {

    await dbConnect();

    let isPermitted = true;

    const session = await auth();
    
    if (!session) {
        isPermitted = false;
        return { session: null, isPermitted: false };
    }
    
    // If Permitted Designations is an empty array, then all designations are allowed or else check if the user's designation is in the permittedDesignations array

    if (permittedDesignations.length > 0) {
        permittedDesignations = permittedDesignations.map(designation => designation.toLowerCase());
        if (permittedDesignations.includes(session.user.designation.toLowerCase())) {
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
        permittedDepartments = permittedDepartments.map(department => department.toLowerCase());
        if (permittedDepartments.includes(session.user.buccDepartment.toLowerCase())) {
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