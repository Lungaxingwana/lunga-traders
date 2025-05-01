"use client";
import Image from "next/image";
import { useState } from "react";
import { ImSpinner9 } from "react-icons/im";
import Link from "next/link";
import { toast, Toaster } from "sonner";
import { FcDataRecovery } from "react-icons/fc";
import avatar from "../../../../public/icons/avatar-white-icon.png";

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  async function handleLogin() {
    setIsLoading(true);
    try {
      toast.success("Successfull in login in");
    } catch (error) {
      toast.error("Failed to login", error || "");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full mx-auto justify-center align-middle flex flex-1 mt-10 pt-10 bg-stone-200 min-h-screen">
      <div className="justify-center items-center align-middle w-96 h-[620] bg-white border border-stone-500 rounded-xl shadow-stone-500 shadow-lg space-y-2">
        <div className="bg-stone-500 mx-10 rounded-b-full">
          <p className="w-full text-center">Forgot Password Screen</p>
        </div>
        <div className="w-full px-4">
          <div className="w-full h-80 flex justify-center align-middle items-center mt-5 rounded-xl border border-stone-500">
            <Image
              alt="pic of the campany"
              src={"/background/lunga-trader.png"}
              width={300}
              height={300}
              objectFit="contain"
            />
          </div>
        </div>
        <p className="px-16 text-stone-500 text-center">
          Please enter your <span className="font-bold">email address</span> to
          get your lost password
        </p>
        <div className="w-full  justify-center flex mt-6 p-4 align-middle items-center">
          <div className="bg-stone-700 flex rounded-full shadow-black shadow-md w-full h-10">
            <div className="w-2/12 h-full justify-end items-center align-middle flex p-2">
              <Image
                src={avatar}
                alt={"logo of the business"}
                className=" h-8 self-center w-8"
              />
            </div>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="outline-none p-3 text-white w-9/12 bg-transparent"
              placeholder="Enter username here"
            />
          </div>
        </div>

        <div className="w-full justify-evenly items-center align-middle flex">
          <div className="flex justify-evenly w-full items-center align-middle">
            <div className="w-5/12 mx-auto justify-center flex mt-6 p-4">
              <Link
                href={"/login"}
                className=" p-2 hover:underline active:opacity-40"
              >
                Back
              </Link>
            </div>
            <div className="w-7/12 mx-auto justify-center flex mt-6 p-2">
              <Toaster richColors position="top-center" />
              <button
                onClick={handleLogin}
                className="p-2 hover:bg-stone-400 font-bold bg-gradient-to-r from-stone-700 via-stone-500 to-stone-700 shadow-xl shadow-black active:opacity-40 w-full justify-center items-center align-middle rounded-full"
              >
                {isLoading ? (
                  <div className="flex gap-3">
                    <ImSpinner9 size={23} className="animate-spin" />
                    <p>Loading...</p>
                  </div>
                ) : (
                  <div className="flex gap-x-2 items-center align-middle justify-center">
                    <FcDataRecovery size={24} />
                    <p>Recover Password</p>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
