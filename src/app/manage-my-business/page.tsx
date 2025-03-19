"use client";
import { BsFillBoxSeamFill } from "react-icons/bs";
import AllAssets from "./all-assets";
import AddAsset from "./add-assets";
import EditAsset from "./edit-assets";
import { useSelectedMode } from "@/contexts/SelectionModeContext";
import { RiAddCircleFill } from "react-icons/ri";

export default function ManageMyBusiness() {
  const { mode, setMode } = useSelectedMode();
  return (
    <div className="justify-center  align-middle mx-auto flex w-full bg-stone-200 h-screen">
      <div className="w-full max-w-7xl">
        <div className="justify-center items-center align-middle mt-40 mx-auto flex h-10 w-full  max-w-7xl bg-white rounded-full shadow-black shadow-sm">
          <button
            className="items-center align-middle justify-center flex gap-2 hover:bg-stone-300 py-1 w-1/2 h-10 hover:font-bold rounded-l-full active:border active:border-red-800 active:text-red-800"
            onClick={() => setMode("Add Asset")}>
            <RiAddCircleFill className="w-7 h-7 " />
            <p>Add New Asset</p>
          </button>
          <p className="text-2xl">|</p>
          <button
            onClick={() => setMode("All Assets")}
            className="items-center align-middle justify-center flex gap-2 hover:bg-stone-300 py-1 w-1/2 h-10 hover:font-bold  rounded-r-full active:border active:border-red-800 active:text-red-800"
          >
            <BsFillBoxSeamFill className="w-7 h-7" />
            <p >All Assets</p>
          </button>
        </div>
        <div className="items-center align-middle max-w-7xl bg-stone-700 my-10 mx-auto px-4 py-6">
          {mode === "All Assets" && <AllAssets />}
          {mode === "Add Asset" && <AddAsset />}
          {mode === "Edit Asset" && <EditAsset />}
        </div>
      </div>
    </div>
  );
}
