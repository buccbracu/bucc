export default function Footer() {
  return (
    <div className="border-t py-4 dark:border-gray-700 h-[55px]">
      <div className="container flex justify-between items-center">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <a href="/" className="text-blue-500 dark:text-blue-400">
            BRAC University Computer Club
          </a>{" "}
          &copy; {new Date().getFullYear()} | All rights reserved.
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Made with ❤️ by{" "}
          <a
            href="/about/bucc-web-team"
            className="text-blue-500 dark:text-blue-400"
          >
            BUCC R&D Web Team 2024
          </a>
        </div>
        <div>
          <a
            href="/about/privacy-policy"
            className="text-sm text-gray-500 dark:text-gray-400"
          >
            Privacy Policy
          </a>

          <a
            href="/about/terms-of-service"
            className="text-sm text-gray-500 dark:text-gray-400 ml-4"
          >
            Terms of Service
          </a>
        </div>
      </div>
    </div>
  );
}
