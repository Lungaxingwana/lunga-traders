import { motion } from "framer-motion";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import Select from "react-select";
import { useSelectedModeStore } from "../../stores/useSelectedModeStore";
import { useProductStore } from "../../stores/useProductStore";
import { useEffect, useRef, useCallback, useMemo } from "react";
import type { Product } from "../../data-types/product.type";

const sizeOptions: { [key: string]: string[] } = {
  "Mobile Phones": [
    "5.0 inch",
    "5.2 inch",
    "5.5 inch",
    "6.0 inch",
    "6.5 inch",
    "7.0 inch",
    "8.0 inch",
  ],
  Laptops: ["13 inch", "14 inch", "15 inch", "17 inch"],
  Cameras: ["Compact", "DSLR", "Mirrorless", "Action Camera"],
  Accessories: ["Universal", "Custom Fit"],
  Men: ["Small", "Medium", "Large", "X-Large"],
  Women: ["Small", "Medium", "Large", "X-Large"],
  Kids: ["2-4 years", "4-6 years", "6-8 years", "8-10 years"],
  Kitchen: ["Small", "Medium", "Large"],
  Living_Room: ["Small", "Medium", "Large"],
  Bedroom: ["Single", "Double", "Queen", "King"],
  Bathroom: ["Compact", "Standard", "Luxury"],
  Fiction: ["Paperback", "Hardcover"],
  "Non-Fiction": ["Paperback", "Hardcover"],
  Educational: ["Primary", "Secondary", "University"],
  Comics: ["Single Issue", "Volume"],
  Outdoor: ["Small", "Medium", "Large"],
  Indoor: ["Small", "Medium", "Large"],
  "Fitness Equipment": ["Lightweight", "Standard", "Heavy"],
  Skincare: ["50ml", "100ml", "200ml"],
  Makeup: ["Compact", "Palette"],
  Haircare: ["100ml", "200ml", "500ml"],
  Fragrances: ["30ml", "50ml", "100ml"],
  "Action Figures": ["Small", "Medium", "Large"],
  Dolls: ["Small", "Medium", "Large"],
  "Educational Toys": ["2-4 years", "4-6 years", "6-8 years"],
  Puzzles: ["100 pieces", "500 pieces", "1000 pieces"],
  Cars: ["Compact", "Sedan", "SUV"],
  Motorcycles: ["Standard", "Cruiser", "Sport"],
  Parts: ["Universal", "Custom"],
  Fruits: ["Small Pack", "Medium Pack", "Large Pack"],
  Vegetables: ["Small Pack", "Medium Pack", "Large Pack"],
  Snacks: ["Single", "Family Pack"],
  Beverages: ["250ml", "500ml", "1L"],
  Office: ["Compact", "Standard", "Executive"],
};

