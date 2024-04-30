import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex justify-between max-container oadding container relative z-30 py-5 items-center">
      <Link href="/">
        <Image
          src="/assets/bucc-logo.svg"
          alt="BUCC Logo"
          width={180}
          height={80}
        />
      </Link>
    </nav>
  );
}
