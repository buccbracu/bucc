import Heading from "@/components/portal/heading";
import ChangePassword from "@/components/portal/settings/ChangePassword";
import EditProfile from "@/components/portal/settings/EditProfile";
import UpdateProfilePhoto from "@/components/portal/settings/UpdateProfilePhoto";

export default function Settings() {
  return (
    <>
      <Heading
        headingText="Settings"
        subHeadingText="This is a scrollable dashboard. Scroll down to see more content..."
      />
      <section className="mx-auto ">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 h-full">
          <UpdateProfilePhoto />
          <EditProfile />
          <ChangePassword />
        </div>
      </section>
    </>
  );
}
