import { motion } from "framer-motion";
import { Category } from "../../data-types/product.type";
import { Select, MenuItem } from "@mui/material";
import { useState } from "react";
import { useSelectedModeStore } from "../../stores/useSelectedModeStore";

export default function Step1Product() {
  const { selectedProduct } = useSelectedModeStore();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1990 + 1 }, (_, i) => 1990 + i);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!selectedProduct || !selectedProduct.general.make) {
      newErrors.make = "Make is required.";
    }
    if (!selectedProduct || !selectedProduct.general.model) {
      newErrors.model = "Model is required.";
    }
    if (!selectedProduct || !selectedProduct.general.year) {
      newErrors.year = "Year is required.";
    }
    if (!selectedProduct || !selectedProduct.general.category) {
      newErrors.category = "Category is required.";
    }
    if (
      selectedProduct &&
      !selectedProduct.general.sub_category &&
      selectedProduct.general.category
    ) {
      newErrors.sub_category = "Sub Category is required.";
    }
    if (!selectedProduct || !selectedProduct.general.description) {
      newErrors.description = "Description is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      useSelectedModeStore.setState({productStep:"Step 2"});
    }
  };

  const subCategories =
    selectedProduct && Category.find((cat) => cat.name_of_category === selectedProduct.general.category)
      ?.sub_categories || [];

  return (
    <motion.form
      className="space-y-4 max-w-[400px] w-full px-5 bg-white rounded-2xl py-5 shadow-lg shadow-neutral-600"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
      onSubmit={handleSubmit}
    >
      <div className="relative w-full">
        <label className="block text-xs">Make</label>
        <input
        value={selectedProduct?.general.make || ''}
          onChange={(e) =>
            useSelectedModeStore.setState({
              selectedProduct: {
                ...selectedProduct!,
                general: {
                  ...selectedProduct!.general,
                  make: e.target.value,
                },
              },
            })
          }
          className="mt-1 block w-full px-4 py-1 border border-gray-300 rounded-md shadow-md outline-none"
          placeholder="Enter make"
        />
        {errors.make && <p className="text-red-500 text-xs">{errors.make}</p>}
      </div>
      <div className="relative">
        <label className="block text-xs">Model</label>
        <input
        value={selectedProduct?.general.model || ''}
          onChange={(e) =>
            useSelectedModeStore.setState({
              selectedProduct: {
                ...selectedProduct!,
                general: {
                  ...selectedProduct!.general,
                  model: e.target.value,
                },
              },
            })
          }
          className="mt-1 block w-full px-4 py-1 border border-gray-300 rounded-md shadow-md outline-none"
          placeholder="Enter model"
        />
        {errors.model && <p className="text-red-500 text-xs">{errors.model}</p>}
      </div>
      <div className="relative">
        <label className="block text-xs">Year</label>
        <Select
          value={selectedProduct?.general.year ?? ''}
          onChange={(e) =>
            useSelectedModeStore.setState({
              selectedProduct: {
                ...selectedProduct!,
                general: {
                  ...selectedProduct!.general,
                  year: Number(e.target.value),
                },
              },
            })
          }
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-md outline-none h-8"
          displayEmpty
        >
          <MenuItem value="" disabled>
            Select Year
          </MenuItem>
          {years.map((year: number) => (
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
          value={selectedProduct?.general.category ?? ''}
          onChange={(e) => useSelectedModeStore.setState({
            selectedProduct: {
              ...selectedProduct!,
              general: {
                ...selectedProduct!.general,
                category: e.target.value,
                sub_category: "",
              },
            },
          })}
          className="mt-1 block w-full h-8 border border-gray-300 rounded-md shadow-md outline-none"
          displayEmpty
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
          value={selectedProduct?.general.sub_category ?? ''}
          onChange={(e) => useSelectedModeStore.setState({
            selectedProduct: {
              ...selectedProduct!,
              general: {
                ...selectedProduct!.general,
                sub_category: e.target.value,
              },
            },
          })}
          className="mt-1 block w-full h-8 border border-gray-300 rounded-md shadow-md outline-none"
          displayEmpty
          disabled={!selectedProduct?.general.category}
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
        value={selectedProduct?.general.description || ''}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            useSelectedModeStore.setState({
              selectedProduct: {
                ...selectedProduct!,
                general: {
                  ...selectedProduct!.general,
                  description: e.target.value,
                },
              },
            })
          }
          className="mt-1 block w-full px-4 py-1 border border-gray-300 rounded-md shadow-md outline-none bg-transparent"
          placeholder="Enter description"
        />
        {errors.description && <p className="text-red-500 text-xs">{errors.description}</p>}
      </div>
    </motion.form>
  );
}
