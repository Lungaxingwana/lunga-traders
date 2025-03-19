"use client";
import React, { createContext, useState, useContext, ReactNode } from "react";

interface SelectedModeContextProps {
  mode: string;
  setMode: React.Dispatch<
    React.SetStateAction<
      "All Assets" | "Add Asset" | "Edit Asset" 
    >
  >;
  selectedMode: "Customer" | "Expert";
  setSelectedMode: React.Dispatch<React.SetStateAction<"Customer" | "Expert">>;
  selectedProductId: string;
  setSelectedProductId: React.Dispatch<React.SetStateAction<string>>;
  productId: string;
  setProductId: React.Dispatch<React.SetStateAction<string>>;
  edit_id: string;
  setEdit_id: React.Dispatch<React.SetStateAction<string>>;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  selectedPersonId: string;
  setSelectedPersonId: React.Dispatch<React.SetStateAction<string>>;
  selectedVehicleId: string;
  setSelectedVehicleId: React.Dispatch<React.SetStateAction<string>>;
  openProfile: boolean;
  setOpenProfile: React.Dispatch<React.SetStateAction<boolean>>;
  openMain: boolean;
  setOpenMain: React.Dispatch<React.SetStateAction<boolean>>;
  showProfile: boolean;
  setShowProfile: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SelectedModeContext = createContext<SelectedModeContextProps | undefined>(
  {
    mode: "All Assets",
    setMode: () => {},
    selectedMode: "Customer",
    setSelectedMode: () => {},
    edit_id: "",
    setEdit_id: () => {},
    search: "",
    setSearch: () => {},
    productId: "",
    setProductId: () => {},
    selectedProductId: "",
    setSelectedProductId: () => {},
    selectedPersonId: "",
    setSelectedPersonId: () => {},
    selectedVehicleId: "",
    setSelectedVehicleId: () => {},
    openProfile: false,
    setOpenProfile: () => {},
    openMain: false,
    setOpenMain: () => {},
    showProfile: false,
    setShowProfile: () => {},
  }
);

export const SelectedModeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [mode, setMode] = useState<
    "All Assets" | "Add Asset" | "Edit Asset" 
  >("All Assets");
  const [selectedMode, setSelectedMode] = useState<"Customer" | "Expert">(
    "Customer"
  );
  const [edit_id, setEdit_id] = useState("");
  const [search, setSearch] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [productId, setProductId] = useState("");
  const [selectedPersonId, setSelectedPersonId] = useState("");
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [openProfile, setOpenProfile] = useState(false);
  const [openMain, setOpenMain] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  return (
    <SelectedModeContext.Provider
      value={{
        selectedMode,
        setSelectedMode,
        mode,
        setMode,
        productId,
        setProductId,
        selectedPersonId,
        setSelectedPersonId,
        selectedVehicleId,
        setSelectedVehicleId,
        openProfile,
        setOpenProfile,
        openMain,
        setOpenMain,
        showProfile,
        setShowProfile,
        edit_id,
        setEdit_id,
        search,
        setSearch,
        selectedProductId,
        setSelectedProductId,
      }}
    >
      {children}
    </SelectedModeContext.Provider>
  );
};

export const useSelectedMode = (): SelectedModeContextProps => {
    const context = useContext(SelectedModeContext);
    if (!context) {
      throw new Error(
        "useSelectedMode must be used within a SelectedModeProvider"
      );
    }
    return context;
  };
