"use client";
import React from "react";
import {
  HomeIcon,
  HashtagIcon,
  BellIcon,
  InboxIcon,
  BookmarkIcon,
  UserIcon,
  EllipsisHorizontalCircleIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import SidebarUserInfo from "./SidebarUserInfo";
import Link from "next/link";

export default function Sidebar() {
  return (
    <nav className="max-h-screen sm:flex flex-col sticky top-0 p-3 xl:ml-20 xl:mr-10">
      <div className="relative h-full flex flex-col items-center xl:items-start">
        <div className="py-3">
          <Link href="/">
            <Image src={"/assets/logo.png"} width={48} height={48} alt="logo" />
          </Link>
        </div>
        <ul>
          <SidebarLink Icon={HomeIcon} text="Home" />
          <SidebarLink Icon={HashtagIcon} text="Explore" />
          <SidebarLink Icon={BellIcon} text="Notifications" />
          <SidebarLink Icon={InboxIcon} text="Messages" />
          <SidebarLink Icon={BookmarkIcon} text="Bookmarks" />
          <SidebarLink Icon={UserIcon} text="Profile" />
          <SidebarLink Icon={EllipsisHorizontalCircleIcon} text="More" />
        </ul>
        <SidebarUserInfo />
      </div>
    </nav>
  );
}

interface SidebarLinkProps {
  text: string;
  Icon: React.ForwardRefExoticComponent<
    Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
      title?: string | undefined;
      titleId?: string | undefined;
    } & React.RefAttributes<SVGSVGElement>
  >;
}

function SidebarLink({text, Icon}: SidebarLinkProps) {
  return (
    <li className="flex items-center text-xl mb-2 space-x-3 p-2.5 cursor-pointer">
      <Icon className="h-7 hover:text-pink-700 transition-all duration-300" />
      <span className="hidden xl:block">{text}</span>
    </li>
  );
}
