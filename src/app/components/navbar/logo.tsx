import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <div>
      <Link href="/">
        <picture>
          <source
            media="(max-width: 768px)"
            srcSet="/assets/bucc-icon.svg"
            width={60}
          />
          <source media="(min-width: 769px)" srcSet="/assets/bucc-logo.svg" />

          <Image
            className="cursor-pointer dark:filter dark:invert dark:grayscale dark:brightness-0"
            src="/assets/bucc-logo.svg"
            alt="BUCC Logo"
            width={160}
            height={60}
          />
        </picture>
      </Link>
    </div>
  );
}
