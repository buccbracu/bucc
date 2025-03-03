"use client";

import Heading from "@/components/portal/heading";
import CompleteRegistrationCard from "./CompleteRegistrationCard";
import DownloadCSVCard from "./DownloadCSVCard";
import DownloadDataCard from "./DownloadDataCard";
import RegisterExistingMembersCard from "./RegisterExistingMembersCard";

export default function ManageData() {
  return (
    <main>
      <Heading
        headingText="Manage Data"
        subHeadingText="This is the backup page. You can download the data from this page clicking the button below. The data will be downloaded in a zip file."
      />
      <div className="mb-6 grid h-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <DownloadDataCard />
        <CompleteRegistrationCard />
        <RegisterExistingMembersCard />
        <DownloadCSVCard
          url="http://localhost:3000/api/preregistration"
          fileName="PreRegMemberInfos"
        />
        <DownloadCSVCard
          url="http://localhost:3000/api/members"
          fileName="MemberInfos"
        />
        <DownloadCSVCard
          url="http://localhost:3000/api/ebassessment"
          fileName="EbassessmentInfos"
        />
      </div>
    </main>
  );
}
