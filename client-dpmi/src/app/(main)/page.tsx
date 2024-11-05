import { BackgroundBeams } from "@/components/ui/background-beams";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import { projects } from "@/utils/staticData";

export default function page() {
  return (
    <section>
      <div className="h-[100vh] w-full rounded-md bg-gray-900 relative flex flex-col items-center justify-center antialiased">
        <div className="max-w-2xl mx-auto p-4">
          <h1 className="relative z-10 text-lg md:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 text-center font-sans font-bold">
            Join the waitlist
          </h1>
          <p className="text-neutral-500 max-w-lg mx-auto my-2 text-sm text-center relative z-10">
            Welcome to MailJet, the best transactional email service on the web.
            We provide reliable, scalable, and customizable email solutions for
            your business. Whether you&apos;re sending order confirmations,
            password reset emails, or promotional campaigns, MailJet has got you
            covered.a
          </p>
        </div>
        <BackgroundBeams className="bg-gray-100" />
      </div>

      <div className="container">
        <HoverEffect items={projects} />
      </div>
    </section>
  );
}
