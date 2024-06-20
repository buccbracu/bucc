import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import MemberInfo from "@/model/MemberInfo";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  await dbConnect();

  const url = new URL(request.url);
  const MemberID = url.searchParams.get("id");

  const user = await auth();
  if (!user) {
    return NextResponse.json({
      message: "You are not authorized to view this page",
    });
  }

  try {
    const users = await MemberInfo.findById(MemberID);

    if (!users) {
      return NextResponse.json({
        message: "User not found",
      });
    }

    return NextResponse.json({ user: users });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest){
  //TODO: Update Profile for Individual User and HR

    await dbConnect();
    const session = {user: {id: "615f7b3b1f3b3b001f3b3b3b", designation: "HUMAN RESOURCES"}}; //WARNING< MUST FIX THIS

    

    if (!session) {
      return NextResponse.json({
        message: "You are not authorized to view this page",
      });
    }

    const {id,designation} = session.user;

    const body = await request.json();

    if (id !== body.id && designation !== "HUMAN RESOURCES") {
      return NextResponse.json({
        message: "You are not 1 authorized to update this profile",
      }, {status: 401});
    }

    const permitted_fields = {
      general: [
        'personalEmail', 
        'contactNumber', 
        'profileImage', 
        'birthDate', 
        'bloodGroup',
        'gender',
        'emergencyContact',
        'memberSkills',
        'memberSocials'
      ],
      admin: [
        "name",
        "studentId",
        "email",
        "buccDepartment",
        "designation",
        "personalEmail",
        "contactNumber",
        "joinedBracu",
        "departmentBracu",
        "profileImage",
        "rfid",
        "birthDate",
        "bloodGroup",
        "gender",
        "emergencyContact",
        "joinedBucc",
        "lastPromotion",
        "memberStatus",
        "memberSkills",
        "memberSocials"
      ],
    };

    const allowed_fields = session.user.designation === "HUMAN RESOURCES" ? permitted_fields.admin : permitted_fields.general;

    //Check if it is a valid request
    const keys = Object.keys(body).filter(key => key !== 'id');
    const is_valid = keys.every((key) => allowed_fields.includes(key));

    if (!is_valid) {
      return NextResponse.json({
        message: "Invalid Request. You are not authorized to update these fields",
      });
    }

    try {
      const user = await MemberInfo.findOne({ _id: body.id });

      if (!user) {
        return NextResponse.json({
          message: "User not found",
        });
      }

        const {memberSkills,memberSocials, ...otherFields} = body;



      if (memberSocials) {
          const socialKeys = Object.keys(memberSocials);
  
          console.log(socialKeys);
  
  
  
          for (let key of socialKeys) {
            if (!["Facebook","Github","Linkedin"].includes(key) || !memberSocials[key]) {
              return NextResponse.json({
                message: "Invalid Request. You are not authorized to update these fields",
              });
            }
          }
      }

      console.log(memberSocials);

        let skillsArray: any[] = [];

        if (memberSkills) {
          memberSkills.forEach((skill:any) => {
            skillsArray.push(skill.value);
          });
        }

        let updateObject =  {
          ...otherFields,
          memberSocials
        };

        console.log(updateObject);

        const updatedUser = await MemberInfo.findOneAndUpdate(
          {_id: body.id},
          {...updateObject,
            $push:{memberSkills:{$each:skillsArray}}
          },
          {new:true});

        return NextResponse.json({user: updatedUser});

        }



     catch (error) {
      console.log(error);
      return NextResponse.json({ error: error });
      
    }



}
