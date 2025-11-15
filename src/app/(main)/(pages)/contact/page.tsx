import dynamic from "next/dynamic";
import { buccSocials } from "@/constants/buccInfo";
import {
  Facebook,
  Github,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Youtube,
} from "lucide-react";
import Link from "next/link";

const ContactForm = dynamic(() => import("@/components/contact/ContactForm"), {
  loading: () => <div className="h-[400px] animate-pulse bg-muted rounded-lg" />,
  ssr: false,
});

export const metadata = {
  title: "Contact Us | BUCC",
  description:
    "Get in touch with BRAC University Computer Club. We are here to answer your questions and help you get involved.",
};

// Static page - no revalidation needed
export const revalidate = false;

export default function Contact() {
  return (
    <div className="min-h-[calc(100vh-140px)]">
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white md:text-5xl">
            Get in Touch
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            Have questions or want to get involved? We&apos;d love to hear from you.
            Reach out to us and we&apos;ll respond as soon as possible.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <h2 className="mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                Contact Information
              </h2>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/30">
                    <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      Email
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      bucc@bracu.ac.bd
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      For business: marketing.bucc@g.bracu.ac.bd
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/30">
                    <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      Phone
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      +880 1756 020067
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/30">
                    <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      Address
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Kha 226, Bir Uttam Rafiqul Islam Ave,
                      <br />
                      Badda, Dhaka 1212
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <h2 className="mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                Connect With Us
              </h2>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={buccSocials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg bg-blue-100 px-4 py-2 transition hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Facebook
                  </span>
                </Link>
                <Link
                  href={buccSocials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg bg-blue-100 px-4 py-2 transition hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    LinkedIn
                  </span>
                </Link>
                <Link
                  href={buccSocials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg bg-blue-100 px-4 py-2 transition hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Instagram
                  </span>
                </Link>
                <Link
                  href={buccSocials.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg bg-blue-100 px-4 py-2 transition hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50"
                  aria-label="YouTube"
                >
                  <Youtube className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    YouTube
                  </span>
                </Link>
                <Link
                  href={buccSocials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg bg-blue-100 px-4 py-2 transition hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50"
                  aria-label="GitHub"
                >
                  <Github className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    GitHub
                  </span>
                </Link>
              </div>
            </div>

            {/* Club Hours */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
                Club Hours
              </h2>
              <div className="space-y-2 text-gray-600 dark:text-gray-400">
                <p>
                  <span className="font-medium text-gray-900 dark:text-white">
                    Saturday - Thursday:
                  </span>{" "}
                  10:00 AM - 5:00 PM
                </p>
                <p>
                  <span className="font-medium text-gray-900 dark:text-white">
                    Friday:
                  </span>{" "}
                  Closed
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 md:p-8">
            <h2 className="mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
              Send us a Message
            </h2>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
