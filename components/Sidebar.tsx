"use client";
import {
  HomeIcon,
  HashtagIcon,
  BellIcon,
  InboxIcon,
  BookmarkIcon,
  UserIcon,
  EllipsisHorizontalCircleIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import SidebarUserInfo from "./SidebarUserInfo";
import Link from "next/link";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/redux/store";
import {openLogoutModal} from "@/redux/slices/modalSlice";

export default function Sidebar() {
  const dispatch: AppDispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);

  return (
    <nav className="max-h-screen sm:flex flex-col sticky top-0 p-3 xl:ml-20 xl:mr-10">
      <div className="relative h-full flex flex-col items-center xl:items-start">
        <div className="py-3">
          <Link href="/">
            <Image src={"/assets/logo.png"} width={48} height={48} alt="logo" />
          </Link>
        </div>
        <ul className="flex flex-col items-center xl:items-start">
          <Link href="/">
            <SidebarLink Icon={HomeIcon} text="Home" />
          </Link>
          <SidebarLink Icon={HashtagIcon} text="Explore" />
          <SidebarLink Icon={BellIcon} text="Notifications" />
          <SidebarLink Icon={InboxIcon} text="Messages" />
          <SidebarLink Icon={BookmarkIcon} text="Bookmarks" />
          <SidebarLink Icon={UserIcon} text="Profile" />
          {user?.name && (
            <li
              className="flex items-center text-xl mb-2 space-x-3 p-2.5 cursor-pointer"
              onClick={() => {
                dispatch(openLogoutModal());
              }}
            >
              <LockClosedIcon className="h-7 hover:text-pink-700 transition-all duration-300" />
              <span className="hidden xl:block">Logout</span>
            </li>
          )}
          <SidebarLink Icon={EllipsisHorizontalCircleIcon} text="More" />

          <SidebarUserInfo />
        </ul>
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
