import Heading from "@/components/portal/heading";
import ChangePassword from "@/components/portal/settings/ChangePassword";
import EditProfile from "@/components/portal/settings/EditProfile";

export default function Settings() {
  return (
    <div className="">
      <Heading
        headingText="Settings"
        subHeadingText="This is a scrollable dashboard. Scroll down to see more content..."
      />
      <section>
        <div className="mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <EditProfile />
          <ChangePassword />
        </div>
      </section>
    </div>
  );
}
