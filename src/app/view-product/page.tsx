"use client";
import { useSelectedMode } from "@/contexts/SelectionModeContext";
import { Product } from "@/data-types/product";
import { formatCurrency } from "@/utils/util";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { BsCameraFill } from "react-icons/bs";
import Image from "next/image";
import { Cart } from "@/data-types/cart";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import "swiper/css/autoplay";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";
import { useCart } from "@/contexts/CartContext";
import { useUser } from "@/contexts/UserContext";
import { toast, Toaster } from "sonner";
import { ImSpinner9 } from "react-icons/im";

export default function ViewProduct() {
  const { selectedProductId } = useSelectedMode();
  const { user } = useUser();
  const { cartCount, setCartCount } = useCart();

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
  const { data: allProducts } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await axios.get<Product[]>("/api/all-products");
      return response.data;
    },
  });

  const [loading, setLoading] = useState({
    isLoading: false,
    action: "DECREAMENT",
  });

  const product = allProducts?.find((prod) => prod._id === selectedProductId);
  const cartPro = allCart?.find((item) => item.product_id === product?._id);

  // Refetch cart data whenever `cartCount` changes
  useEffect(() => {
    if (cartCount > 0) {
      refetch();
    }
  }, [cartCount, refetch, cartPro]);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0); // Track the selected image index
  const swiperRef = useRef<Swiper | null>(null); // Reference to the Swiper instance

  if (!product)
    return (
      <div>
        <p>
          Product does not exist or not found, refresh the page again or start
          from the main menu...
        </p>
      </div>
    );

  async function handleDecreaseQuantity() {
    setLoading({ isLoading: true, action: "DECREAMENT" });
    const newCartCount = cartCount - 1; // Optimistic update
    setCartCount(newCartCount);

    try {
      await axios.post<Cart[]>("/api/cart/add-cart", {
        product_id: product?._id,
        quantity: 1,
        user_id: user._id,
        action: "DECREAMENT",
      });
      toast.success("SUCCESSFUL: Removed cart");
      refetch();
    } catch (error) {
      // Revert cart count if API call fails
      toast.error(
        "FAILED: Did not add or update cart!!! {hint: LOGIN FIRST}",
        error || ""
      );
    } finally {
      setLoading({ isLoading: false, action: "DECREAMENT" });
    }
  }
  async function handleIncreaseQuantity() {
    setLoading({ isLoading: true, action: "INCREAMENT" });
    const newCartCount = cartCount + 1; // Optimistic update
    setCartCount(newCartCount);

    try {
      await axios.post<Cart[]>("/api/cart/add-cart", {
        product_id: product?._id,
        quantity: 1,
        user_id: user._id,
        action: "INCREAMENT",
      });
      toast.success("SUCCESSFUL: Added to cart");
      refetch();
    } catch (error) {
      // Revert cart count if API call fails
      toast.error(
        "FAILED: Did not add or update cart!!! {hint: LOGIN FIRST}",
        error || ""
      );
    } finally {
      setLoading({ isLoading: false, action: "INCREAMENT" });
    }
  }

  return (
    <div className="w-full justify-items-center align-middle justify-center h-screen bg-stone-200 items-center">
      <p className="mt-10 text-center pt-10 font-bold text-xl">
        {product.year} {product.make} {product.model}
      </p>
      <Toaster richColors position="top-center" />
      <div className="items-center justify-items-center align-middle gap-16 mx-auto">
        <div className="max-w-7xl w-full justify-items-center align-middle justify-center flex-wrap rounded-xl mt-7 flex md:space-x-5 space-y-5">
          <div className="max-w-[400px] w-full h-[600px] bg-white shadow-black shadow-lg border rounded-xl overflow-hidden justify-center items-center align-middle flex">
            <div className="w-full justify-items-center align-middle justify-center flex flex-col">
              <div className="w-full overflow-hidden justify-center items-center align-middle justify-items-center">
                <Swiper
                  modules={[Autoplay]}
                  autoplay={{ delay: 3000 }}
                  className="mySwiper"
                  onSwiper={(swiper) => (swiperRef.current = swiper)} // Store the Swiper instance in the ref
                >
                  {product.images_src?.map((image, index) => (
                    <SwiperSlide key={index}>
                      <div className="w-full h-[500px] rounded-xl overflow-hidden">
                        <Image
                          src={image}
                          alt="pic of the vehicle"
                          className="rounded-xl"
                          layout="fill"
                          objectFit="contain"
                        />
                        <div className="absolute left-1 bottom-2 flex space-x-1 bg-[#3636368c] px-1 rounded-lg bg-opacity-45 shadow-black shadow-lg">
                          <BsCameraFill color="white" size={22} />
                          <p className="text-white ">
                            {index + 1}/{product.images_src?.length}
                          </p>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
              <div className="flex p-2 gap-2 overflow-visible border-t flex-1 w-full justify-center items-center align-middle">
                {product.images_src?.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedImageIndex(index); // Update the selected image index
                      swiperRef.current?.slideTo(index); // Programmatically change the active slide
                    }}
                    className={`w-[60px] h-[60px] cursor-pointer active:opacity-40 border-1 hover:opacity-70 shadow-black shadow-lg rounded-xl overflow-hidden justify-center align-middle items-center justify-items-center ${
                      selectedImageIndex === index
                        ? "border-2 border-blue-500"
                        : ""
                    }`}
                  >
                    <Image
                      src={image}
                      alt="pic of the vehicle"
                      className="rounded-xl"
                      width={60}
                      height={60}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="max-w-[400px] w-full h-[600px] bg-white shadow-black shadow-lg border rounded-xl overflow-hidden justify-center items-center align-middle justify-items-center">
            <div className="flex justify-between items-center align-middle w-full p-1 px-4 bg-stone-200">
              <p>Size</p>
              <p>{product.size}</p>
            </div>
            <div className="flex justify-between items-center align-middle w-full p-1 px-4">
              <p>Category</p>
              <p>{product.category}</p>
            </div>
            <div className="flex justify-between items-center align-middle w-full p-1 px-4 bg-stone-200">
              <p>Sub Category</p>
              <p>{product.sub_category}</p>
            </div>
            <div className="justify-between  align-middle w-full p-1 px-4 ">
              <p className="w-full mt-3">More Features</p>
              <div className="w-full bg-stone-300 p-2 rounded-xl shadow-black shadow-lg">
                {product.tags
                  ?.split(",")
                  .map((feature: string, index: number) => (
                    <div className="w-full flex" key={index}>
                      <p className="w-1/12">{index + 1}.</p>
                      <p className="w-11/12" key={index}>
                        {feature}
                      </p>
                    </div>
                  ))}
              </div>
            </div>

            <p className="mt-5">Quantity</p>
            <div className="w-full justify-evenly items-center align-middle flex ">
              <button
              disabled={cartPro?.quantity === 1 || loading.isLoading}
                onClick={handleDecreaseQuantity} color={'black'}
                className={`shadow-black bg-stone-300 ${cartPro?.quantity===1 && 'opacity-30'} shadow-lg rounded-full border border-black hover:bg-stone-500 active:opacity-40`}
              >
                {loading.isLoading && loading.action === "DECREAMENT" ? (
                  <ImSpinner9 className="animate-spin" size={40} color={`${cartPro?.quantity===1 && '##ff6600'}`}/>
                ) : (
                  <FaArrowAltCircleLeft size={40} className="text-stone-600" />
                )}
              </button>
              
              <div className="max-w-[80px] w-full h-[40px] bg-white shadow-black shadow-lg  rounded overflow-hidden justify-center items-center align-middle flex">
                <p className="text-2xl">
                  {cartPro ? cartPro?.quantity : 0}/{product.stock_quantity}
                </p>
              </div>
              <button
              disabled={cartPro?.quantity === product?.stock_quantity  || loading.isLoading}
                onClick={handleIncreaseQuantity}
                className={`shadow-black shadow-lg rounded-full ${cartPro?.quantity === product?.stock_quantity && 'opacity-30'} border border-black hover:bg-stone-500 active:opacity-40`}
              >
                {loading.isLoading && loading.action === "INCREAMENT" ? (
                  <ImSpinner9 className="animate-spin" size={40} />
                ) : (
                  <FaArrowAltCircleRight size={40} className="text-stone-600" />
                )}
              </button>
            </div>
            <div className="flex w-full mt-10 px-5 space-x-3 items-baseline align-middle">
              <p>Price:</p>
              <p className="text-3xl font-bold">
                {formatCurrency(product.sale_price)}
              </p>
              <p className="line-through">
                {formatCurrency(product.original_price)}
              </p>
            </div>
          </div>
          <div className="max-w-[400px] w-full h-[600px] bg-white shadow-black shadow-lg border rounded-xl overflow-hidden justify-center items-center align-middle justify-items-center">
            <div className="flex w-full mt-10 px-5 space-x-3 items-baseline align-middle">
              <p>Description:</p>
              <p className="">{product.description}</p>
            </div>
          </div>
        </div>
        <div className="w-1/2"></div>
      </div>
    </div>
  );
}
