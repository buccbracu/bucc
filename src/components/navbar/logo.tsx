import Image from "next/image";
import Link from "next/link";
import BUCCIcon from "/public/assets/bucc-icon.svg";
import BUCCLogo from "/public/assets/bucc-logo.svg";

export default function Logo() {
  return (
    <div>
      <Link href="/">
        <picture>
          <source media="(max-width: 768px)" srcSet={BUCCIcon.src} width={60} />
          <source media="(min-width: 769px)" srcSet={BUCCLogo.src} />

          <Image
            className="cursor-pointer dark:filter dark:invert dark:grayscale dark:brightness-0"
            src={BUCCLogo.src}
            alt="BUCC Logo"
            width={160}
            height={60}
          />
        </picture>
      </Link>
    </div>
  );
}
