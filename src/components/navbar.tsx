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

export default function Navbar() {
  const { cartCount } = useCart();
  const { user } = useUser();

  return (
    <nav className="flex w-full flex-row bg-[#ffffff] shadow-lg shadow-stone-400 fixed top-0 justify-between md:justify-center z-50">
      <div className="group items-center align-middle w-1/2">
        <Link
          href={"/"}
          className="flex items-center align-middle space-x-2 font-bold justify-center active:opacity-40 group hover:opacity-70"
        >
          <Image
            src={logo}
            alt={"logo of the business"}
            className="w-10 h-10 "
          />
          <p>Lunga Traders</p>
        </Link>
        <div className="flex justify-center items-center sm:w-full">
          <div className="absolute top-full font-normal bg-white borderp-2 hidden rounded-b-xl group-hover:block space-y-2 justify-center sm:w-[260px]">
            <Link
              href={"/installation/lunga-traders.apk"}
              download
              className="flex items-center align-middle hover:bg-stone-500 p-1 px-3 border-b-gray-300 border rounded-3xl gap-3 shadow-md shadow-black hover:font-bold"
            >
              <FaCloudDownloadAlt size={24} />
              <p>Download APK</p>
            </Link>
          </div>
        </div>
        {user.email && (
          <div className="flex justify-center items-center sm:w-full">
            <div className="absolute top-full font-normal bg-white p-2 hidden rounded-b-xl group-hover:block space-y-2 justify-center sm:w-[260px]">
              <Link
                href={"/installation/lunga-traders.apk"}
                download
                className="flex items-center align-middle hover:bg-stone-500 p-1 px-3 border-b-gray-300 border rounded-3xl gap-3 shadow-md shadow-black hover:font-bold"
              >
                <FaCloudDownloadAlt size={24} />
                <p>Download APK</p>
              </Link>

              <Link
                href={"/manage-my-business"}
                className="flex items-center align-middle hover:bg-stone-500 p-1 px-3 border-b-gray-300 border rounded-3xl gap-3 shadow-md shadow-black hover:font-bold"
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
