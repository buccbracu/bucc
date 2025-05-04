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
        title="Pre-Registration Data"
        description="This is the data of the members who have pre-registered. You can download the data from this page clicking the button below. The data will be downloaded in a zip file."
          url="/api/preregistration"
          fileName="PreRegMemberInfos"
          isDisabled={true}
        />
        <DownloadCSVCard
        title="Member Data"
        description="This is the data of the members who have registered. You can download the data from this page clicking the button below. The data will be downloaded in a zip file."
          url="/api/members"
          fileName="MemberInfos"
          isDisabled={false}
        />
        <DownloadCSVCard
        title="Evaluation Data"
        description="This is the data of the members who have registered. You can download the data from this page clicking the button below. The data will be downloaded in a zip file."
          url="/api/ebassessment"
          fileName="EbassessmentInfos"
          isDisabled={true}
        />
      </div>
    </main>
  );
}
