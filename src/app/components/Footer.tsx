export default function Footer() {
  return (
    <div className="border-t py-2 dark:border-gray-700 h-[55px]">
      <div className="container py-2 flex flex-col md:flex-row justify-between items-center">
        <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
          Made with ❤️ by{" "}
          <a
            href="/about/bucc-web-team"
            className="text-blue-500 dark:text-blue-400"
          >
            BUCC R&D Web Team 2024
          </a>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400 text-center ">
          <a href="/" className="text-blue-500 dark:text-blue-400">
            BRAC University Computer Club
          </a>{" "}
          &copy; {new Date().getFullYear()} | All rights reserved.
        </div>
        <div className="flex justify-between items-center gap-2">
          <a
            href="/about/privacy-policy"
            className="text-sm text-gray-500 dark:text-gray-400 text-center"
          >
            Privacy Policy
          </a>
          <span className="text-lg text-gray-500 dark:text-gray-400 items-center mt-1">
            •
          </span>
          <a
            href="/about/terms-of-service"
            className="text-sm text-gray-500 dark:text-gray-400"
          >
            Terms of Service
          </a>
        </div>
      </div>
    </div>
  );
}
