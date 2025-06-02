import { motion } from "framer-motion";
import { ProductInput, Category } from "../../data-types/product.type";
import { Select, MenuItem } from "@mui/material";
import { useState, useEffect, useCallback } from "react";

interface Step1ProductProps {
  product: ProductInput;
  setProduct: React.Dispatch<React.SetStateAction<ProductInput>>;
  setValidate: (fn: () => boolean) => void;
}

export default function Step1Product({
  product,
  setProduct,
  setValidate,
}: Step1ProductProps) {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Define validate and register it with parent on mount/update
  const validate = useCallback(() => {
    const newErrors: { [key: string]: string } = {};
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
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [product]);

  useEffect(() => {
    setValidate(validate);
  }, [setValidate, validate]);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1990 + 1 }, (_, i) => 1990 + i);

  const handleCategoryChange = (category: string) => {
    setProduct((prevProduct: ProductInput) => ({
      ...prevProduct,
      general: {
        ...prevProduct.general,
        category,
        sub_category: "", // Reset sub_category when category changes
      },
    }));
  };

  const handleSubCategoryChange = (subCategory: string) => {
    setProduct((prevProduct: ProductInput) => ({
      ...prevProduct,
      general: {
        ...prevProduct.general,
        sub_category: subCategory,
      },
    }));
  };

  const subCategories =
    Category.find((cat) => cat.name_of_category === product.general.category)
      ?.sub_categories || [];

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
        <label className="block text-xs">Make</label>
        <input
          type="text"
          value={product.general.make}
          onChange={(e) =>
            setProduct((prevProduct: ProductInput) => ({
              ...prevProduct,
              general: {
                ...prevProduct.general,
                make: e.target.value,
              },
            }))
          }
          className="mt-1 block w-full px-4 py-1 border border-gray-300 rounded-md shadow-md outline-none"
          placeholder="Enter make"
        />
        {errors.make && <p className="text-red-500 text-xs">{errors.make}</p>}
      </div>
      <div className="relative">
        <label className="block text-xs">Model</label>
        <input
          type="text"
          value={product.general.model}
          onChange={(e) =>
            setProduct((prevProduct: ProductInput) => ({
              ...prevProduct,
              general: {
                ...prevProduct.general,
                model: e.target.value,
              },
            }))
          }
          className="mt-1 block w-full px-4 py-1 border border-gray-300 rounded-md shadow-md outline-none"
          placeholder="Enter model"
        />
        {errors.model && <p className="text-red-500 text-xs">{errors.model}</p>}
      </div>
      <div className="relative">
        <label className="block text-xs">Year</label>
        <Select
          value={product.general.year ?? ''}
          onChange={(e) =>
            setProduct((prevProduct: ProductInput) => ({
              ...prevProduct,
              general: {
                ...prevProduct.general,
                year: Number(e.target.value),
              },
            }))
          }
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-md outline-none h-8"
          displayEmpty
          MenuProps={{
            PaperProps: {
              style: {
                backgroundColor: "white", // Set background to white
              },
            },
          }}
        >
          <MenuItem value="" disabled>
            Select Year
          </MenuItem>
          {years.map((year) => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </Select>
        {errors.year && <p className="text-red-500 text-xs">{errors.year}</p>}
      </div>
      <div className="relative">
        <label className="block text-xs">Category</label>
        <Select
          value={product.general.category ?? ''}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="mt-1 block w-full h-8 border border-gray-300 rounded-md shadow-md outline-none"
          displayEmpty
          MenuProps={{
            PaperProps: {
              style: {
                backgroundColor: "white", // Set background to white
              },
            },
          }}
        >
          <MenuItem value="" disabled>
            Select Category
          </MenuItem>
          {Category.map((cat) => (
            <MenuItem key={cat.name_of_category} value={cat.name_of_category}>
              {cat.name_of_category}
            </MenuItem>
          ))}
        </Select>
        {errors.category && <p className="text-red-500 text-xs">{errors.category}</p>}
      </div>
      <div className="relative">
        <label className="block text-xs">Sub Category</label>
        <Select
          value={product.general.sub_category ?? ''}
          onChange={(e) => handleSubCategoryChange(e.target.value)}
          className="mt-1 block w-full h-8 border border-gray-300 rounded-md shadow-md outline-none"
          displayEmpty
          disabled={!product.general.category}
          MenuProps={{
            PaperProps: {
              style: {
                backgroundColor: "white", // Set background to white
              },
            },
          }}
        >
          <MenuItem value="" disabled>
            Select Sub Category
          </MenuItem>
          {subCategories.map((subCat) => (
            <MenuItem key={subCat} value={subCat}>
              {subCat}
            </MenuItem>
          ))}
        </Select>
        {errors.sub_category && <p className="text-red-500 text-xs">{errors.sub_category}</p>}
      </div>
      <div className="relative">
        <label className="block text-xs">Description</label>
        <textarea
          value={product.general.description}
          onChange={(e) =>
            setProduct((prevProduct: ProductInput) => ({
              ...prevProduct,
              general: {
                ...prevProduct.general,
                description: e.target.value,
              },
            }))
          }
          className="mt-1 block w-full px-4 py-1 border border-gray-300 rounded-md shadow-md outline-none bg-transparent"
          placeholder="Enter description"
        />
        {errors.description && <p className="text-red-500 text-xs">{errors.description}</p>}
      </div>
    </motion.form>
  );
}
