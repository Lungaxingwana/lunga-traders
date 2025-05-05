"use client";
import Link from "next/link";
import brief from "../../public/icons/briefcase-fill.svg";
import LoggedUser from "./logged";
import Image from "next/image";
import logo from "../../public/background/lunga-trader.png"; // Adjust the path to your
import cartIcon from "../../public/icons/cart-black-icon.png";
import { FaCloudDownloadAlt } from "react-icons/fa";
import { useUser } from "@/contexts/UserContext";
import { useCart } from "@/contexts/CartContext";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const { cartCount } = useCart();
  const { user } = useUser();
  const [dropdownVisible, setDropdownVisible] = useState(false); // State to control dropdown visibility
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownVisible(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <nav className="flex w-full flex-row backdrop-filter backdrop-grayscale backdrop-blur-sm backdrop-contrast-150 bg-[#FFFF1] shadow-lg shadow-stone-400 fixed top-0 justify-between md:justify-center z-50">
      <div
        className="group items-center align-middle w-1/2 relative"
        onClick={() => setDropdownVisible(!dropdownVisible)} // Toggle dropdown visibility on click
        ref={dropdownRef}
      >
        <Link
          href={"/"}
          className="flex items-center align-middle space-x-2 font-bold justify-center active:opacity-40 group hover:opacity-70"
        >
          <Image
            src={logo}
            alt={"logo of the business"}
            className="w-10 h-10"
          />
          <p>Lunga Traders</p>
        </Link>
        <div className="flex justify-center items-center sm:w-full">
          <div
            className={`absolute top-full font-normal  shadow-black shadow-lg p-2 rounded-b-xl space-y-2 justify-center ${
              dropdownVisible ? "block" : "hidden"
            }`}
          >
            <Link
              href={"/installation/lunga-traders.apk"}
              download
              className="flex items-center align-middle hover:bg-stone-500 p-1 px-3 border-b-gray-300 border rounded-3xl gap-3 shadow-md shadow-black hover:font-bold"
              onClick={() => setDropdownVisible(false)} // Hide dropdown on click
            >
              <FaCloudDownloadAlt size={24} />
              <p>Download APK</p>
            </Link>
          </div>
        </div>
        {user.email && (
          <div className="flex justify-center items-center sm:w-full">
            <div
              className={`absolute top-full font-normal shadow-black shadow-lg backdrop-filter backdrop-grayscale backdrop-blur-sm backdrop-contrast-150 bg-[#FFFF1] p-2 rounded-b-xl space-y-2 justify-center sm:w-[260px] ${
                dropdownVisible ? "block" : "hidden"
              }`}
            >
              <Link
                href={"/installation/lunga-traders.apk"}
                download
                className="flex items-center align-middle hover:bg-stone-500 p-1 px-3 border-b-gray-300 border rounded-3xl gap-3 shadow-md shadow-black hover:font-bold"
                onClick={() => setDropdownVisible(false)} // Hide dropdown on click
              >
                <FaCloudDownloadAlt size={24} />
                <p>Download APK</p>
              </Link>

              <Link
                href={"/manage-my-business"}
                className="flex items-center align-middle hover:bg-stone-500 p-1 px-3 border-b-gray-300 border rounded-3xl gap-3 shadow-md shadow-black hover:font-bold"
                onClick={() => setDropdownVisible(false)} // Hide dropdown on click
              >
                <Image src={brief} alt="business logo" className="w-6 h-6" />
                <p>Manage My Business</p>
              </Link>
            </div>
          </div>
        )}
      </div>
      {user.email && (
        <Link
          href={"/my-cart"}
          className="relative hover:opacity-70 active:opacity-40 mt-[15] sm:hidden"
        >
          <p className="font-bold text-[16px] absolute mt-[-7px] ml-4 w-full">
            {cartCount}
          </p>
          <Image src={cartIcon} alt="cart pic" className="w-7 h-7 opacity-80" />
        </Link>
      )}

      <LoggedUser />
    </nav>
  );
}
