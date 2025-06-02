"use client";
import Link from "next/link";
import brief from "../../public/icons/briefcase-fill.svg";
import LoggedUser from "./logged";
import Image from "next/image";
import logo from "../../public/background/lunga-trader.png";
import cartIcon from "../../public/icons/cart-black-icon.png";
import { FaCloudDownloadAlt, FaHome } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { usePathname } from "next/navigation";
import { useInvoiceStore } from "@/stores/useInvoiceStore";
import { Invoice } from "@/data-types/invoice.type";
import { useProductStore } from "@/stores/useProductStore";

export default function Navbar() {
  const pathname = usePathname();

  const { authUser, checkAuth } = useAuthStore();
  const { fetchProducts } = useProductStore();
  const [dropdownVisible, setDropdownVisible] = useState(false); // State to control dropdown visibility
  const dropdownRef = useRef<HTMLDivElement>(null);
  const {
    getUserInvoices,
    allInvoices,
    isUpdatingInvoice,
    isAddingInvoice,
    isGettingUserInvoices,
  } = useInvoiceStore();

  // Calculate the total quantity from all invoice carts
  const cartQuantitySum = allInvoices.reduce((acc, invoice) => {
    const cart = (invoice as Invoice).cart || [];
    return (
      acc +
      (Array.isArray(cart)
        ? cart.reduce((itemAcc, t) => itemAcc + (t.quantity || 0), 0)
        : 0)
    );
  }, 0);

  useEffect(() => {
    if (authUser?._id) {
      getUserInvoices(authUser._id);
    }
  }, [authUser?._id, getUserInvoices, allInvoices.length]);

  useEffect(() => {
    if (authUser?._id) {
      fetchProducts();
    }
  }, [authUser?._id, fetchProducts]);

  useEffect(() => {
    checkAuth();
  }, [
    checkAuth,
    authUser?.person?.profile_image_id,
    isAddingInvoice,
    isUpdatingInvoice,
    isGettingUserInvoices,
  ]);

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

  if (pathname === "/login" || pathname === "/signup") return null;

  return (
    <nav className="flex w-full flex-row backdrop-filter backdrop-grayscale backdrop-blur-sm backdrop-contrast-150 fixed top-0 justify-between md:justify-center z-50 py-1">
      <div
        className=" items-center align-middle w-1/2 relative"
        onClick={() => setDropdownVisible(!dropdownVisible)} // Toggle dropdown visibility on click
        ref={dropdownRef}
      >
        <div className="flex flex-col items-center align-middle space-x-2 z-40 w-full justify-center">
          <button className="flex group items-center align-middle space-x-2 font-bold justify-center active:opacity-40 group hover:opacity-70">
            <Image
              src={logo}
              alt={"logo of the business"}
              className="w-10 h-10"
            />
            <p className=" text-sm">Lunga Traders</p>
          </button>
          <div className="flex justify-center items-center sm:w-full">
            {/* Only show one dropdown: if user is logged in, show the user dropdown, else show the guest dropdown */}
            {authUser?.email ? (
              <div className="flex justify-center items-center sm:w-full">
                <div
                  className={`absolute top-full font-normal shadow-black shadow-lg backdrop-filter backdrop-grayscale backdrop-blur-sm backdrop-contrast-150  p-2 rounded-b-xl space-y-2 justify-center w-[180px] ${
                    dropdownVisible ? "block" : "hidden"
                  }`}
                >
                  <Link
                    href={"/"}
                    className="flex items-center align-middle hover:bg-gradient-to-r from-stone-600 via-stone-500 to-stone-600 bg-white p-1 px-3 border-b-gray-300 border rounded-3xl gap-3 shadow-md shadow-black hover:font-bold"
                    onClick={() => setDropdownVisible(false)}
                  >
                    <FaHome size={24} />
                    <p className=" text-sm">Home</p>
                  </Link>
                  <Link
                    href={"/installation/lunga-traders.apk"}
                    download
                    className="flex items-center align-middle hover:bg-gradient-to-r from-stone-600 via-stone-500 to-stone-600 bg-white p-1 px-3 border-b-gray-300 border rounded-3xl gap-3 shadow-md shadow-black hover:font-bold"
                    onClick={() => setDropdownVisible(false)}
                  >
                    <FaCloudDownloadAlt size={24} />
                    <p className=" text-sm">Download APK</p>
                  </Link>
                  <Link
                    href={"/my-business"}
                    className="flex items-center align-middle hover:bg-gradient-to-r from-stone-600 via-stone-500 to-stone-600 bg-white p-1 px-3 border-b-gray-300 border rounded-3xl gap-3 shadow-md shadow-black hover:font-bold"
                    onClick={() => setDropdownVisible(false)}
                  >
                    <Image
                      src={brief}
                      alt="business logo"
                      className="w-6 h-6"
                    />
                    <p className=" text-sm">My Business</p>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex justify-center items-center sm:w-full">
                <div
                  className={`absolute top-full font-normal  shadow-black shadow-lg p-2 bg-[#ffffff88] rounded-b-xl space-y-2 justify-center ${
                    dropdownVisible ? "block" : "hidden"
                  }`}
                >
                  <Link
                    href={"/"}
                    className="flex items-center align-middle hover:bg-gradient-to-r from-stone-600 via-stone-500 to-stone-600 p-1 px-3  bg-white border-b-gray-300 border rounded-3xl gap-3 shadow-md shadow-black hover:font-bold w-[180px]"
                    onClick={() => setDropdownVisible(false)}
                  >
                    <FaHome size={24} />
                    <p className=" text-sm">Home</p>
                  </Link>
                  <Link
                    href={"/installation/lunga-traders.apk"}
                    download
                    className="flex items-center align-middle hover:bg-gradient-to-r from-stone-600 via-stone-500 to-stone-600 p-1 px-3 bg-white border-b-gray-300 border rounded-3xl gap-3 shadow-md shadow-black hover:font-bold w-[180px]"
                    onClick={() => setDropdownVisible(false)}
                  >
                    <FaCloudDownloadAlt size={24} />
                    <p className=" text-sm">Download APK</p>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {authUser?.email && (
        <Link
          href={"/my-cart"}
          className="relative hover:opacity-70 active:opacity-40 mt-[10px] ml-[-30px] sm:hidden"
        >
          <p className="font-bold text-[16px] absolute mt-[-7px] ml-3 w-full">
            {cartQuantitySum}
          </p>
          <Image src={cartIcon} alt="cart pic" className="w-7 h-7 opacity-80" />
        </Link>
      )}

      <LoggedUser />
    </nav>
  );
}
