import { motion } from "framer-motion";
import { useProductStore } from "../../stores/useProductStore";
import { useState } from "react";
import { useSelectedModeStore } from "../../stores/useSelectedModeStore";

export default function Step3Product() {
  const { selectedProduct } = useSelectedModeStore();
  const { updateProduct } = useProductStore();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  if (!selectedProduct) return null;

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (
      !selectedProduct.pricing.original_price ||
      selectedProduct.pricing.original_price <= 0
    ) {
      newErrors.original_price = "Original price must be greater than 0.";
    }
    if (!selectedProduct.pricing.sale_price || selectedProduct.pricing.sale_price <= 0) {
      newErrors.sale_price = "Sale price must be greater than 0.";
    }
    if (selectedProduct.pricing.sale_price > selectedProduct.pricing.original_price) {
      newErrors.sale_price = "Sale price cannot exceed original price.";
    }
    if (
      !selectedProduct.pricing.stock_quantity ||
      selectedProduct.pricing.stock_quantity <= 0
    ) {
      newErrors.stock_quantity = "Stock quantity must be greater than 0.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const form = new FormData();
      //make, model, year, category, sub_category, tags, description, color, size, original_price, purchase_quantity, stock_quantity, sale_price, rate_review, comment, payment_status
      form.append("_id", selectedProduct._id);
      form.append("make", selectedProduct.general.make);
      form.append("model", selectedProduct.general.model);
      form.append("year", selectedProduct.general.year.toString());
      form.append("category", selectedProduct.general.category);
      form.append("sub_category", selectedProduct.general.sub_category);
      form.append("tags", selectedProduct.general.tags || "");
      form.append("description", selectedProduct.general.description);
      form.append("color", selectedProduct.appearance.color);
      form.append("size", selectedProduct.appearance.size);
      form.append("original_price", selectedProduct.pricing.original_price.toString());
      form.append("purchase_quantity", selectedProduct.pricing.purchase_quantity.toString());
      form.append("stock_quantity", selectedProduct.pricing.stock_quantity.toString());
      form.append("sale_price", selectedProduct.pricing.sale_price.toString());
      form.append("rate_review", selectedProduct.reviews[0]?.rate_review?.toString() || "");
      form.append("comment", selectedProduct.reviews[0]?.comment || "");
      form.append("payment_status", "Paid");
      if (selectedProduct.appearance.images_src && Array.isArray(selectedProduct.appearance.images_src)) {
        selectedProduct.appearance.images_src.forEach((file: File) => {
          form.append("images_src", file);
          console.log("file", file);
        });
      }
      await updateProduct(selectedProduct._id, form);
      
    }
  };

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
        <h3 className="text-lg font-semibold">Pricing</h3>
      </div>
      <div className="relative">
        <label className="block text-xs">Original Price</label>
        <div className="relative">
          <span className="absolute text-sm right-12 mt-3">
            {selectedProduct.pricing.original_price
              ? new Intl.NumberFormat("en-ZA", {
                  style: "currency",
                  currency: "ZAR",
                }).format(selectedProduct.pricing.original_price / 100)
              : "R 0.00"}
          </span>
          <input
            type="number"
            value={selectedProduct.pricing.original_price || ""}
            onChange={(e) => {
              if (!selectedProduct) return;
              useSelectedModeStore.setState({
                selectedProduct: {
                  ...selectedProduct,
                  pricing: {
                    ...selectedProduct.pricing,
                    original_price: parseFloat(e.target.value) || 0,
                  },
                },
              });
            }}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-md outline-none bg-transparent"
            placeholder="Enter original price"
          />
        </div>
        {errors.original_price && (
          <p className="text-red-500 text-xs">{errors.original_price}</p>
        )}
      </div>
      <div className="relative">
        <label className="block text-xs">Sale Price</label>
        <div className="relative">
          <span className="absolute text-sm right-12 mt-3">
            {selectedProduct.pricing.sale_price
              ? new Intl.NumberFormat("en-ZA", {
                  style: "currency",
                  currency: "ZAR",
                }).format(selectedProduct.pricing.sale_price / 100)
              : "R 0.00"}
          </span>
          <input
            type="number"
            value={selectedProduct.pricing.sale_price || ""}
            onChange={(e) => {
              if (!selectedProduct) return;
              useSelectedModeStore.setState({
                selectedProduct: {
                  ...selectedProduct,
                  pricing: {
                    ...selectedProduct.pricing,
                    sale_price: parseFloat(e.target.value) || 0,
                  },
                },
              });
            }}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-md outline-none bg-transparent"
            placeholder="Enter sale price"
          />
        </div>
        {errors.sale_price && (
          <p className="text-red-500 text-xs">{errors.sale_price}</p>
        )}
      </div>
      <div className="relative">
        <label className="block text-xs">Stock Quantity</label>
        <input
          type="number"
          value={selectedProduct.pricing.stock_quantity || ""}
          onChange={(e) => {
            if (!selectedProduct) return;
            useSelectedModeStore.setState({
              selectedProduct: {
                ...selectedProduct,
                pricing: {
                  ...selectedProduct.pricing,
                  stock_quantity: Number(e.target.value) || 0,
                },
              },
            });
          }}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-md outline-none bg-transparent"
          placeholder="Enter stock quantity"
        />
      </div>
    </motion.form>
  );
}
