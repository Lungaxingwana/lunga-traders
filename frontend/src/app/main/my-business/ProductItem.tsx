"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { FaShoppingCart } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { Product } from "../../../data-types/product.type";
import { useRouter } from "next/navigation";
import { useProductStore } from "../../../stores/useProductStore";
import { useEffect, useState } from "react";
import { useSelectedModeStore } from "../../../stores/useSelectedModeStore";
import Image from "next/image";

interface ProductItemProps {
  product: Product;
}

export default function ProductItem({ product }: ProductItemProps) {
  const router = useRouter();
  const [lstImages, setLstImages] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { deleteProduct } = useProductStore();

  useEffect(() => {
    // Only fetch images if they do not exist
    if (
      product.appearance.images_src &&
      product.appearance.images_src.length > 0
    ) {
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
  }, [
    product._id,
    product.appearance.images_src,
    product.appearance.images_src_id,
  ]);

  const handleAddToCart = async () => {
    console.log("Adding to cart:", product);
  };

  const handleRemoveProduct = async () => {
    deleteProduct(product._id);
  };

  return (
    <div className="w-[160px] h-64 p-2">
      <div className="w-full h-full bg-white rounded-xl border border-neutral-400 flex flex-col items-center shadow-black shadow-md">
        <p className="text-stone-800 font-bold">{product.general.make}</p>
        <p className="opacity-50 text-xs text-center">
          {product.general.model}
        </p>
        <MdDeleteForever
          onClick={handleRemoveProduct}
          className="w-7 h-7 ml-28 z-30  text-red-600 absolute hover:opacity-70 active:opacity-30 cursor-pointer"
          size={40}
        />
        <div
          className="relative w-full h-48 hover:opacity-70 cursor-pointer active:opacity-40"
          style={{ minHeight: 192, position: "relative" }} // Ensure parent is relative for fill
          onClick={() => {
            requestAnimationFrame(() => {
              useSelectedModeStore.setState({
                selectedProduct: {
                  ...product,
                  appearance: { ...product.appearance, images_src: lstImages },
                },
              });
              localStorage.setItem("SelectedProductId", product._id);
              router.push(`/product-detail`);
            });
          }}
        >
          {isLoading ? (
            <div className="flex flex-col gap-x-2 items-center justify-center align-middle h-full">
              <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black"></span>
              <p className="text-gray-500 mt-4">Loading images...</p>
            </div>
          ) : (
            <Swiper
              modules={[Autoplay]}
              autoplay={{ delay: 3000 }}
              loop={true}
              className="mySwiper"
            >
              {lstImages?.map((image, index) => (
                <SwiperSlide key={index}>
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "192px",
                    }}
                  >
                    <Image
                      src={URL.createObjectURL(image)}
                      alt={`Bespoke T-Shirt ${index + 1}`}
                      fill
                      style={{ objectFit: "contain", borderRadius: "0.75rem" }}
                      sizes="176px"
                      priority={index === 0}
                      unoptimized
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
        <div className="relative w-full flex flex-col items-center justify-center z-10">
          <p className="absolute bottom-5 font-bold text-2xl text-white w-full text-center bg-[#38210371]">
            {new Intl.NumberFormat("en-ZA", {
              style: "currency",
              currency: "ZAR",
            }).format(product.pricing.sale_price / 100)}
          </p>
        </div>
        <div className="relative w-full flex flex-col items-center justify-center z-10 ">
          <div className=" items-center justify-center  bottom-0 absolute">
            <button
              type="button"
              onClick={handleAddToCart}
              className="bg-gradient-to-r from-stone-800 to-stone-500 text-white shadow shadow-black border rounded-full px-4 hover:opacity-70 active:opacity-40 w-full cursor-pointer flex items-center justify-center gap-x-2"
            >
              <FaShoppingCart className="w-4 h-4" />
              <span className="text-xs">Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
