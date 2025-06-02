"use client";
import { useInvoiceStore } from "@/stores/useInvoiceStore";
import { Invoice } from "@/data-types/invoice.type";
import { CartItem } from "./CartItem";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useProductStore } from "@/stores/useProductStore";
import { motion } from "framer-motion";

export default function MyCart() {
  const [cartQuantitySum, setCartQuantitySum] = useState(0);
  const [cartSubTotal, setCartSubTotal] = useState(0);
  const [cartTax, setCartTax] = useState(0);
  const { authUser } = useAuthStore();

  const allInvoices = useInvoiceStore.getState().allInvoices;

  useEffect(() => {
    const sum = allInvoices.reduce((acc, invoice) => {
      const cart = (invoice as Invoice).cart || [];
      return acc + (Array.isArray(cart) ? cart.reduce((itemAcc, t) => itemAcc + (t.quantity || 0), 0) : 0);
    }, 0);
    setCartQuantitySum(sum);

    // Calculate subtotal
    const subtotal = allInvoices.reduce((acc, invoice) => {
      const cart = (invoice as Invoice).cart || [];
      return (
        acc +
        (Array.isArray(cart)
          ? cart.reduce(
              (itemAcc, t) =>
                itemAcc +
                ((useProductStore.getState().allProducts?.find(p=>p._id===t.product_id)?.pricing?.sale_price || 0) * (t.quantity || 0)) / 100,
              0
            )
          : 0)
      );
    }, 0);
    setCartSubTotal(subtotal);
    setCartTax(subtotal * 0.15);
  }, [allInvoices, authUser]);

  return (
    <motion.div
      className="min-h-screen items-center px-4 bg-gradient-to-br from-stone-400 via-stone-100 to-stone-300 py-16 flex flex-col"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
    >
      <div className="flex w-full max-w-7xl space-y-5 justify-items-center align-middle mx-auto  pt-10 gap-4 flex-wrap justify-center flex-1 ">
        <div className="flex w-full">
          <div className="justify-items-center align-middle mx-auto w-full bg-white shadow-stone-400 shadow-lg rounded-lg">
            <p className="text-2xl text-center w-full font-bold py-1">
              My Cart
            </p>
            <div className="border border-b-stone-200 w-full"></div>
            <div className="flex justify-between w-full px-4">
              <p>
                Items in your <span className="font-bold">Cart</span>
              </p>
              <p>
                Items (
                <span className="font-bold">
                  {cartQuantitySum || 0}
                </span>
                )
              </p>
            </div>
            <div className="border border-b-stone-200 w-full"></div>
            {useInvoiceStore.getState().allInvoices.find((invoice) => invoice.cart && invoice.cart.length > 0) ? (
              useInvoiceStore.getState().allInvoices.flatMap((invoice, invoiceIdx) =>
                (invoice.cart || []).map((cartItem, cartIdx) => (
                  <CartItem
                    item={cartItem}
                    key={`${invoiceIdx}-${cartIdx}`}
                    index={cartIdx + 1}
                    id={invoice._id || ""}
                  />
                ))
              )
            ) : null}
          </div>
        </div>
        <div className="max-w-[400px] w-full">
          <div className="justify-items-center align-middle mx-auto max-w-[400px] py-2 w-full bg-stone-500 shadow-stone-400 shadow-lg rounded-lg">
            <p className="text-white font-bold">Cart Summary</p>
            <div className="border border-b-stone-200 w-full"></div>
            <div className="w-full px-4 ">
              <div className="flex justify-between items-center align-middle">
                <p className="text-white">Sub-Total</p>
                <p className="text-white">
                  {new Intl.NumberFormat("en-ZA", {
                    style: "currency",
                    currency: "ZAR",
                  }).format(cartSubTotal)}
                </p>
              </div>
            </div>
            <div className="w-full px-4 bg-stone-600 bg-opacity-45">
              <div className="flex justify-between items-center align-middle">
                <p className="text-white">Tax (@ 15%)</p>
                <p className="text-white">
                  {new Intl.NumberFormat("en-ZA", {
                    style: "currency",
                    currency: "ZAR",
                  }).format(cartTax)}
                </p>
              </div>
            </div>
            <div className="w-full px-4 ">
              <div className="flex justify-between items-center align-middle font-bold">
                <p className="text-white">Grand Total</p>
                <p className="text-white">
                  {new Intl.NumberFormat("en-ZA", {
              style: "currency",
              currency: "ZAR",
            }).format(cartSubTotal + cartTax)}
                </p>
              </div>
            </div>
            <div className="w-full px-4">
              <button className="w-full bg-white p-1 rounded-full bottom-2 shadow-black shadow-lg">
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
