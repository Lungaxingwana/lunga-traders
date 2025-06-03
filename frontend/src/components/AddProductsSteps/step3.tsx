import { motion } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import type { ProductInput } from "../../data-types/product.type";

interface Step3ProductProps {
  product: ProductInput;
  setProduct: React.Dispatch<React.SetStateAction<ProductInput>>;
  setValidate: (fn: () => boolean) => void;
}

export default function Step3Product({
  product,
  setProduct,
  setValidate,
}: Step3ProductProps) {

  const [errors, setErrors] = useState<{ [key: string]: string }>({});


  const validate = useCallback(() => {
    const newErrors: { [key: string]: string } = {};
    if (
      !product.pricing.original_price ||
      product.pricing.original_price <= 0
    ) {
      newErrors.original_price = "Original price must be greater than 0.";
    }
    if (!product.pricing.sale_price || product.pricing.sale_price <= 0) {
      newErrors.sale_price = "Sale price must be greater than 0.";
    }
    if (product.pricing.sale_price > product.pricing.original_price) {
      newErrors.sale_price = "Sale price cannot exceed original price.";
    }
    if (
      !product.pricing.stock_quantity ||
      product.pricing.stock_quantity <= 0
    ) {
      newErrors.stock_quantity = "Stock quantity must be greater than 0.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [product]);

  useEffect(() => {
    setValidate(validate);
  }, [setValidate, validate]);

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
        <h3 className="text-lg font-semibold">Pricing</h3>
      </div>
      <div className="relative">
        <label className="block text-xs">Original Price</label>
        <div className="relative">
          <span className="absolute text-sm right-12 mt-3">
            {product.pricing.original_price
              ? new Intl.NumberFormat("en-ZA", {
                  style: "currency",
                  currency: "ZAR",
                }).format(product.pricing.original_price / 100)
              : "R 0.00"}
          </span>
          <input
            type="number"
            value={product.pricing.original_price || ""}
            onChange={(e) =>
              setProduct((prevProduct: ProductInput) => ({
                ...prevProduct,
                pricing: {
                  ...prevProduct.pricing,
                  original_price: parseFloat(e.target.value) || 0,
                },
              }))
            }
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
            {product.pricing.sale_price
              ? new Intl.NumberFormat("en-ZA", {
                  style: "currency",
                  currency: "ZAR",
                }).format(product.pricing.sale_price / 100)
              : "R 0.00"}
          </span>
          <input
            type="number"
            value={product.pricing.sale_price || ""}
            onChange={(e) =>
              setProduct((prevProduct: ProductInput) => ({
                ...prevProduct,
                pricing: {
                  ...prevProduct.pricing,
                  sale_price: parseFloat(e.target.value) || 0,
                },
              }))
            }
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
          placeholder="Enter stock quantity"
          value={product.pricing.stock_quantity}
          onChange={(e) =>
            setProduct((prevProduct: ProductInput) => ({
              ...prevProduct,
              pricing: {
                ...prevProduct.pricing,
                stock_quantity: Number(e.target.value),
              },
            }))
          }
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-md outline-none bg-transparent"
        />
        {errors.stock_quantity && (
          <p className="text-red-500 text-xs">{errors.stock_quantity}</p>
        )}
      </div>
      
    </motion.form>
  );
}
