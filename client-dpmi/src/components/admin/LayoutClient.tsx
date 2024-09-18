"use client";
import Sidebar from "@/components/admin/Sidebar";
import { useAdminDashboardContext } from "@/context/AdminDashboardContext";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import Image from "next/image";
import React, { Fragment, useEffect, useState } from "react";
import PULOGO from "@/assets/pu_logo.jpg";

interface NavigationItem {
  name: string;
  href: string;
  icon: any;
  // icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
}

interface Team {
  name: string;
  href: string;
  current: boolean;
  initial: string;
}

interface LayoutClientDashboardProps {
  teams: Team[];
}

export default function LayoutClientDashboard({
  teams,
}: LayoutClientDashboardProps) {
  const dashboardContext = useAdminDashboardContext();
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    //TODO: Rather than using window.innerWidth, use the event listener to detect the window size so if user resize the screen, the sidebar will be hidden
    const width = window.innerWidth;
    if (width < 1024) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }, []);
  return (
    isMobile && (
      <Transition show={dashboardContext.sidebar} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 lg:hidden"
          onClose={() => dashboardContext.toggleSidebar()}
        >
          <TransitionChild
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </TransitionChild>

          <div className="fixed inset-0 flex">
            <TransitionChild
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <DialogPanel className="relative mr-16 flex w-full max-w-xs flex-1">
                <TransitionChild
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button
                      type="button"
                      className="-m-2.5 p-2.5"
                      onClick={() => dashboardContext.toggleSidebar(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18 18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </TransitionChild>
                {/* Sidebar component, swap this element with another sidebar if you like */}
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4 ring-1 ring-white/10">
                  <div className="flex h-24 shrink-0 items-center justify-center">
                    <Image
                      className="h-16 w-auto"
                      src={PULOGO}
                      width={200}
                      height={200}
                      alt="Your Company"
                    />
                  </div>
                  <Sidebar teams={teams} />
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>
    )
  );
}
