import { useState, useEffect } from "react";
import { FaCartPlus } from "react-icons/fa";
import { ImSpinner9 } from "react-icons/im";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import "swiper/css/autoplay";

import Image from "next/image";
import { BsCameraFill } from "react-icons/bs";
import { Product } from "@/data-types/product.type";
import { useSelectedModeStore } from "@/stores/useSelectedModeStore";
import { useRouter } from "next/navigation";
import { useInvoiceStore } from "@/stores/useInvoiceStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { useProductStore } from "@/stores/useProductStore";

interface ProductItemProps {
  product: Product;
}
export default function ProductItem({ product }: ProductItemProps) {
  const router = useRouter();
  const [lstImages, setLstImages] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingBut, setIsLoadingBut] = useState(false);
  const { allInvoices, addInvoice, updateInvoice } = useInvoiceStore();
  const { authUser } = useAuthStore();

  // Only fetch images if they do not exist
  useEffect(() => {
    if (product.appearance.images_src && product.appearance.images_src.length > 0) {
      setLstImages(product.appearance.images_src);
      setIsLoading(false);
    } else if (
      product.appearance.images_src_id &&
      product.appearance.images_src_id.length > 0
    ) {
      const fetchImages = async () => {
        setIsLoading(true);
        const images: File[] = [];
        for (const id of product.appearance.images_src_id ?? []) {
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
        setLstImages(images);
        setIsLoading(false);
        // Update product in store with fetched images
        useProductStore.setState({
          allProducts: (useProductStore.getState().allProducts ?? []).map((p) =>
            p._id === product._id
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
      };
      fetchImages();
    } else {
      setLstImages([]);
      setIsLoading(false);
    }
  }, [product._id, product.appearance.images_src, product.appearance.images_src_id]);

  const handleAddToCart = async () => {
    setIsLoadingBut(true);
    try {
      const cart = allInvoices.find(
        (invoice) =>
          Array.isArray(invoice.cart) &&
          invoice.cart.some((item) => item.product_id === product._id)
      );
      if (cart) {
        // Update the cart item quantity or details as needed
        const updatedCart = cart.cart.map((item) =>
          item.product_id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        const updatedInvoice = {
          ...cart,
          cart: updatedCart,
        };
        await updateInvoice(updatedInvoice);
        console.log("Adding to cart:", updatedInvoice);
      } else {
        // Create a new cart item
        const newCartItem = {
          product_id: product._id,
          quantity: 1,
          size: product.appearance.size,
          color: product.appearance.color,
        };
        const newInvoice = {
          cart: [newCartItem],
          total: product.pricing.sale_price,
          user_id: authUser?._id || "",
          total_amount:
            product.pricing.sale_price * product.pricing.stock_quantity,
          payment_status: "Unpaid" as const,
          delivery_method: "Own Collection" as const,
        };
        await addInvoice(newInvoice);
        console.log("Adding new item to cart:", newInvoice);
      }
    } catch (error) {
      console.error("Error adding/updating cart item:", error);
    } finally {
      setIsLoadingBut(false);
    }
  };

  return (
    <div
      className={`w-[160px] align-middle justify-center flex  rounded-xl bg-white h-64 shadow-stone-400 shadow-lg hover:border hover:border-stone-600 hover:scale-105 transition-all duration-700 ${
        useInvoiceStore
          .getState()
          .allInvoices.find(
            (invoice) =>
              Array.isArray(invoice.cart) &&
              invoice.cart.some((item) => item.product_id === product._id)
          )
          ?.cart.find((item) => item.product_id === product._id)?.quantity ===
          product.pricing.purchase_quantity && "border-red-700 border-2"
      }`}
    >
      <div className="w-full items-center justify-center relative pb-2 flex-wrap align-middle">
        <div
          className={`absolute ${
            useInvoiceStore
              .getState()
              .allInvoices.find(
                (invoice) =>
                  Array.isArray(invoice.cart) &&
                  invoice.cart.some((item) => item.product_id === product._id)
              )
              ?.cart.find((item) => item.product_id === product._id)
              ?.quantity === product.pricing.purchase_quantity
              ? "bg-red-700"
              : "bg-green-700"
          } w-5 h-6 right-2 z-30 rounded-b-full shadow-black shadow-md`}
        />
        <div className="z-10 absolute w-full top-0 bg-[#ffffff7f]">
          <p
            className="text-center text-lg font-bold mt-2 z-40"
            style={{ zIndex: 9999 }}
          >
            {product.general.model}
          </p>
          <p className="text-center  z-50">{product.general.make}</p>
        </div>
        <button
          onClick={() => {
            useSelectedModeStore.setState({
              selectedProduct: {
                ...product,
                appearance: { ...product.appearance, images_src: lstImages },
              },
            });
            useProductStore.setState({
              allProducts: (useProductStore
                .getState()
                .allProducts ?? []).map((p) =>
                p._id === product._id
                  ? {
                      ...p,
                      appearance: {
                        ...p.appearance,
                        images_src: lstImages,
                      },
                    }
                  : p
              ),
            });
            localStorage.setItem("SelectedProductId", product._id);
            router.push(`/detail-product`);
          }}
          className="w-full items-center justify-items-center relative h-full block cursor-pointer active:opacity-40 hover:opacity-70"
        >
          <div className="w-full overflow-hidden">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-64 w-full">
                <ImSpinner9
                  size={32}
                  className="animate-spin text-stone-600 mb-2"
                />
                <span className="text-stone-600 text-sm">
                  Loading images...
                </span>
              </div>
            ) : (
              <Swiper
                modules={[Autoplay]}
                autoplay={{ delay: 3000 }}
                className="mySwiper "
              >
                {lstImages.map((image, index) => {
                  const imageUrl = URL.createObjectURL(image);
                  return (
                    <SwiperSlide key={index}>
                      <div className="w-full h-64 rounded-xl overflow-hidden relative">
                        <Image
                          src={imageUrl}
                          alt="pic of the vehicle"
                          fill
                          style={{
                            objectFit: "contain",
                            borderRadius: "0.75rem",
                          }}
                          sizes="176px"
                          priority={index === 0}
                          unoptimized
                        />
                        <div className="absolute right-1 bottom-14 flex space-x-1 bg-[#3636368c] px-1 rounded-lg bg-opacity-45 shadow-black shadow-lg">
                          <BsCameraFill color="white" size={14} />
                          <p className="text-white text-xs">
                            {index + 1}/{lstImages.length}
                          </p>
                        </div>
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            )}
          </div>

          <div className="w-full items-center justify-center px-1 mx-auto align-middle flex flex-col absolute bottom-[55px]">
            <div className="justify-evenly z-40 align-middle items-center flex w-full  bg-[#2a1f077f] px-1 bg-opacity-80 rounded-full ">
              <p className="w-4/12 text-center text-white text-xs">
                {product.appearance.color}
              </p>
              <p className="w-4/12 text-center text-white text-xs">
                {product.appearance.size}
              </p>
              <p className="w-4/12 text-center text-white text-xs">
                {useInvoiceStore
                  .getState()
                  .allInvoices.find(
                    (invoice) =>
                      Array.isArray(invoice.cart) &&
                      invoice.cart.some(
                        (item) => item.product_id === product._id
                      )
                  )
                  ?.cart.find((item) => item.product_id === product._id)
                  ?.quantity || 0}{" "}
                / {product.pricing.purchase_quantity}
              </p>
            </div>
          </div>
          <p className="absolute text-center z-40 w-full bottom-6 text-2xl bg-[#ffffff55]">
            {new Intl.NumberFormat("en-ZA", {
              style: "currency",
              currency: "ZAR",
            }).format(
              (product.pricing.sale_price *
                (useInvoiceStore
                  .getState()
                  .allInvoices.find(
                    (invoice) =>
                      Array.isArray(invoice.cart) &&
                      invoice.cart.some(
                        (item) => item.product_id === product._id
                      )
                  )
                  ?.cart.find((item) => item.product_id === product._id)
                  ?.quantity || 1
                  ? useInvoiceStore
                      .getState()
                      .allInvoices.find(
                        (invoice) =>
                          Array.isArray(invoice.cart) &&
                          invoice.cart.some(
                            (item) => item.product_id === product._id
                          )
                      )
                      ?.cart.find((item) => item.product_id === product._id)
                      ?.quantity || 1
                  : 1)) /
                100
            )}
          </p>
        </button>

        {useInvoiceStore
          .getState()
          .allInvoices.find(
            (invoice) =>
              Array.isArray(invoice.cart) &&
              invoice.cart.some((item) => item.product_id === product._id)
          )
          ?.cart.find((item) => item.product_id === product._id)?.quantity ===
        product.pricing.purchase_quantity ? (
          <p className="text-red-700 font-bold text-center w-full mt-[-24px] z-40">
            OUT OF STOCK
          </p>
        ) : (
          <div className="w-full bottom-2 justify-center items-center align-middle flex">
            <button
              onClick={handleAddToCart}
              disabled={isLoadingBut}
              className="absolute max-w-11/12 z-40 w-full gap-3 border-white border shadow-black shadow-xl hover:bg-stone-400 bg-stone-700 rounded-full bottom-2 active:opacity-60 flex justify-center items-center align-middle"
            >
              {isLoadingBut ? (
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
