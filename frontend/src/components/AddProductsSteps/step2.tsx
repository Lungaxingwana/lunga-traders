import { motion } from "framer-motion";
import { ProductInput } from '../../data-types/product.type';
import { FaTrash } from "react-icons/fa";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Select from "react-select";

interface Step2ProductProps {
  product: ProductInput;
  setProduct: React.Dispatch<React.SetStateAction<ProductInput>>;
  setValidate: (fn: () => boolean) => void;
}


const sizeOptions: { [key: string]: string[] } = {
  "Mobile Phones": ["5.0 inch", "5.2 inch", "5.5 inch", "6.0 inch", "6.5 inch", "7.0 inch", "8.0 inch"],
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

const colorOptions = [
  { value: "Red", label: "Red" },
  { value: "Blue", label: "Blue" },
  { value: "Green", label: "Green" },
  { value: "Black", label: "Black" },
  { value: "White", label: "White" },
  { value: "Yellow", label: "Yellow" },
  { value: "Purple", label: "Purple" },
  { value: "Pink", label: "Pink" },
  { value: "Orange", label: "Orange" },
  { value: "Brown", label: "Brown" },
  { value: "Gray", label: "Gray" },
  { value: "Other", label: "Other" },
];

export default function Step2Product({ product, setProduct, setValidate }: Step2ProductProps) {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = useCallback(() => {
    const newErrors: { [key: string]: string } = {};
    if (!product.appearance.color) {
      newErrors.color = "Color is required.";
    }
    if (!product.appearance.size) {
      newErrors.size = "Size is required.";
    }
    if (product.appearance.size === "Other" && !product.appearance.other_size) {
      newErrors.other_size = "Please specify your size.";
    }
    if (!product.general.make) {
      newErrors.make = "Make is required.";
    }
    if (!product.general.model) {
      newErrors.model = "Model is required.";
    }
    if (!product.general.year) {
      newErrors.year = "Year is required.";
    }
    if (!product.general.category) {
      newErrors.category = "Category is required.";
    }
    if (!product.general.sub_category && product.general.category) {
      newErrors.sub_category = "Sub Category is required.";
    }
    if (!product.general.description) {
      newErrors.description = "Description is required.";
    }
    if (!product.appearance.images_src || product.appearance.images_src.length === 0) {
      newErrors.images_src = "At least one image is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [product]);

    useEffect(() => {
      setValidate(validate);
    }, [product, setValidate, validate]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);

      if ((product.appearance.images_src || []).length + filesArray.length > 10) {
        alert("You can only select up to 10 images.");
        return;
      }
      
      setProduct((prevProduct: ProductInput) => ({
        ...prevProduct,
        appearance: {
          ...prevProduct.appearance,
          images_src: [
        ...(prevProduct.appearance.images_src || []),
        ...filesArray,
          ],
        },
      }));
    }
  };

  const removeImage = (imageIndex: number) => {
    setProduct((prevProduct: ProductInput) => ({
      ...prevProduct,
      appearance: {
        ...prevProduct.appearance,
        images_src: prevProduct.appearance.images_src?.filter((_, idx) => idx !== imageIndex),
      },
    }));
  };

  const getSizeOptions = () => {
    const subCategory = product.general?.sub_category || ""; 
    return sizeOptions[subCategory] || [];
  };

  if (!product) return null;

  return (
    <motion.form
      className="space-y-4 max-w-[400px] w-full px-5 bg-white rounded-2xl py-5 shadow-lg shadow-neutral-600"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
      onSubmit={validate}
    >
      <div className="relative w-full">
        <h3 className="text-lg font-semibold">Appearance</h3>
      </div>
      <div className="relative">
        <label className="block text-xs">Tag</label>
        <input
          type="text"
          value={product.general.tags || ""}
          onChange={(e) =>
            setProduct((prevProduct: ProductInput) => ({
              ...prevProduct,
              general: {
                ...prevProduct.general,
                tags: e.target.value,
              },
            }))
          }
          className="block w-full px-4 py-1 border border-gray-300 rounded-md shadow-md outline-none bg-transparent mt-1"
          placeholder="Enter product tags (seperated by commas)"
        />
      </div>
      <div className="relative">
        <label className="block text-xs">Color</label>
        <Select
          options={colorOptions}
          value={colorOptions.find((option) => option.value === product.appearance.color)}
          onChange={(selectedOption) =>
            setProduct((prevProduct: ProductInput) => ({
              ...prevProduct,
              appearance: {
                ...prevProduct.appearance,
                color: selectedOption?.value || "",
              },
            }))
          }
          className="mt-1"
          styles={{
            control: (base) => ({
              ...base,
              backgroundColor: "transparent",
            }),
            menu: (base) => ({
              ...base,
              backgroundColor: "white", // Set background to white
            }),
          }}
        />
        {errors.color && <p className="text-red-500 text-xs">{errors.color}</p>}
      </div>
      <div className="relative">
        <label className="block text-xs">Size</label>
        <Select
          options={[
            ...getSizeOptions().map((size) => ({ value: size, label: size })),
            { value: "Other", label: "Other" },
          ]}
          value={
            product.appearance.size
              ? { value: product.appearance.size, label: product.appearance.size }
              : null
          }
          onChange={(selectedOption) => {
            const selectedSize = selectedOption?.value || "";
            setProduct((prevProduct: ProductInput) => ({
              ...prevProduct,
              appearance: {
                ...prevProduct.appearance,
                size: selectedSize,
              },
              other_size: selectedSize === "Other" ? "" : undefined, // Reset other_size if not "Other"
            }));
          }}
          className="mt-1"
          styles={{
            control: (base) => ({
              ...base,
              backgroundColor: "transparent",
            }),
            menu: (base) => ({
              ...base,
              backgroundColor: "white", // Set background to white
            }),
          }}
        />
        {errors.size && <p className="text-red-500 text-xs">{errors.size}</p>}
        {product.appearance.size === "Other" && (
          <div className="mt-2">
            <input
              type="text"
              placeholder="Specify your size"
              value={product.appearance.other_size || ""}
              onChange={(e) =>
                setProduct((prevProduct: ProductInput) => ({
                  ...prevProduct,
                  appearance: {
                    ...prevProduct.appearance,
                    other_size: e.target.value, // Ensure this updates the correct nested property
                  },
                }))
              }
              className="block w-full px-4 py-1 border border-gray-300 rounded-md shadow-md outline-none bg-transparent"
            />
            {errors.other_size && <p className="text-red-500 text-xs">{errors.other_size}</p>}
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
          onChange={handleImageChange}
          className="hidden"
        />
        <div className="mt-4 flex flex-wrap gap-4">
          {product.appearance.images_src?.map((imgAsset, imgIndex: number) => (
            <div key={imgIndex} className="relative w-28 h-28">
              <Image
                src={typeof imgAsset === "string" ? imgAsset : URL.createObjectURL(imgAsset)}
                alt={typeof imgAsset === "string" ? `Uploaded ${imgIndex + 1}` : imgAsset.name || `Uploaded ${imgIndex + 1}`}
                className="w-full h-full object-cover rounded-md shadow-lg shadow-black"
                fill
                sizes="112px"
                style={{ objectFit: "cover" }}
                unoptimized={typeof imgAsset !== "string"}
              />
              <button
                type="button"
                onClick={() => removeImage(imgIndex)}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
              >
                <FaTrash size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>
      
    </motion.form>
  );
}