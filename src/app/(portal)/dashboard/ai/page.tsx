import Heading from "@/components/portal/heading";
import ChatBotDashBoard from "./(chatbot)/ChatBotDashBoard";

export default function AI() {
  return (
    <>
      <Heading
        headingText="Artificial Intelligence"
        subHeadingText="Configure AI-powered features of the web app."
      />
      <section className="mx-auto">
        <div className="mb-6 grid h-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
          <ChatBotDashBoard />
        </div>
      </section>
    </>
  );
}
