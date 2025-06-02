"use client";
import "swiper/css";
import { motion } from "framer-motion";
import { FaShoppingBag } from "react-icons/fa";
import { useState, useRef } from "react";
import { useProductStore } from "@/stores/useProductStore";
import { ProductInput } from "@/data-types/product.type";
import Step1Product from "@/components/AddProductsSteps/step1";
import Step2Product from "@/components/AddProductsSteps/step2";
import Step3Product from "@/components/AddProductsSteps/step3";
import { useRouter } from "next/navigation";

export default function AddProduct() {
  const { isCreatingProduct } = useProductStore();
  const router = useRouter();
  const [product, setProduct] = useState<ProductInput>({
    general: {
      make: "",
      model: "",
      year: new Date().getFullYear(),
      category: "",
      sub_category: "",
      tags: "",
      description: "",
    },
    appearance: {
      color: "",
      size: "",
      images_src: [],
      images_src_id: [],
    },
    pricing: {
      original_price: 0,
      sale_price: 0,
      purchase_quantity: 0,
      stock_quantity: 0,
    },
    reviews: [],
  });

  const step1ValidateRef = useRef<() => boolean>(() => true);
  const step2ValidateRef = useRef<() => boolean>(() => true);
  const step3ValidateRef = useRef<() => boolean>(() => true);

  async function handleUpdateProduct(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    // Only execute add product if all validations pass
    if (
      (step1ValidateRef.current && step1ValidateRef.current()) &&
      (step2ValidateRef.current && step2ValidateRef.current()) &&
      (step3ValidateRef.current && step3ValidateRef.current())
    ) {
      const prod = product;
      if (!prod) return;

      const formData = new FormData();
      formData.append("make", prod.general?.make || "");
      formData.append("model", prod.general?.model || "");
      formData.append("year", prod.general?.year?.toString() || "");
      formData.append("category", prod.general?.category || "");
      formData.append("sub_category", prod.general?.sub_category || "");
      formData.append("tags", prod.general?.tags || "");
      formData.append("description", prod.general?.description || "");
      formData.append("color", prod.appearance?.color || "");
      formData.append("size", prod.appearance?.size || "");
      formData.append(
        "original_price",
        prod.pricing?.original_price?.toString() || ""
      );
      formData.append("sale_price", prod.pricing?.sale_price?.toString() || "");
      formData.append(
        "purchase_quantity",
        prod.pricing?.purchase_quantity?.toString() || ""
      );
      formData.append(
        "stock_quantity",
        prod.pricing?.stock_quantity?.toString() || ""
      );
      if (prod.appearance?.images_src) {
        prod.appearance.images_src.forEach((image: File) => {
          formData.append("images_src", image);
        });
      }
      const res = await useProductStore.getState().createProduct(formData);
      if (res) {
        router.push("/my-business");
      }
    }
    // else do nothing (validation failed)
  }

  return (
    <motion.div
      className="min-h-screen items-center px-4 bg-gradient-to-br from-stone-400 via-stone-100 to-stone-300 py-10 flex flex-col"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 0 }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
    >
      <h1 className="text-2xl font-bold mb-4 text-gray-800 mt-10 text-center">
        Add Product
      </h1>
      <div className="flex flex-wrap items-center justify-center w-full max-w-7xl mx-auto gap-4">
        <div className="flex flex-wrap justify-center w-full max-w-7xl mx-auto gap-4">
          <Step1Product
            product={product}
            setProduct={setProduct}
            setValidate={(fn: () => boolean) => { step1ValidateRef.current = fn; }}
          />
          <Step2Product
            product={product}
            setProduct={setProduct}
            setValidate={(fn: () => boolean) => { step2ValidateRef.current = fn; }}
          />
          <Step3Product
            product={product}
            setProduct={setProduct}
            setValidate={(fn: () => boolean) => { step3ValidateRef.current = fn; }}
          />
        </div>

        <div className="w-full">
          <button
            onClick={handleUpdateProduct}
            className="flex flex-col bg-gradient-to-r shadow-lg shadow-black from-stone-700 to-stone-400 p-2 text-white items-center justify-center align-middle rounded-full w-full hover:opacity-70 active:opacity-40 "
          >
            {isCreatingProduct ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                Adding Product...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2 align-middle">
                <FaShoppingBag size={20} />
                Add Product
              </span>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
