"use client"; // Ensure this at the top

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import pic from "../../public/icons/avatar-icon.png";
import Link from "next/link";
import cartIcon from "../../public/icons/cart-black-icon.png";
import { IoLogIn, IoLogOut } from "react-icons/io5";
import { ImProfile } from "react-icons/im";
import { useUser } from "@/contexts/UserContext";
import { useCart } from "@/contexts/CartContext";

export default function LoggedUser() {
  const { user } = useUser();
  const { cartCount } = useCart();
  const [innerWidth, setInnerWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 410
  );
  const [dropdownVisible, setDropdownVisible] = useState(false); // State to control dropdown visibility
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleResize() {
      setInnerWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
        className="relative flex items-center align-middle space-x-2 group z-40"
        onClick={() => setDropdownVisible(!dropdownVisible)} // Toggle dropdown visibility on click
        ref={dropdownRef}
      >
        <div className="hover:opacity-70">
          {user.email ? (
            <p className="text-[12px] font-bold text-right">
              Welcome {user.person.first_name}
            </p>
          ) : (
            <p className="font-bold text-right">Login / Sign Up</p>
          )}
          <p className="text-[12px] sm:text-xs font-normal">{user.email}</p>
        </div>
        <Image
          src={user.person.profile_picture || pic}
          alt={"pic"}
          className="rounded-full sm:w-10 sm:h-10 z"
          width={innerWidth > 410 ? 40 : 40}
          height={innerWidth > 410 ? 40 : 40}
        />
        <div
          className={`absolute top-full right-0 font-normal shadow-black shadow-lg p-2 rounded-b-xl bg-white self-center justify-self-center space-y-2 ${
            dropdownVisible ? "block" : "hidden"
          }`}
        >
          {user.email ? (
            <div className="space-y-2">
              <Link
                className="flex gap-2 items-center align-middle border-b-gray-300 border rounded-3xl hover:bg-stone-500  px-3 shadow-md shadow-black font-bold"
                href={"/profile"}
                onClick={() => setDropdownVisible(false)} // Hide dropdown on click
              >
                <ImProfile size={30} />
                <p className="w-full">My Profile</p>
              </Link>
              <Link
                className="flex gap-2 items-center align-middle border-b-gray-300 border rounded-3xl hover:bg-stone-500  px-3 shadow-md shadow-black font-bold"
                href={"/logout"}
                onClick={() => setDropdownVisible(false)} // Hide dropdown on click
              >
                <IoLogOut size={30} />
                <p className="w-full">Logout</p>
              </Link>
            </div>
          ) : (
            <Link
              className="flex gap-2 items-center align-middle border-b-gray-300 border rounded-3xl hover:bg-stone-500  px-3 shadow-md shadow-black hover:font-bold"
              href={"/login"}
              onClick={() => setDropdownVisible(false)} // Hide dropdown on click
            >
              <IoLogIn size={30} />
              <p className="w-full">Login</p>
            </Link>
          )}
        </div>
      </div>
      {user.email && (
        <Link
          href={"/my-cart"}
          className="relative hover:opacity-70 active:opacity-40 hidden sm:block"
        >
          <p className="font-bold text-[20px] absolute mt-[-8px] ml-[14px] w-full">
            {cartCount}
          </p>
          <Image src={cartIcon} alt="cart pic" className="w-8 h-8 " />
        </Link>
      )}
    </div>
  );
}