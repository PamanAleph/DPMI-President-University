import CardGreetings from "@/components/CardGreetings";
import CardForm from "@/components/form/FormCard";
import React from "react";
import { greetings } from "@/app/lib/data";
import Image from "next/image";
import PULOGO from "@/assets/pu_logo.jpg";

export default function page() {
  return (
    <section className="flex flex-col max-w-3xl justify-center items-center mx-auto gap-4 px-4 sm:px-0">
      <div className=" justify-center items-center ">
        <Image
          src={PULOGO}
          alt="President University Logo"
          width={1920}
          height={1080}
          className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl h-auto"
        />
      </div>
      {greetings.description && <CardGreetings />}
      <CardForm />
    </section>
  );
}
