import ActionButtons from "./action-buttons";
import Logo from "./logo";
import NavigationBar from "./navigation-bar";

export default function Navbar() {
  return (
    <div className="border-b py-4 dark:border-gray-700 h-[85px]">
      <div className="container flex justify-between items-center">
        <Logo />
        <NavigationBar />
        <ActionButtons />
      </div>
    </div>
  );
}
