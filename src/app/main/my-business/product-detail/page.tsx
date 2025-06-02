"use client";
import "swiper/css";
import { motion } from "framer-motion";
import Step1Product from "@/components/EditProductsSteps/step1";
import Step2Product from "@/components/EditProductsSteps/step2";
import Step3Product from "@/components/EditProductsSteps/step3";
import { FaShoppingBag } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useProductStore } from "@/stores/useProductStore";
import { useSelectedModeStore } from "@/stores/useSelectedModeStore";
import { Product } from "@/data-types/product.type";

export default function ProductDetail() {
  const { isUpdatingProduct, allProducts } = useProductStore();
  const [product, setProduct] = useState<Product>();

  useEffect(() => {
    // Extract length to a variable to avoid complex expression in dependency array
    const products = allProducts ?? [];
    const productsLength = products.length;

    // Get selectedProductId from localStorage
    const selectedProductId =
      typeof window !== "undefined"
        ? localStorage.getItem("SelectedProductId")
        : null;
    let foundProduct: Product | undefined = undefined;
    if (selectedProductId && productsLength) {
      foundProduct = products.find((p) => p._id === selectedProductId);
    }
    let prod = foundProduct;
    if (!prod) {
      // fallback to Zustand store if not found in localStorage
      prod = useSelectedModeStore.getState().selectedProduct ?? undefined;
    }
    setProduct(prod);

    // Handle images
    if (prod?.appearance?.images_src && prod.appearance.images_src.length > 0) {
    } else if (
      prod?.appearance?.images_src_id &&
      prod.appearance.images_src_id.length > 0
    ) {
      const fetchImages = async () => {
        const images: File[] = [];
        for (const id of prod.appearance.images_src_id ?? []) {
          try {
            const res = await fetch(
              (process.env.NODE_ENV === "development"
                ? "http://localhost:5002/api"
                : "/api") + `/images/get-image/${id}`,
              {
                method: "GET",
                credentials: "include",
              }
            );
            if (res.ok) {
              const blob = await res.blob();
              const file = new File([blob], id, { type: blob.type });
              images.push(file);
            }
          } catch {
            // Optionally handle error or push a placeholder image
          }
        }

        // Update the product in useProductStore with the new images
        useSelectedModeStore.setState({
          selectedProduct: {
            ...prod,
            appearance: {
              ...prod.appearance,
              images_src: images,
            },
          },
        });
        if (prod && prod._id) {
          useProductStore.setState({
            allProducts: (useProductStore.getState().allProducts ?? []).map((p) =>
              p._id === prod._id
                ? {
                    ...p,
                    appearance: {
                      ...p.appearance,
                      images_src: images,
                    },
                  }
                : p
            ),
          });
        }
      };
      fetchImages();
    } else {
    }
  }, [allProducts]);


  async function handleUpdateProduct() {
    // Always use the latest selectedProduct state for update
    const selectedProduct = useSelectedModeStore.getState().selectedProduct;
    const prod = selectedProduct || product;
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
    formData.append("original_price", prod.pricing?.original_price?.toString() || "");
    formData.append("sale_price", prod.pricing?.sale_price?.toString() || "");
    formData.append("purchase_quantity", prod.pricing?.purchase_quantity?.toString() || "");
    formData.append("stock_quantity", prod.pricing?.stock_quantity?.toString() || "");
    if (prod.appearance?.images_src) {
      prod.appearance.images_src.forEach((image: File) => {
        formData.append("images_src", image);
      });
    }
    await useProductStore.getState().updateProduct(prod._id, formData);
  }

  return (
    <motion.div
      className="min-h-screen items-center px-4 bg-gradient-to-br from-stone-400 via-stone-100 to-stone-300 py-20 flex flex-col"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
    >
      <h1 className="text-2xl font-bold mb-4 text-gray-800 mt-10 text-center">
        Product Detail
      </h1>
      <div className="flex flex-wrap items-center justify-center w-full max-w-7xl mx-auto gap-4">
        <div className="flex flex-wrap justify-center w-full max-w-7xl mx-auto gap-4">
          <Step1Product />
          <Step2Product />
          <Step3Product />
        </div>

        <div className="w-full">
          <button
            onClick={handleUpdateProduct}
            className="flex flex-col bg-gradient-to-r from-stone-700 to-stone-400 p-2 text-white items-center justify-center align-middle rounded-full w-full hover:opacity-70 active:opacity-40 "
          >
            {isUpdatingProduct ? (
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
                Updating Product...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2 align-middle">
                <FaShoppingBag size={20} />
                Update Product
              </span>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
