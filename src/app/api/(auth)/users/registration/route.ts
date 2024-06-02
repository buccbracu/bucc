import { NextRequest, NextResponse } from "next/server";
import  dbConnect  from "@/lib/dbConnect";
import PreregMemberInfo from "@/model/PreregMemberInfo";

export async function POST(request: NextRequest) {

    try {

        const body = await request.json();
        const { student_id, name, joined_bracu,department_bracu,gsuite_email} = body;

        await dbConnect();

        const member = await PreregMemberInfo.findOne({ gsuite_email: gsuite_email });

        if (member) {
            console.log("User already exists");
            return NextResponse.json({ message: "User already exists" }, { status: 400 });
        }

        const newMember = new PreregMemberInfo({
            student_id,
            name,
            joined_bracu,
            department_bracu,
            gsuite_email
        });

        await newMember.save();

        

        console.log(body)

        return NextResponse.json({ message: "Registration Successful" }, { status: 200 });

        
    } catch (error:any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
        
    }
}