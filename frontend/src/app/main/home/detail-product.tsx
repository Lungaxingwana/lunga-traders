"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
// @ts-expect-error: Importing CSS file for Swiper, which TypeScript does not recognize
import "swiper/css";
import { useState, useRef, useEffect } from "react";
import { BsCameraFill } from "react-icons/bs";
import SwiperCore from "swiper";
import { motion } from "framer-motion";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";
import { ImSpinner9 } from "react-icons/im";
import type { Product } from "../../../data-types/product.type";
import { useAuthStore } from "../../../stores/useAuthStore";
import { useInvoiceStore } from "../../../stores/useInvoiceStore";
import { useProductStore } from "../../../stores/useProductStore";
import { useSelectedModeStore } from "../../../stores/useSelectedModeStore";

export default function DetailProduct() {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const swiperRef = useRef<SwiperCore | null>(null);
  const { authUser } = useAuthStore();

  // Get product and images from Zustand store (Next.js compatible)
  // const product = useSelectedModeStore.getState().selectedProduct;
  // const initialLstImages = product?.appearance?.images_src || [];
  const { allProducts } = useProductStore();
  const [product, setProduct] = useState<Product>();
  const [lstImages, setLstImages] = useState<(string | File)[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const {
    allInvoices,
    addInvoice,
    updateInvoice,
    isAddingInvoice,
    isUpdatingInvoice,
    removeInvoice,
  } = useInvoiceStore();

  const [quantityMode, setQuantityMode] = useState<"increase" | "decrease">(
    "increase"
  );

  useEffect(() => {
    // Try to get selectedProductId from localStorage
    const selectedProductId =
      typeof window !== "undefined"
        ? localStorage.getItem("SelectedProductId")
        : null;
    let foundProduct: Product | undefined = undefined;
    if (selectedProductId && allProducts?.length) {
      foundProduct = allProducts.find((p) => p._id === selectedProductId);
    }
    let prod = foundProduct;
    if (!prod) {
      // fallback to Zustand store if not found in localStorage
      prod = useSelectedModeStore.getState().selectedProduct ?? undefined;
    }
    setProduct(prod);

    // Handle images
    if (prod?.appearance?.images_src && prod.appearance.images_src.length > 0) {
      setLstImages(prod.appearance.images_src);
      setIsLoadingImages(false);
    } else if (
      prod?.appearance?.images_src_id &&
      prod.appearance.images_src_id.length > 0
    ) {
      setIsLoadingImages(true);
      const fetchImages = async () => {
        const images: File[] = [];
        for (const id of prod.appearance.images_src_id ?? []) {
          try {
            const res = await fetch(
              (import.meta.env.MODE === "development"
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
        setIsLoadingImages(false);

        // Update the product in useProductStore with the new images
        if (prod && prod._id) {
          useProductStore.setState({
            allProducts: (useProductStore.getState().allProducts ?? []).map((p) =>
              p._id === prod._id
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
        }
      };
      fetchImages();
    } else {
      setLstImages([]);
      setIsLoadingImages(false);
    }
  }, []);

  useEffect(() => {
    if (product && product.appearance?.images_src && product.appearance.images_src.length > 0) {
      setLstImages(product.appearance.images_src);
    }
    // eslint-disable-next-line
  }, [product?._id, product?.appearance?.images_src?.length, allProducts?.length]);

  if (!product) {
    return null; // Return null if no product is selected
  }

  const handleIncreaseCart = async () => {
    setQuantityMode("increase");
    try {
      const cart = allInvoices.find(
        (invoice) =>
          Array.isArray(invoice.cart) &&
          invoice.cart.some((item) => item.product_id === product._id)
      );
      if (cart) {
        // Update the cart item quantity or details as needed
        const updatedCart = cart.cart.map((item) =>
          item.product_id === product?._id
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
          product_id: product?._id,
          quantity: 1,
          size: product?.appearance.size,
          color: product?.appearance.color,
        };
        const newInvoice = {
          cart: [newCartItem],
          total: product?.pricing.sale_price,
          user_id: authUser?._id || "",
          total_amount:
            product?.pricing.sale_price * (product?.pricing.stock_quantity || 1),
          payment_status: "Unpaid" as const,
          delivery_method: "Own Collection" as const,
        };
        await addInvoice(newInvoice);
        console.log("Adding new item to cart:", newInvoice);
      }
    } catch (error) {
      console.error("Error adding/updating cart item:", error);
    }
  };

  const handleDecreaseCart = async () => {
    setQuantityMode("decrease");
    try {
      const cart = allInvoices.find(
        (invoice) =>
          Array.isArray(invoice.cart) &&
          invoice.cart.some((item) => item.product_id === product._id)
      );
      if (
        useInvoiceStore
          .getState()
          .allInvoices.find(
            (invoice) =>
              Array.isArray(invoice.cart) &&
              invoice.cart.some((item) => item.product_id === product._id)
          )
          ?.cart.find((item) => item.product_id === product._id)?.quantity === 1
      ) {
        await removeInvoice(cart?._id || "", product._id);
      } else {
        if (cart) {
          // Update the cart item quantity or details as needed
          const updatedCart = cart.cart.map((item) =>
            item.product_id === product?._id
              ? { ...item, quantity: Math.max(item.quantity - 1, 0) }
              : item
          );
          const updatedInvoice = {
            ...cart,
            cart: updatedCart,
          };
          await updateInvoice(updatedInvoice);
          console.log("Decreasing from cart:", updatedInvoice);
        }
      }
    } catch (error) {
      console.error("Error decreasing cart item:", error);
    }
  };

  return (
    <>
      <title>Lunga Traders | Product Detail</title>
      <motion.div
        className="min-h-screen items-center px-4 bg-gradient-to-br from-stone-400 via-stone-100 to-stone-300 py-16 flex flex-col"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
      >
        <h1 className="text-2xl font-bold mb-4 text-gray-800 mt-10 text-center">
          Product Detail
        </h1>
        <div className="flex flex-wrap items-center justify-center w-full max-w-7xl mx-auto gap-4">
          <div className="flex flex-wrap items-center justify-center w-full max-w-7xl mx-auto gap-4">
            <div className="max-w-[400px] w-full  bg-white shadow-neutral-600 shadow-lg rounded-xl overflow-hidden justify-center items-center align-middle flex">
              <div className="w-full justify-items-center align-middle justify-center flex flex-col">
                <div className="w-full overflow-hidden justify-center items-center align-middle justify-items-center">
                  {isLoadingImages ? (
                    <div className="flex flex-col items-center justify-center h-[500px] w-full">
                      <ImSpinner9 size={32} className="animate-spin text-stone-600 mb-2" />
                      <span className="text-stone-600 text-sm">Loading images...</span>
                    </div>
                  ) : (
                    <Swiper
                      modules={[Autoplay]}
                      autoplay={{ delay: 3000 }}
                      className="mySwiper"
                      onSwiper={(swiper) => (swiperRef.current = swiper)}
                    >
                      {lstImages.map((image, index) => (
                        <SwiperSlide key={index}>
                          <div
                            className="w-full h-[500px] rounded-xl overflow-hidden"
                            style={{ position: "relative" }}
                          >
                            <img
                              src={
                                typeof image === "string"
                                  ? image
                                  : image
                                  ? URL.createObjectURL(image)
                                  : ""
                              }
                              alt={`Product Image ${index + 1}`}
                              className="w-full h-full object-contain rounded-xl"
                              width={500}
                              height={500}
                              style={{
                                objectFit: "contain",
                                borderRadius: "0.75rem",
                                maxWidth: "100%",
                                maxHeight: "100%",
                                display: "block",
                                marginLeft: "auto",
                                marginRight: "auto",
                              }}
                            />
                            <div className="absolute left-1 bottom-2 flex space-x-1 bg-[#3636368c] px-1 rounded-lg bg-opacity-45 ">
                              <BsCameraFill color="white" size={22} />
                              <p className="text-white ">
                                {index + 1}/{lstImages.length}
                              </p>
                            </div>
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  )}
                </div>
                <div className="flex p-2 gap-2 overflow-visible flex-1 w-full justify-center items-center align-middle">
                  {lstImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedImageIndex(index);
                        swiperRef.current?.slideTo(index);
                      }}
                      className={`w-[60px] h-[60px] cursor-pointer active:opacity-40 border-1 hover:opacity-70 shadow-black shadow-lg rounded-xl overflow-hidden justify-center align-middle items-center justify-items-center ${
                        selectedImageIndex === index
                          ? "ring-2 ring-stone-700"
                          : ""
                      }`}
                    >
                      <img
                        src={
                          typeof image === "string"
                            ? image
                            : image
                            ? URL.createObjectURL(image)
                            : ""
                        }
                        alt={`Thumbnail ${index + 1}`}
                        className="rounded-xl w-full h-full object-cover"
                        width={60}
                        height={60}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 max-w-[400px] w-full">
              <div className="max-w-[400px] w-full bg-white shadow-neutral-600 shadow-lg  rounded-xl overflow-hidden justify-center items-center align-middle flex">
                <div className="p-4 text-center">
                  <p className="text-gray-700 font-bold text-2xl">
                    {product?.general.make}
                  </p>
                  <p className="text-gray-700 font-bold text-2xl">
                    {product?.general.model}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Year: {product?.general.year}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Size: {product?.appearance.size}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Color: {product?.appearance.color}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Category: {product?.general.category}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Sub Category: {product?.general.sub_category}
                  </p>
                  <p className="text-2xl font-semibold text-gray-700">
                    Sale Price:{" "}
                    {new Intl.NumberFormat("en-ZA", {
                      style: "currency",
                      currency: "ZAR",
                    }).format(
                      ((product?.pricing.sale_price || 0) / 100) *
                        (
                          useInvoiceStore
                            .getState()
                            .allInvoices.find(
                              (invoice) =>
                                Array.isArray(invoice.cart) &&
                                invoice.cart.some(
                                  (item) => item.product_id === product._id
                                )
                            )
                            ?.cart.find((item) => item.product_id === product._id)
                            ?.quantity || 0
                        )
                    )}
                  </p>
                  <p className="text-lg text-gray-700">
                    Original Price:{" "}
                    <span className="line-through">
                      {new Intl.NumberFormat("en-ZA", {
                        style: "currency",
                        currency: "ZAR",
                      }).format(
                        ((product?.pricing.original_price || 0) / 100) *
                          (
                            useInvoiceStore
                              .getState()
                              .allInvoices.find(
                                (invoice) =>
                                  Array.isArray(invoice.cart) &&
                                  invoice.cart.some(
                                    (item) => item.product_id === product._id
                                  )
                              )
                              ?.cart.find((item) => item.product_id === product._id)
                              ?.quantity || 0
                          )
                      )}
                    </span>
                  </p>
                  {authUser && <div className="w-full justify-evenly items-center align-middle flex ">
                    <button
                      onClick={handleDecreaseCart}
                      className={`shadow-black bg-stone-300 ${
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
                          ?.quantity === 0) || !useInvoiceStore
                          .getState()
                          .allInvoices.find(
                            (invoice) =>
                              Array.isArray(invoice.cart) &&
                              invoice.cart.some(
                                (item) => item.product_id === product._id
                              )
                          )
                          ?.cart.find((item) => item.product_id === product._id) && "opacity-30"
                      } shadow-lg rounded-full border border-black hover:bg-stone-500 active:opacity-40`}
                      disabled={
                        useInvoiceStore
                          .getState()
                          .allInvoices.find(
                            (invoice) =>
                              Array.isArray(invoice.cart) &&
                              invoice.cart.some(
                                (item) => item.product_id === product._id
                              )
                          )
                          ?.cart.find((item) => item.product_id === product._id)
                          ?.quantity === 0
                      }
                    >
                      {(isAddingInvoice || isUpdatingInvoice) &&
                      quantityMode === "decrease" ? (
                        <ImSpinner9
                          size={30}
                          className="text-stone-600 animate-spin"
                        />
                      ) : (
                        <FaArrowAltCircleLeft
                          size={40}
                          className="text-stone-600"
                        />
                      )}
                    </button>

                    <div className="max-w-[80px] w-full h-[40px] bg-white shadow-black shadow-lg  rounded overflow-hidden justify-center items-center align-middle flex">
                      <p className="text-2xl">
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
                          ?.quantity
                          ? useInvoiceStore
                              .getState()
                              .allInvoices.find(
                                (invoice) =>
                                  Array.isArray(invoice.cart) &&
                                  invoice.cart.some(
                                    (item) => item.product_id === product._id
                                  )
                              )
                              ?.cart.find(
                                (item) => item.product_id === product._id
                              )?.quantity
                          : 0}
                        /{product.pricing.purchase_quantity}
                      </p>
                    </div>
                    <button
                      onClick={handleIncreaseCart}
                      className={`shadow-black shadow-lg rounded-full ${
                        useInvoiceStore
                          .getState()
                          .allInvoices.find(
                            (invoice) =>
                              Array.isArray(invoice.cart) &&
                              invoice.cart.some(
                                (item) => item.product_id === product._id
                              )
                          )
                          ?.cart.find((item) => item.product_id === product._id)
                          ?.quantity === product.pricing.purchase_quantity &&
                        "opacity-30"
                      } border border-black hover:bg-stone-500 active:opacity-40`}
                      disabled={
                        useInvoiceStore
                          .getState()
                          .allInvoices.find(
                            (invoice) =>
                              Array.isArray(invoice.cart) &&
                              invoice.cart.some(
                                (item) => item.product_id === product._id
                              )
                          )
                          ?.cart.find((item) => item.product_id === product._id)
                          ?.quantity === product.pricing.purchase_quantity
                      }
                    >
                      {(isAddingInvoice || isUpdatingInvoice) &&
                      quantityMode === "increase" ? (
                        <ImSpinner9
                          size={30}
                          className="text-stone-600 animate-spin"
                        />
                      ) : (
                        <FaArrowAltCircleRight
                          size={40}
                          className="text-stone-600"
                        />
                      )}
                    </button>
                  </div>}
                </div>
              </div>
              <div className="max-w-[400px] w-full bg-white shadow-neutral-600 shadow-lg  rounded-xl overflow-hidden items-center align-middle flex">
                <div className="p-4 text-center">
                  <p className="text-sm text-gray-500 mt-2">
                    <span className="font-bold">Features:</span>{" "}
                    {product?.general.tags}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    <span className="font-bold">Description:</span>{" "}
                    {product?.general.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
