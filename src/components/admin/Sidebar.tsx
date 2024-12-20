"use client";
import {
  CalendarIcon,
  HomeIcon,
  UsersIcon,
  NewspaperIcon,
} from "@heroicons/react/24/outline";
import React from "react";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import Link from "next/link";


function classNames(...classes: unknown[]) {
  return classes.filter(Boolean).join(" ");
}

const Sidebar = () => {
  const currentPath = usePathname();
  const navigation = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: HomeIcon,
    },
    {
      name: "Setup",
      href: "/admin/setup",
      icon: CalendarIcon,
    },
    {
      name: "Response",
      href: "/admin/response",
      icon: NewspaperIcon,
    },
    {
      name: "Evaluations",
      href: "/admin/evaluations",
      icon: UsersIcon,
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: UsersIcon,
    },
  ];
  return (
    <nav className="flex flex-1 flex-col overflow-hidden">
      <ul role="list" className="flex flex-1 flex-col gap-y-7">
        <li>
          <ul role="list" className="-mx-2 space-y-1">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={classNames(
                    currentPath === item.href
                      ? "bg-gray-800 text-white"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white",
                    "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                  )}
                >
                  <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </li>
        <li className="mt-auto">
          <Link
            href="/admin/settings"
            className={classNames(
              usePathname() === "/admin/settings"
                ? "bg-gray-800 text-white"
                : "text-gray-400 hover:bg-gray-800 hover:text-white",
              "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
            )}
          >
            <Cog6ToothIcon className="h-6 w-6 shrink-0" aria-hidden="true" />
            Settings
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
