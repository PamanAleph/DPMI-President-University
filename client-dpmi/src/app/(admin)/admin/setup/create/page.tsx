"use client";
import React, { useState } from "react";
import QuestionDetails from "@/components/admin/setup/create/QuestionDetails";
import SectionDetails from "@/components/admin/setup/create/SectionDetails";
import SetupDetails from "@/components/admin/setup/create/SetupDetails";
import { CheckIcon } from "@heroicons/react/24/outline";

const steps = [
  {
    id: "01",
    name: "Create Setup",
    status: "current",
  },
  {
    id: "02",
    name: "Create Sections",
    status: "upcoming",
  },
  {
    id: "03",
    name: "Create Questions",
    status: "upcoming",
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Page() {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <SetupDetails onNext={handleNext}/>;
      case 1:
        return <SectionDetails onNext={handleNext}/>;
      case 2:
        return <QuestionDetails />;
      default:
        return null;
    }
  };

  return (
    <div className="lg:border-b lg:border-t lg:border-gray-200 container">
      <nav
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        aria-label="Progress"
      >
        <ol
          role="list"
          className="overflow-hidden rounded-md lg:flex lg:rounded-none lg:border-l lg:border-r lg:border-gray-200"
        >
          {steps.map((step, stepIdx) => {
            const stepStatus =
              stepIdx < currentStep
                ? "complete"
                : stepIdx === currentStep
                ? "current"
                : "upcoming";
            return (
              <li key={step.id} className="relative overflow-hidden lg:flex-1">
                <div
                  className={classNames(
                    stepIdx === 0 ? "rounded-t-md border-b-0" : "",
                    stepIdx === steps.length - 1
                      ? "rounded-b-md border-t-0"
                      : "",
                    "overflow-hidden border border-gray-200 lg:border-0"
                  )}
                >
                  {stepStatus === "complete" ? (
                    <a href="#" className="group">
                      <span
                        className="absolute left-0 top-0 h-full w-1 bg-transparent group-hover:bg-gray-200 lg:bottom-0 lg:top-auto lg:h-1 lg:w-full"
                        aria-hidden="true"
                      />
                      <span
                        className={classNames(
                          stepIdx !== 0 ? "lg:pl-9" : "",
                          "flex items-start px-6 py-5 text-sm font-medium"
                        )}
                      >
                        <span className="flex-shrink-0">
                          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600">
                            <CheckIcon
                              className="h-6 w-6 text-white"
                              aria-hidden="true"
                            />
                          </span>
                        </span>
                        <span className="ml-4 mt-0.5 flex min-w-0 flex-col">
                          <span className="text-sm font-medium">
                            {step.name}
                          </span>
                        </span>
                      </span>
                    </a>
                  ) : stepStatus === "current" ? (
                    <a href="#" aria-current="step">
                      <span
                        className="absolute left-0 top-0 h-full w-1 bg-indigo-600 lg:bottom-0 lg:top-auto lg:h-1 lg:w-full"
                        aria-hidden="true"
                      />
                      <span
                        className={classNames(
                          stepIdx !== 0 ? "lg:pl-9" : "",
                          "flex items-start px-6 py-5 text-sm font-medium"
                        )}
                      >
                        <span className="flex-shrink-0">
                          <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-indigo-600">
                            <span className="text-indigo-600">{step.id}</span>
                          </span>
                        </span>
                        <span className="ml-4 mt-0.5 flex min-w-0 flex-col">
                          <span className="text-sm font-medium text-indigo-600">
                            {step.name}
                          </span>
                        </span>
                      </span>
                    </a>
                  ) : (
                    <a href="#" className="group">
                      <span
                        className="absolute left-0 top-0 h-full w-1 bg-transparent group-hover:bg-gray-200 lg:bottom-0 lg:top-auto lg:h-1 lg:w-full"
                        aria-hidden="true"
                      />
                      <span
                        className={classNames(
                          stepIdx !== 0 ? "lg:pl-9" : "",
                          "flex items-start px-6 py-5 text-sm font-medium"
                        )}
                      >
                        <span className="flex-shrink-0">
                          <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-300">
                            <span className="text-gray-500">{step.id}</span>
                          </span>
                        </span>
                        <span className="ml-4 mt-0.5 flex min-w-0 flex-col">
                          <span className="text-sm font-medium text-gray-500">
                            {step.name}
                          </span>
                        </span>
                      </span>
                    </a>
                  )}

                  {stepIdx !== 0 ? (
                    <>
                      <div
                        className="absolute inset-0 left-0 top-0 hidden w-3 lg:block"
                        aria-hidden="true"
                      >
                        <svg
                          className="h-full w-full text-gray-300"
                          viewBox="0 0 12 82"
                          fill="none"
                          preserveAspectRatio="none"
                        >
                          <path
                            d="M0.5 0V31L10.5 41L0.5 51V82"
                            stroke="currentcolor"
                            vectorEffect="non-scaling-stroke"
                          />
                        </svg>
                      </div>
                    </>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>
      </nav>
      <div className="my-8">{renderStepContent()}</div>
    </div>
  );
}
