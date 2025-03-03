import PageHeader from "@/components/page-header";
import PolicyContainer from "@/components/privacy-policy/policy-container";

const privacyPolicy = [
  {
    title: "Introduction",
    description:
      "Welcome to BUCC's Privacy Policy page. Your privacy is important to us. This policy explains how we collect, use, and protect your personal information when you visit our website or use our services.",
  },
  {
    title: "Information We Collect",
    description:
      "We collect various types of information in order to provide you with the best possible experience. This includes personal information such as your name, email address, phone number, and any other details you voluntarily provide when you register on our site, subscribe to our newsletter, or fill out a form. Additionally, we automatically collect information about your interaction with our website, including your IP address, browser type, pages visited, time spent on the site, and other analytical data. We also use cookies and similar tracking technologies to enhance your experience, gather general visitor information, and track visits to our website.",
  },
  {
    title: "How We Use Your Information",
    description:
      "The information we collect is used to improve our website, personalize your experience, process transactions, and send periodic emails. Your feedback and information help us respond to your individual needs and continually strive to enhance our offerings. Your personal information, whether public or private, will not be sold, exchanged, transferred, or given to any other company without your consent, except for the express purpose of delivering the purchased product or service requested. The email address you provide may be used to send you information, respond to inquiries, and address other requests or questions.",
  },
  {
    title: "Protection of Your Information",
    description:
      "We implement a variety of security measures to maintain the safety of your personal information. These measures include password-protected directories and databases to safeguard your information, SSL (Secure Sockets Layered) technology to ensure that your information is fully encrypted and sent across the Internet securely, and regular security audits.",
  },
  {
    title: "Your Consent",
    description:
      "By using our website, you consent to our Privacy Policy. We may update our Privacy Policy from time to time, and any changes will be posted on this page with the date updated accordingly. We encourage you to review this Privacy Policy periodically to stay informed about how we are protecting your information.",
  },
  {
    title: "Contact Us",
    description:
      "If you have any questions about our Privacy Policy, please contact us at  info@bracucc.org , +8801756020067, or  Kha 226, Bir Uttam Rafiqul Islam Ave, Badda, Dhaka 1212 . Thank you for trusting BUCC with your personal information. We are committed to keeping it secure and respecting your privacy.",
  },
];

const PrivacyPolicyPage = () => {
  return (
    <div>
      <PageHeader
        title="Privacy Policy"
        description="Privacy Policies for BUCC Website"
      />
      <section className="p-5 md:p-10">
        <p className="text-xl font-semibold md:text-2xl">
          Last Updated: 15th July, 2024
        </p>
        <p className="mb-5 mt-3 text-sm text-muted-foreground">
          Welcome to BUCC&apos;s Privacy Policy page. Your privacy is important
          to us. This policy explains how we collect, use, and protect your
          personal information when you visit our website or use our services.
        </p>
        {privacyPolicy?.map((v, i) => <PolicyContainer key={i} {...v} />)}
      </section>
    </div>
  );
};

export default PrivacyPolicyPage;