export default function Step2Product() {
  // Get selectedProductId from localStorage and then get the product from store
  const selectedProductId =
    typeof window !== "undefined"
      ? localStorage.getItem("SelectedProductId")
      : null;
  const selectedProduct = useProductStore
    .getState()
    .allProducts?.find((p: Product) => p._id === selectedProductId);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const fetchedImagesRef = useRef(false);

  

  // Always define appearance and imagesSrc, even if selectedProduct is undefined
  const appearance = useMemo(
    () =>
      selectedProduct?.appearance ?? {
        color: "",
        size: "",
        images_src: [],
      },
    [selectedProduct]
  );
  const imagesSrc: File[] = useMemo(
    () =>
      Array.isArray(appearance.images_src)
        ? appearance.images_src
        : [],
    [appearance.images_src]
  );

  useEffect(() => {
    // Only fetch images if selectedProduct exists and images need to be fetched
    if (
      selectedProduct &&
      !fetchedImagesRef.current &&
      (!appearance.images_src || appearance.images_src.length === 0) &&
      appearance.images_src_id &&
      appearance.images_src_id.length > 0
    ) {
      fetchedImagesRef.current = true;
      const fetchImages = async () => {
        const images: File[] = [];
        for (const id of appearance.images_src_id ?? []) {
          try {
            const res = await fetch(
              (import.meta.env.MODE === "development"
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
        useSelectedModeStore.setState({
          selectedProduct: {
            ...selectedProduct,
            _id: selectedProduct._id ?? "",
            appearance: {
              ...appearance,
              color: appearance.color !== undefined ? appearance.color : "",
              size: appearance.size !== undefined ? appearance.size : "",
              images_src: images,
            },
          },
        });
        useProductStore.setState({
          allProducts: (useProductStore.getState().allProducts ?? []).map((p: Product) =>
            p._id === selectedProduct._id
              ? {
                  ...p,
                  appearance: {
                    ...p.appearance,
                    color: p.appearance.color !== undefined ? p.appearance.color : "",
                    size: p.appearance.size !== undefined ? p.appearance.size : "",
                    images_src: images,
                  },
                }
              : p
          ),
        });
      };
      fetchImages();
    }
  }, [selectedProduct, appearance, useSelectedModeStore, useProductStore]);

  // Defensive: fallback if selectedProduct is undefined
  // Move hooks above any early returns to avoid conditional hook calls
  const removeImage = useCallback((imageIndex: number) => {
    if (!selectedProduct) return;
    const newImages = imagesSrc.filter((_img, idx) => idx !== imageIndex);
    useSelectedModeStore.setState({
      selectedProduct: {
        ...selectedProduct,
        appearance: {
          ...appearance,
          images_src: newImages,
        },
      },
    });
    useProductStore.setState({
      allProducts: (useProductStore.getState().allProducts ?? []).map((p: Product) =>
        p._id === selectedProduct._id
          ? {
              ...p,
              appearance: {
                ...p.appearance,
                images_src: newImages,
              },
            }
          : p
      ),
    });
  }, [selectedProduct, imagesSrc, appearance]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!selectedProduct?.appearance.color) {
      newErrors.color = "Color is required.";
    }
    if (!selectedProduct?.appearance.size) {
      newErrors.size = "Size is required.";
    }
    if (
      selectedProduct?.appearance.size === "Other" &&
      !selectedProduct?.appearance.other_size
    ) {
      newErrors.other_size = "Please specify your size.";
    }
    if (
      !selectedProduct?.appearance.images_src ||
      selectedProduct?.appearance.images_src.length === 0
    ) {
      newErrors.images_src = "At least one image is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray: File[] = Array.from(e.target.files);

      if ((imagesSrc.length + filesArray.length) > 10) {
        alert("You can only select up to 10 images.");
        return;
      }

      if (!selectedProduct) return;

      const newImages = [...imagesSrc, ...filesArray];
      useSelectedModeStore.setState({
        selectedProduct: {
          ...selectedProduct,
          appearance: {
            ...appearance,
            images_src: newImages,
          },
        },
      });
      useProductStore.setState({
        allProducts: (useProductStore.getState().allProducts ?? []).map((p: Product) =>
          p._id === selectedProduct._id
            ? {
                ...p,
                appearance: {
                  ...p.appearance,
                  images_src: newImages,
                },
              }
            : p
        ),
      });
    }
  };

  const handleOtherSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedProduct) return;
    useSelectedModeStore.setState({
      selectedProduct: {
        ...selectedProduct,
        appearance: {
          ...selectedProduct.appearance,
          other_size: e.target.value,
        },
      },
    });
    useProductStore.setState({
      allProducts: (useProductStore.getState().allProducts ?? []).map((p: Product) =>
      p._id === selectedProduct._id
        ? {
          ...p,
          appearance: {
          ...p.appearance,
          other_size: e.target.value,
          },
        }
        : p
      ),
    });
  };

  const getSizeOptions = () => {
    const subCategory = selectedProduct?.general?.sub_category || "";
    return sizeOptions[subCategory] || [];
  };

  // Dummy handleSubmit to avoid error (implement as needed)
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) {
      // Submit logic here
    }
  };

  // Defensive: fallback if selectedProduct is undefined
  if (!selectedProduct) {
    return (
      <div className="p-4 text-center text-red-500">
        No product selected. Please select a product to edit.
      </div>
    );
  }

  return (
    <motion.form
      className="space-y-4 max-w-[400px] w-full px-5 bg-white rounded-2xl py-5 shadow-lg shadow-neutral-600"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
      onSubmit={handleSubmit}
    >
      <div className="relative w-full ">
        <h3 className="text-lg font-semibold">Appearance</h3>
      </div>
      <div className="relative">
        <label className="block text-xs">Tags</label>
        <input
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const selectedSize = e.target.value || "";
            if (!selectedProduct?._id) return;
            useSelectedModeStore.setState({
              selectedProduct: {
                ...selectedProduct,
                _id: selectedProduct._id ?? "",
                general: selectedProduct.general
                  ? { ...selectedProduct.general }
                  : {
                      make: "",
                      model: "",
                      year: 0,
                      category: "",
                      sub_category: "",
                      tags: "",
                      description: "",
                    },
                appearance: {
                  ...selectedProduct.appearance,
                  color: selectedProduct.appearance.color !== undefined ? selectedProduct.appearance.color : "",
                  size: selectedSize !== undefined ? selectedSize : "",
                  other_size: selectedSize === "Other" ? "" : undefined,
                },
              },
            });
          }}
          placeholder="Enter product tags (separated by commas)"
        />
      </div>
      <div className="relative">
        <label className="block text-xs">Size</label>
        <Select
          options={[
            ...getSizeOptions().map((size) => ({ value: size, label: size })),
            { value: "Other", label: "Other" },
          ]}
          value={
            selectedProduct?.appearance.size
              ? {
                  value: selectedProduct?.appearance.size,
                  label: selectedProduct?.appearance.size,
                }
              : null
          }
          onChange={(selectedOption) => {
            const selectedSize = selectedOption?.value || "";
            if (!selectedProduct?._id) return;
            useSelectedModeStore.setState({
              selectedProduct: {
                ...selectedProduct,
                appearance: {
                  ...selectedProduct.appearance,
                  size: selectedSize !== undefined ? selectedSize : "",
                  other_size: selectedSize === "Other" ? "" : undefined,
                },
              },
            });
            useProductStore.setState({
              allProducts: (useProductStore.getState().allProducts ?? []).map((p: Product) =>
                p._id === selectedProduct._id
                  ? {
                      ...p,
                      appearance: {
                        ...p.appearance,
                        size: selectedSize !== undefined ? selectedSize : "",
                        other_size: selectedSize === "Other" ? "" : undefined,
                      },
                    }
                  : p
              ),
            });
          }}
          className="mt-1"
          styles={{
            control: (base) => ({
              ...base,
              backgroundColor: "transparent",
            }),
            menu: (base) => ({
              ...base,
              backgroundColor: "transparent",
            }),
          }}
        />
        {errors.size && <p className="text-red-500 text-xs">{errors.size}</p>}
        {selectedProduct?.appearance.size === "Other" && (
          <div className="mt-2">
            <input
              type="text"
              placeholder="Specify your size"
              value={selectedProduct?.appearance.other_size || ""}
              onChange={handleOtherSizeChange}
              className="block w-full px-4 py-1 border border-gray-300 rounded-md shadow-md outline-none bg-transparent"
            />
            {errors.other_size && (
              <p className="text-red-500 text-xs">{errors.other_size}</p>
            )}
          </div>
        )}
      </div>
      <div className="relative">
        <label className="block text-xs">Upload Images</label>
        <label
          htmlFor="file-upload"
          className="mt-1 block w-full px-4 py-1 border border-gray-300 rounded-md shadow-md outline-none text-center text-red-700 cursor-pointer bg-gray-100 hover:bg-gray-200"
        >
          Click here to Browse images
        </label>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          multiple
          style={{ display: "none" }}
          onChange={handleImageChange}
        />
        <div className="mt-4 flex flex-wrap gap-4">
          {imagesSrc.map((imgAsset: File, imgIndex: number) => {
            const src = URL.createObjectURL(imgAsset);
            return (
              <div key={imgIndex} className="relative w-28 h-28">
                <img
                  src={src}
                  alt={imgAsset.name || `Uploaded ${imgIndex + 1}`}
                  className="w-full h-full object-cover rounded-md shadow-lg shadow-black"
                  width={112}
                  height={112}
                />
                <button
                  type="button"
                  onClick={() => removeImage(imgIndex)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                >
                  <FaTrash size={12} />
                </button>
              </div>
            );
          })}
        </div>
        {errors.images_src && (
          <p className="text-red-500 text-xs">{errors.images_src}</p>
        )}
      </div>
    </motion.form>
  );
}
