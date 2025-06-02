
import { create } from "zustand";
import type { Product } from "../data-types/product.type";


interface SelectedModeState {
  profile_picture?: File| null;
  mode: "All Assets" | "Add Asset" | "Edit Asset";
  productStep: "Step 1" | "Step 2" | "Step 3";
  search: string;
  selectedProduct: Product | null;
}

export const useSelectedModeStore = create<SelectedModeState>()(
  (): SelectedModeState => ({
    profile_picture: null,
    mode: "All Assets",
    search: "",
    selectedProduct: null,
    productStep: "Step 1",
  })
);