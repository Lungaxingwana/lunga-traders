'use client';
import {  RiDeleteBinFill } from "react-icons/ri";
import { toast, Toaster } from "sonner";
import axios from "axios";
import { formatCurrency } from "@/utils/util";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { useSelectedMode } from "@/contexts/SelectionModeContext";
import { useUser } from "@/contexts/UserContext";
import { Product } from "@/data-types/product";

export default function AllAssets() {
  const { user } = useUser();
  const { data: allProducts } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await axios.get<Product[]>("/api/all-products");
      return response.data;
    },
  });

  const handleDeleteProduct = async (productId: string) => {
    try {
      await axios.post<Product>("/api/manage-my-business/delete-asset/", {
        _id: productId,
      });
      // Update the state to remove the deleted product
      toast.success("Successfully deleted the product");
    } catch (error) {
      console.error("Failed to delete selected product:", error);
      toast.error("Failed to delete selected product");
    }
  };

  return (
    <div className="max-w-7xl w-full">
      <div>
        <p className="w-full text-2xl text-white font-bold text-center">
          All Assets
        </p>
        <div className="w-full border border-b my-5 border-white"></div>
        <Toaster richColors position="top-center" />
        <div className="bg-white rounded-xl shadow-lg shadow-black">
          <div className={`w-full px-4 `}>
            <div className={`w-full flex mx-auto items-center align-middle `}>
              <p className="w-1/12 font-bold">No.</p>
              <p className="w-1/12 font-bold">Pic</p>
              <p className="w-3/12 font-bold">Model</p>
              <p className="w-3/12 font-bold">Make</p>
              <p className="sm:w-1/12 font-bold hidden sm:block">Color</p>
              <p className="sm:w-1/12 font-bold hidden sm:block">Size</p>
              <p className="sm:w-1/12 font-bold hidden sm:block">Quantity</p>
              <p className="w-2/12 font-bold">Price</p>
              <p className="w-1/12 font-bold"></p>
            </div>
          </div>
          {allProducts
            ?.filter((pro) => pro.user_id === user._id)
            .map((product, index) => (
              <ProductItem
                key={index}
                count={index}
                product={product}
                handleDeleteProduct={handleDeleteProduct}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

interface ProductItemProps {
  product: Product;
  count: number;
  handleDeleteProduct: (productId: string) => void;
}

function ProductItem({
  product,
  count,
  handleDeleteProduct,
}: ProductItemProps) {
  const { setSelectedProductId, setMode } = useSelectedMode();
  return (
    <div
      className={`w-full hover:bg-stone-500 flex hover:cursor-pointer px-4 ${"bg-stone-300"} ${
        count % 2 === 0 ? "bg-stone-200" : "bg-white"
      }`}
    >
      <div
        onClick={() => {
          setSelectedProductId(product._id);
          setMode("Edit Asset");
        }}
        className={`w-full flex mx-auto items-center align-middle `}
      >
        <p className="w-1/12">{count + 1}</p>
        <div className="w-1/12">
          <Image
            src={product.image_src}
            alt="pic of the item"
            width={28}
            height={28}
            className="w-7 h-7 rounded-full"
          />
        </div>
        <p className="w-3/12">{product.model}</p>
        <p className="w-3/12">{product.make}</p>
        <p className="sm:w-1/12 hidden sm:block">{product.color}</p>
        <p className="sm:w-1/12 hidden sm:block">{product.size}</p>
        <p className="sm:w-1/12 hidden sm:block">{product.stock_quantity}</p>
        <p className="w-2/12">{formatCurrency(product.sale_price)}</p>
      </div>
      <div className="w-1/12 justify-end items-center align-middle flex">
        <RiDeleteBinFill
          onClick={() => handleDeleteProduct(product._id)}
          className="w-7 h-7 text-red-700 z-50 hover:text-stone-700 active:opacity-40"
        />
      </div>
    </div>
  );
}
