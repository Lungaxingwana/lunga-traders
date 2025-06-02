"use client";
import { Invoice } from "@/data-types/invoice.type";
import { useProductStore } from "@/stores/useProductStore";
import { useSelectedModeStore } from "@/stores/useSelectedModeStore";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { ImSpinner9 } from "react-icons/im";
import {
  IoArrowBackCircleSharp,
  IoArrowForwardCircleSharp,
} from "react-icons/io5";
import { MdDeleteForever } from "react-icons/md";
import { Product } from "@/data-types/product.type";
import { useInvoiceStore } from "@/stores/useInvoiceStore";

interface CartItemProps {
  item: Invoice["cart"][number]; // single cart item, not array
  index: number;
  id: string; // id of the invoice
}
export function CartItem({ item, index, id }: CartItemProps) {
  const { removeInvoice } = useInvoiceStore();
  const router = useRouter();
  const product = useProductStore.getState().allProducts?.find((p) => p._id === item.product_id) as
    | Product
    | undefined;
  const [loadin, setLoadin] = useState<{
    isLoading: boolean;
    action: "INCREAMENT" | "DECREAMENT";
  }>({
    isLoading: false,
    action: "INCREAMENT",
  });
  const [displayImage, setDisplayImage] = useState<string | undefined>(undefined);
  const [isImgLoading, setIsImgLoading] = useState(false);

  useEffect(() => {
    // If product image exists, use it, else fetch from backend
    if (product?.appearance?.images_src?.[0]) {
      if (typeof product.appearance.images_src[0] === "string") {
        setDisplayImage(product.appearance.images_src[0]);
      } else {
        setDisplayImage(URL.createObjectURL(product.appearance.images_src[0]));
      }
    } else if (
      product?.appearance?.images_src_id &&
      product.appearance.images_src_id.length > 0
    ) {
      setIsImgLoading(true);
      const id = product.appearance.images_src_id[0];
      fetch(
        (process.env.NODE_ENV === "development"
          ? "http://localhost:5002/api"
          : "/api") + `/images/get-image/${id}`,
        {
          method: "GET",
          credentials: "include",
        }
      )
        .then(async (res) => {
          if (res.ok) {
            const blob = await res.blob();
            setDisplayImage(URL.createObjectURL(blob));
          }
        })
        .finally(() => setIsImgLoading(false));
    } else {
      setDisplayImage(undefined);
    }
  }, [product]);

  const handleUpdateDecrease = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLoadin({
      isLoading: true,
      action: "DECREAMENT",
    });
    try {
      if (item.quantity > 1) {
        const allInvoices = useInvoiceStore.getState().allInvoices;
        const invoice = allInvoices.find((inv) => inv._id === id);
        if (invoice) {
          const updatedCart = invoice.cart.map((cartItem) =>
            cartItem.product_id === item.product_id
              ? { ...cartItem, quantity: cartItem.quantity - 1 }
              : cartItem
          );
          const updatedInvoice = { ...invoice, cart: updatedCart };
          await useInvoiceStore.getState().updateInvoice(updatedInvoice);
        }
      }
    } catch {
      // Optionally handle error
    } finally {
      setLoadin({
        isLoading: false,
        action: "DECREAMENT",
      });
    }
  };

  const handleUpdateIncrease = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLoadin({
      isLoading: true,
      action: "INCREAMENT",
    });
    try {
      const allInvoices = useInvoiceStore.getState().allInvoices;
      const updateInvoice = useInvoiceStore.getState().updateInvoice;
      const addInvoice = useInvoiceStore.getState().addInvoice;
      const authUser = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("authUser") || "{}") : {};
      const productStoreProduct = product;

      // Find if invoice exists for this product
      const cart = allInvoices.find(
        (invoice) =>
          Array.isArray(invoice.cart) &&
          invoice.cart.some((cartItem) => cartItem.product_id === item.product_id)
      );

      if (cart) {
        // Update the cart item quantity or details as needed
        const updatedCart = cart.cart.map((cartItem) =>
          cartItem.product_id === item.product_id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
        const updatedInvoice = {
          ...cart,
          cart: updatedCart,
        };
        await updateInvoice(updatedInvoice);
      } else if (productStoreProduct) {
        // Create a new cart item
        const newCartItem = {
          product_id: productStoreProduct._id,
          quantity: 1,
          size: productStoreProduct.appearance.size,
          color: productStoreProduct.appearance.color,
        };
        const newInvoice = {
          cart: [newCartItem],
          total: productStoreProduct.pricing.sale_price,
          user_id: authUser?._id || "",
          total_amount:
            productStoreProduct.pricing.sale_price * productStoreProduct.pricing.stock_quantity,
          payment_status: "Unpaid" as const,
          delivery_method: "Own Collection" as const,
        };
        await addInvoice(newInvoice);
      }
    } catch {
      // Optionally handle error
    } finally {
      setLoadin({
        isLoading: false,
        action: "INCREAMENT",
      });
    }
  };

  const handleDeleteCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    await removeInvoice(id || "", item.product_id || "");
  };

  return (
    <div className="w-full">
      <div className="w-full p-2">
        <div className="flex w-full bg-stone-200 rounded-xl p-2 shadow-md shadow-stone-400">
          <p className="">{index}.</p>
          <button
            onClick={(e) => {
              e.preventDefault();
              useSelectedModeStore.setState({
                selectedProduct: product ?? null,
              });
              localStorage.setItem("SelectedProductId", product?._id || "");
              router.push("/detail-product");
            }}
            className="w-2/12 justify-center align-middle cursor-pointer items-center flex"
          >
            <div className="relative w-20 h-20">
              {isImgLoading ? (
                <div className="w-20 h-20 flex items-center justify-center">
                  <ImSpinner9 className="animate-spin" size={32} />
                </div>
              ) : displayImage ? (
                <Image
                  priority
                  src={displayImage}
                  alt="pic of the item"
                  fill
                  style={{
                    objectFit: "contain",
                    borderRadius: "9999px",
                  }}
                  sizes="80px"
                  unoptimized
                />
              ) : (
                <Image
                  src="/background/both_avatar.jpg"
                  alt="pic of the item"
                  width={80}
                  height={80}
                  className="w-20 h-20 shadow-md shadow-stone-500 rounded-full align-middle items-center justify-center"
                />
              )}
            </div>
          </button>
          <div className="w-8/12 items-center align-middle justify-center">
            <p className="sm:text-lg font-bold">
              {product?.appearance.color} {product?.general.make}{" "}
              {product?.general.model}
            </p>
            <p className="italic w-full text-stone-400">
              {product?.general.category} | {product?.general.sub_category}
            </p>
            <p className="italic text-stone-500 w-full text-ellipsis whitespace-break-spaces overflow-hidden h-10 hidden sm:block">
              {product?.general.description}
            </p>
          </div>
          <div className="w-3/12 items-center align-middle justify-center">
            <p className="italic w-full text-center text-stone-400">Quantity</p>
            <div className="items-center align-middle justify-center flex">
              <button
                disabled={item.quantity === 1}
                onClick={handleUpdateDecrease}
                className={`hover:opacity-70 cursor-pointer active:opacity-40 ${
                  item.quantity === 1 &&
                  "text-stone-300 active:opacity-100 hover:opacity-100"
                }`}
              >
                {loadin.isLoading && loadin.action === "DECREAMENT" ? (
                  <ImSpinner9 className="animate-spin" size={30} />
                ) : (
                  <IoArrowBackCircleSharp size={40} />
                )}
              </button>
              <p className="w-4/12 text-center ">
                {item.quantity || 0}/{product?.pricing.purchase_quantity}
              </p>
              <button
                disabled={item.quantity === product?.pricing.stock_quantity}
                onClick={handleUpdateIncrease}
                className={`hover:opacity-70 cursor-pointer active:opacity-40 ${
                  item.quantity === product?.pricing.stock_quantity &&
                  "text-stone-300 active:opacity-100 hover:opacity-100"
                }`}
              >
                {loadin.isLoading && loadin.action === "INCREAMENT" ? (
                  <ImSpinner9 className="animate-spin" size={30} />
                ) : (
                  <IoArrowForwardCircleSharp size={40} />
                )}
              </button>
            </div>
          </div>
          <div className="w-3/12 items-baseline align-baseline justify-end content-end right-0">
            <p className="italic w-full text-stone-400 text-right">
              Total Price
            </p>
            <p className="sm:font-bold sm:text-xl text-right">
              {new Intl.NumberFormat("en-ZA", {
                style: "currency",
                currency: "ZAR",
              }).format(
                (product?.pricing.sale_price
                  ? product?.pricing.sale_price
                  : 1) * (item.quantity || 1) / 100
              )}
            </p>
          </div>
          <button
            onClick={handleDeleteCart}
            className="relative right-0 top-0 mt-[-50] hover:opacity-70 active:opacity-40"
          >
              <MdDeleteForever size={30} color="red" />
          </button>
        </div>
      </div>
    </div>
  );
}
