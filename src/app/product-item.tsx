import { useSelectedMode } from "@/contexts/SelectionModeContext";
import { Cart } from "@/data-types/cart";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaCartPlus } from "react-icons/fa";
import { ImSpinner9 } from "react-icons/im";
import { toast } from "sonner";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import "swiper/css/autoplay";

import { formatCurrency } from "@/utils/util";
import { Product } from "@/data-types/product";
import Image from "next/image";
import { BsCameraFill } from "react-icons/bs";
import { useUser } from "@/contexts/UserContext";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";

interface ProductItemProps {
  product: Product;
}

export default function ProductItem({ product }: ProductItemProps) {
  const { setSelectedProductId } = useSelectedMode();
  const { user } = useUser();
  const { setCartCount, cartCount } = useCart();
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false); // Track hydration state
  const [loading, setLoading] = useState<boolean>(false);

  const { data: allCart, refetch } = useQuery<Cart[]>({
    queryKey: ["all-cart"],
    queryFn: async () => {
      const response = await axios.get<Cart[]>("/api/cart/get-all-cart", {
        params: { user_id: user._id },
      });
      return response.data;
    },
    enabled: !!user._id, // Ensure the query only runs when `user._id` is available
  });

  useEffect(() => {
    setHydrated(true); // Mark the component as hydrated
  }, []);

  // Refetch cart data whenever `cartCount` changes
  useEffect(() => {
    if (cartCount > 0) {
      refetch();
    }
  }, [cartCount, refetch]);

  const cartPro = allCart?.find((item) => item.product_id === product._id);

  async function handleAddToCart() {
    setLoading(true);
    const newCartCount = cartCount + 1; // Optimistic update
    setCartCount(newCartCount);
    
    try {
      await axios.post<Cart[]>("/api/cart/add-cart", {
        product_id: product._id,
        quantity: 1,
        user_id: user._id,
        action: "INCREAMENT",
      });
      toast.success("SUCCESSFUL: Added to cart");
    } catch (error) {
      setCartCount(cartCount); // Revert cart count if API call fails
      toast.error("FAILED: Did not add or update cart!!! {hint: LOGIN FIRST}", error || "");
    } finally {
      setLoading(false);
    }
  }

  if (!hydrated) {
    // Render a fallback UI until hydration is complete
    return (
      <div className="w-48 h-72 bg-gray-200 animate-pulse rounded-xl"></div>
    );
  }

  return (
    <div className="w-[190px] align-middle justify-center flex  rounded-xl bg-white h-72 shadow-stone-400 shadow-lg hover:border hover:border-stone-600 hover:scale-105 transition-all duration-700">
      <div className="w-full items-center justify-center relative pb-2 flex-wrap align-middle">
        <div
          className={`absolute ${
            cartPro?.quantity === product.stock_quantity
              ? "bg-red-700"
              : "bg-green-700"
          } w-5 h-6 right-2 z-30 rounded-b-full shadow-black shadow-md`}
        />
        <div className="z-10 absolute w-full top-0 bg-[#ffffff7f]">
          <p
            className="text-center text-lg font-bold mt-2 z-40"
            style={{ zIndex: 9999 }}
          >
            {product.model}
          </p>
          <p className="text-center  z-50">{product.make}</p>
        </div>
        <button
      onClick={(e) => {
        e.preventDefault(); // Prevent default navigation
        setSelectedProductId(product._id); // Set the selected product ID
        router.push("/view-product"); // Navigate programmatically
      }}
      className="w-full items-center justify-items-center relative h-full block"
    >
          <div className="w-full overflow-hidden">
            <Swiper
              modules={[Autoplay]}
              autoplay={{ delay: 3000 }}
              className="mySwiper "
            >
              {product.images_src?.map((image, index) => (
                <SwiperSlide key={index}>
                  <div className=" w-full h-64 rounded-xl overflow-hidden">
                    <Image
                      src={image}
                      alt="pic of the vehicle"
                      className="rounded-xl "
                      layout="fill"
                      objectFit="contain"
                    />
                    <div className="absolute right-1 bottom-14 flex space-x-1 bg-[#3636368c] px-1 rounded-lg bg-opacity-45 shadow-black shadow-lg">
                      <BsCameraFill color="white" size={14} />
                      <p className="text-white text-xs">
                        {index + 1}/{product.images_src?.length}
                      </p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className="justify-evenly z-40 align-middle items-center flex w-full bottom-[55px] bg-[#2a1f077f] px-1 bg-opacity-80 rounded-full absolute">
            <p className="w-4/12 text-center text-white text-xs">
              {product.color}
            </p>
            <p className="w-4/12 text-center text-white text-xs">
              {product.size}
            </p>
            <p className="w-4/12 text-center text-white text-xs">
              {cartPro ? cartPro.quantity : product.purchace_quantity}/
              {product.stock_quantity}
            </p>
          </div>
          <p className="absolute text-center z-40 w-full bottom-6 text-2xl bg-[#ffffff55]">
            {formatCurrency(
              product.sale_price *
                (product.purchace_quantity === 0
                  ? 1
                  : product.purchace_quantity)
            )}
          </p>
        </button>

        {cartPro?.quantity === product.stock_quantity ? (
          <p className="text-red-700 font-bold text-center w-full mt-[-18] z-40">
            OUT OF STOCK
          </p>
        ) : (
          <div className="w-full bottom-2 justify-center items-center align-middle flex">
            <button
              onClick={handleAddToCart}
              disabled={loading}
              className="absolute max-w-11/12 z-40 w-full gap-3 border-white border shadow-black shadow-xl hover:bg-stone-400 bg-stone-700 rounded-full bottom-2 active:opacity-60 flex justify-center items-center align-middle"
            >
              {loading ? (
                <div className="flex align-bottom justify-center items-center gap-2 w-full">
                  <ImSpinner9 size={18} className="animate-spin text-white" />
                  <p className="text-white text-[14px]">Adding to Cart...</p>
                </div>
              ) : (
                <div className="items-center align-middle gap-x-2 flex">
                  <FaCartPlus size={18} color="white" />
                  <p className="text-white text-[14px]">Add to Cart</p>
                </div>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}