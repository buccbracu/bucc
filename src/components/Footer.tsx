import Image from "next/image";
import Link from "next/link";
import BUCCIcon from "/public/assets/bucc-icon.svg";
import BUCCLogo from "/public/assets/bucc-logo.svg";
export default function Footer() {
  return (
    <div data-theme="dark" className="text-[#ffffff]">
      <div className="">
        <footer className="footer p-40 text-[#ffffff] text-base-content">
          <aside className="mr-60">
            <div>
              <Link href="/">
                <picture>
                  <source
                    media="(max-width: 768px)"
                    srcSet={BUCCIcon.src}
                    width={60}
                  />
                  <source media="(min-width: 769px)" srcSet={BUCCLogo.src} />

                  <Image
                    className="cursor-pointer dark:brightness-0 dark:grayscale dark:invert dark:filter"
                    src={BUCCLogo.src}
                    alt="BUCC Logo"
                    width={260}
                    height={260}
                  />
                </picture>
              </Link>
              <p className="my-8">
                Empowering students through technology and innovation.
                <br />
                Join us to enhance your skills and network with like-minded
                individuals.
              </p>
              <div className="flex gap-3">
                <Link href="https://www.facebook.com/BRACUCC">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 24 25"
                    fill="none"
                  >
                    <path
                      d="M12 21.0161C16.9706 21.0161 21 16.9867 21 12.0161C21 7.04555 16.9706 3.01611 12 3.01611C7.02944 3.01611 3 7.04555 3 12.0161C3 16.9867 7.02944 21.0161 12 21.0161Z"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                    <path
                      d="M15.75 8.26611H14.25C13.6533 8.26611 13.081 8.50317 12.659 8.92512C12.2371 9.34708 12 9.91938 12 10.5161V21.0161"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                    <path
                      d="M9 13.5161H15"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                    <defs>
                      <linearGradient
                        id="paint0_linear_154_628"
                        x1="12"
                        y1="3.01611"
                        x2="12"
                        y2="21.0161"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stop-color="#AFFB42"></stop>
                        <stop offset="1" stop-color="#01DB86"></stop>
                      </linearGradient>
                      <linearGradient
                        id="paint1_linear_154_628"
                        x1="13.875"
                        y1="8.26611"
                        x2="13.875"
                        y2="21.0161"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stop-color="#AFFB42"></stop>
                        <stop offset="1" stop-color="#01DB86"></stop>
                      </linearGradient>
                      <linearGradient
                        id="paint2_linear_154_628"
                        x1="12"
                        y1="13.5161"
                        x2="12"
                        y2="14.5161"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stop-color="#AFFB42"></stop>
                        <stop offset="1" stop-color="#01DB86"></stop>
                      </linearGradient>
                    </defs>
                  </svg>
                </Link>
                <Link href="https://www.linkedin.com/company/bucc/?originalSubdomain=bd">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 24 25"
                    fill="none"
                  >
                    <path
                      d="M19.5 3.76611H4.5C4.08579 3.76611 3.75 4.1019 3.75 4.51611V19.5161C3.75 19.9303 4.08579 20.2661 4.5 20.2661H19.5C19.9142 20.2661 20.25 19.9303 20.25 19.5161V4.51611C20.25 4.1019 19.9142 3.76611 19.5 3.76611Z"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                    <path
                      d="M11.25 10.5161V16.5161"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                    <path
                      d="M8.25 10.5161V16.5161"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                    <path
                      d="M11.25 13.1411C11.25 12.4449 11.5266 11.7772 12.0188 11.285C12.5111 10.7927 13.1788 10.5161 13.875 10.5161C14.5712 10.5161 15.2389 10.7927 15.7312 11.285C16.2234 11.7772 16.5 12.4449 16.5 13.1411V16.5161"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                    <path
                      d="M8.25 8.64111C8.87132 8.64111 9.375 8.13743 9.375 7.51611C9.375 6.89479 8.87132 6.39111 8.25 6.39111C7.62868 6.39111 7.125 6.89479 7.125 7.51611C7.125 8.13743 7.62868 8.64111 8.25 8.64111Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </Link>
              </div>
            </div>
          </aside>
          <nav className="text center mb-8">
            <h6 className="mb-8px text-xl font-bold uppercase text-[#ffffff]">
              Services
            </h6>
            <a className="cursor-pointer transition duration-300 hover:text-green-700">
              Branding
            </a>
            <a className="cursor-pointer transition duration-300 hover:text-green-700">
              Design
            </a>
            <a className="cursor-pointer transition duration-300 hover:text-green-700">
              Marketing
            </a>
            <a className="cursor-pointer transition duration-300 hover:text-green-700">
              Advertisement
            </a>
          </nav>
          <nav>
            <h6 className="mb-8px text-xl font-bold uppercase text-[#ffffff]">
              Company
            </h6>
            <a className="cursor-pointer transition duration-300 hover:text-green-700">
              About us
            </a>
            <a className="cursor-pointer transition duration-300 hover:text-green-700">
              Contact
            </a>
            <a className="cursor-pointer transition duration-300 hover:text-green-700">
              Jobs
            </a>
            <a className="cursor-pointer transition duration-300 hover:text-green-700">
              Press kit
            </a>
          </nav>
          <nav>
            <h6 className="mb-8px text-xl font-bold uppercase text-[#ffffff]">
              Legal
            </h6>
            <a className="cursor-pointer transition duration-300 hover:text-green-700">
              Terms of use
            </a>
            <a className="cursor-pointer transition duration-300 hover:text-green-700">
              Privacy policy
            </a>
            <a className="cursor-pointer transition duration-300 hover:text-green-700">
              Cookie policy
            </a>
          </nav>
          <nav>
            <h6 className="mb-10px text-xl font-bold uppercase text-[#ffffff]">
              Social
            </h6>
            <br></br>
            <div className="grid grid-flow-col gap-4">
              <a
                href="https://www.linkedin.com/company/bucc/mycompany/"
                target="_blank"
              >
                <svg
                  fill="#ffffff"
                  height="28"
                  width="28"
                  version="1.1"
                  id="Layer_1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 310 310"
                  stroke="#ffffff"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <g id="XMLID_801_">
                      {" "}
                      <path
                        id="XMLID_802_"
                        d="M72.16,99.73H9.927c-2.762,0-5,2.239-5,5v199.928c0,2.762,2.238,5,5,5H72.16c2.762,0,5-2.238,5-5V104.73 C77.16,101.969,74.922,99.73,72.16,99.73z"
                      ></path>{" "}
                      <path
                        id="XMLID_803_"
                        d="M41.066,0.341C18.422,0.341,0,18.743,0,41.362C0,63.991,18.422,82.4,41.066,82.4 c22.626,0,41.033-18.41,41.033-41.038C82.1,18.743,63.692,0.341,41.066,0.341z"
                      ></path>{" "}
                      <path
                        id="XMLID_804_"
                        d="M230.454,94.761c-24.995,0-43.472,10.745-54.679,22.954V104.73c0-2.761-2.238-5-5-5h-59.599 c-2.762,0-5,2.239-5,5v199.928c0,2.762,2.238,5,5,5h62.097c2.762,0,5-2.238,5-5v-98.918c0-33.333,9.054-46.319,32.29-46.319 c25.306,0,27.317,20.818,27.317,48.034v97.204c0,2.762,2.238,5,5,5H305c2.762,0,5-2.238,5-5V194.995 C310,145.43,300.549,94.761,230.454,94.761z"
                      ></path>{" "}
                    </g>{" "}
                  </g>
                </svg>
              </a>

              <a href="https://www.facebook.com/BRACUCC" target="_blank">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  className="fill-current"
                >
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
                </svg>
              </a>
            </div>
          </nav>
        </footer>
      </div>
      <footer className="footer footer-center p-10 text-base-content">
        <aside>
          <p className="">
            Copyright © {new Date().getFullYear()} - All right reserved by BRAC
            University Computer Club (BUCC)
          </p>
        </aside>
      </footer>
    </div>
  );
}
