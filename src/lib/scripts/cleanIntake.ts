/**
 * Clean Intake Script
 * 
 * This script removes all non-accepted applicants from the current intake cycle.
 * It's designed to be run after the intake process is complete and before opening
 * a new intake cycle, allowing rejected or no-show applicants to re-apply.
 * 
 * What it deletes:
 * - PreregMemberInfo: Pre-registration records
 * - MemberEBAssessment: Evaluation/Assessment records
 * - IntervieweeAttendance: Interview attendance tracking
 * - MemberInfo: Member information (if created but not accepted)
 * - UserAuth: User authentication accounts (only for never-accepted members)
 * 
 * What it keeps:
 * - All records with status "Accepted"
 * - UserAuth accounts for accepted members
 * 
 * Run this script with:
 * node dist/lib/scripts/cleanIntake.js
 * OR
 * tsx src/lib/scripts/cleanIntake.ts
 */

const dbConnect = require('../dbConnect')   


async function cleanIntake() {
    await dbConnect();

    const MemberInfo = require('../../model/MemberInfo')
    const PreregMemberInfo = require('../../model/PreregMemberInfo')
    const MemberEBAssessment = require('../../model/MemberEBAssessment')
    const IntervieweeAttendance = require('../../model/intervieweeAttendance')
    const UserAuth = require('../../model/UserAuth')

    const allEBAssessments = await MemberEBAssessment.find({})

    const deletableData: { email: string; studentId: string }[] = []

    for (const assessment of allEBAssessments) {
        if (assessment.status !== "Accepted") {
            const email = assessment.gSuiteEmail 
            const studentId = assessment.studentId
            
            // Check if this email is not already in the list
            if (!deletableData.find(item => item.email === email)) {
                deletableData.push({ email, studentId })
            }
        }
    }

    console.log(`Found ${deletableData.length} non-accepted members to delete`)

    // Delete by email
    for (const { email, studentId } of deletableData) {
        const deletedMemberInfo = await MemberInfo.deleteMany({ email })
        const deletedPrereg = await PreregMemberInfo.deleteMany({ email })
        const deletedAssessment = await MemberEBAssessment.deleteMany({ gSuiteEmail: email })
        const deletedAttendance = await IntervieweeAttendance.deleteMany({ studentId })
        const deletedAuth = await UserAuth.deleteMany({ email })
        
        console.log(`Deleted records for ${email}:`, {
            memberInfo: deletedMemberInfo.deletedCount,
            prereg: deletedPrereg.deletedCount,
            assessment: deletedAssessment.deletedCount,
            attendance: deletedAttendance.deletedCount,
            auth: deletedAuth.deletedCount
        })
    }

    console.log("✅ Successfully deleted all non-accepted members and related data")
}

// Run the cleanup
cleanIntake()
    .then(() => {
        console.log("Cleanup completed")
        process.exit(0)
    })
    .catch((error) => {
        console.error("Cleanup failed:", error)
        process.exit(1)
    })