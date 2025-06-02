"use client"; // Ensure this at the top

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import pic from "../../public/icons/avatar-icon.png";
import Link from "next/link";
import cartIcon from "../../public/icons/cart-black-icon.png";
import { IoLogIn, IoLogOut } from "react-icons/io5";
import { ImProfile } from "react-icons/im";
import { useAuthStore } from "@/stores/useAuthStore";
import { useSelectedModeStore } from "@/stores/useSelectedModeStore";
import { useInvoiceStore } from "@/stores/useInvoiceStore";
import { Invoice } from "@/data-types/invoice.type";

export default function LoggedUser() {
  const { authUser, logout } = useAuthStore();
  const [innerWidth, setInnerWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 410
  );
  const [dropdownVisible, setDropdownVisible] = useState(false); // State to control dropdown visibility
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [profilePicture, setProfilePicture] = useState<string | File>(typeof pic === "string" ? pic : pic.src);
  const { allInvoices } = useInvoiceStore();

  const cartQuantitySum = allInvoices.reduce((acc, invoice) => {
        const cart = (invoice as Invoice).cart || [];
        return acc + (Array.isArray(cart) ? cart.reduce((itemAcc, t) => itemAcc + (t.quantity || 0), 0) : 0);
      }, 0);
      
  useEffect(() => {
    function handleResize() {
      setInnerWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!authUser) return;
    async function fetchProfileImage() {
      if (authUser?.person?.profile_image_id) {
        try {
          const res = await fetch(
            (process.env.NODE_ENV === "development"
              ? "http://localhost:5002/api"
              : "/api") +
              `/images/get-image/${authUser.person.profile_image_id}`,
            {
              method: "GET",
              credentials: "include",
            }
          );
          if (res.ok) {
            const blob = await res.blob();
            const file = new File([blob], "profile_image.jpg", { type: blob.type });
            setProfilePicture(URL.createObjectURL(file));
            useSelectedModeStore.setState({
              profile_picture: file,
            });
          } else {
            setProfilePicture(typeof pic === "string" ? pic : pic.src);
          }
        } catch {
          setProfilePicture(typeof pic === "string" ? pic : pic.src);
        }
      } else {
        setProfilePicture(typeof pic === "string" ? pic : pic.src);
      }
    }
    fetchProfileImage();
  }, [authUser, authUser?.person?.profile_image_id]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownVisible(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="relative flex items-center align-middle space-x-2 sm:w-7/12 justify-center gap-10">
      <div
        className="relative flex items-center align-middle space-x-2  group z-40"
        onClick={() => setDropdownVisible(!dropdownVisible)}
        ref={dropdownRef}
      >
        <div className="hover:opacity-70">
          {authUser?.email ? (
            <p className="text-[12px] font-bold text-right">
              Welcome {authUser?.person.first_name}
            </p>
          ) : (
            <p className="font-bold text-right">Login</p>
          )}
          <p className="text-[9px] sm:text-xs font-normal">{authUser?.email}</p>
        </div>
        {typeof profilePicture === "string" ? (
          <Image
            src={profilePicture}
            alt="User profile picture"
            className="rounded-full sm:w-10 sm:h-10 z"
            width={innerWidth > 410 ? 40 : 40}
            height={innerWidth > 410 ? 40 : 40}
            unoptimized // Use this if the image is a blob or external URL
          />
        ) : (
          <Image
            src={pic}
            alt="User profile picture"
            className="rounded-full sm:w-10 sm:h-10 z"
            width={innerWidth > 410 ? 40 : 40}
            height={innerWidth > 410 ? 40 : 40}
          />
        )}
        <div
          className={`absolute top-full  right-0 font-normal shadow-black shadow-lg p-2 rounded-b-xl backdrop-filter backdrop-grayscale backdrop-blur-sm backdrop-contrast-150  self-center justify-self-center space-y-2 ${
            dropdownVisible ? "block" : "hidden"
          }`}
        >
          {authUser?.email ? (
            <div className="space-y-2 ">
              <Link
                className="flex gap-2 items-center align-middle border-b-gray-300 border rounded-3xl bg-white hover:bg-gradient-to-r from-stone-600 via-stone-500 to-stone-600  px-3 shadow-md shadow-black font-bold"
                href={"/profile"}
                onClick={() => setDropdownVisible(false)} // Hide dropdown on click
              >
                <ImProfile size={30} />
                <p className="w-full text-sm">My Profile</p>
              </Link>
              <Link
                className="flex gap-2 items-center align-middle border-b-gray-300 border rounded-3xl bg-white hover:bg-gradient-to-r from-stone-600 via-stone-500 to-stone-600 px-3 shadow-md shadow-black font-bold"
                href={"/login"}
                onClick={() => {logout();setDropdownVisible(false)}} // Hide dropdown on click
              >
                <IoLogOut size={30} />
                <p className="w-full text-sm">Logout</p>
              </Link>
            </div>
          ) : (
            <Link
              className="flex gap-2 items-center align-middle border-b-gray-300 border rounded-3xl bg-white hover:bg-gradient-to-r from-stone-600 via-stone-500 to-stone-600 px-3 shadow-md shadow-black hover:font-bold w-[110px]"
              href={"/login"}
              onClick={() => setDropdownVisible(false)} // Hide dropdown on click
            >
              <IoLogIn size={30} />
              <p className="w-full  text-sm">Login</p>
            </Link>
          )}
        </div>
      </div>
      {authUser?.email && (
        <Link
          href={"/my-cart"}
          className="relative hover:opacity-70 active:opacity-40 hidden sm:block"
        >
          <p className="font-bold text-[20px] absolute mt-[-8px] ml-[14px] w-full">
            {cartQuantitySum}
          </p>
          <Image src={cartIcon} alt="cart pic" className="w-8 h-8 " />
        </Link>
      )}
    </div>
  );
}