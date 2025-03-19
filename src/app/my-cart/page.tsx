"use client";
import { Cart } from "@/data-types/cart";
import Image from "next/image";
import { toast, Toaster } from "sonner";
import {
  IoArrowBackCircleSharp,
  IoArrowForwardCircleSharp,
} from "react-icons/io5";
import { useEffect, useState } from "react";
import { formatCurrency } from "@/utils/util";
import { ImSpinner9 } from "react-icons/im";
import axios from "axios";
import { MdDeleteForever } from "react-icons/md";
import { useSelectedMode } from "@/contexts/SelectionModeContext";
import { useCart } from "@/contexts/CartContext";
import { useUser } from "@/contexts/UserContext";
import { Product } from "@/data-types/product";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function MyCart() {
  const { user } = useUser();
  const { cartCount } = useCart();

  const { data: allProducts } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await axios.get<Product[]>("/api/all-products");
      return response.data;
    },
  });

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
    if (cartCount > 0) {
      refetch();
    }
  }, [cartCount, refetch]);

  if (allCart?.length === 0)
    return (
      <div className="max-w-7xl w-full items-center align-middle justify-center mx-auto flex-wrap rounded-xl mt-10 pt-10 ">
        <p className="text-3xl font-bold text-red-700 text-center">
          Cart is empty...
        </p>
        <p className=" text-stone-500 text-center">Add product(s) to Cart</p>
      </div>
    );

  return (
    <div className="w-full flex-1 min-h-screen bg-stone-200">
      <div className="flex w-full max-w-7xl space-y-5 justify-items-center align-middle mx-auto mt-10 pt-10 gap-4 flex-wrap justify-center flex-1 bg-stone-200">
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
                  {totalQuantity(allCart || [])}
                </span>
                )
              </p>
            </div>
            <div className="border border-b-stone-200 w-full"></div>
            {allCart?.map((item, index) => (
              <CartItem
                item={item}
                key={index}
                index={index + 1}
                refetch={refetch}
              />
            ))}
          </div>
        </div>
        <Toaster richColors position="top-center" />
        <div className="max-w-[400px] w-full">
          <div className="justify-items-center align-middle mx-auto max-w-[400px] py-2 w-full bg-stone-500 shadow-stone-400 shadow-lg rounded-lg">
            <p className="text-white font-bold">Cart Summary</p>
            <div className="border border-b-stone-200 w-full"></div>
            <div className="w-full px-4 ">
              <div className="flex justify-between items-center align-middle">
                <p className="text-white">Sub-Total</p>
                <p className="text-white">
                  {formatCurrency(
                    totalAmount(allCart || [], allProducts || [])
                  )}
                </p>
              </div>
            </div>
            <div className="w-full px-4 bg-stone-600 bg-opacity-45">
              <div className="flex justify-between items-center align-middle">
                <p className="text-white">Tax (@ 15%)</p>
                <p className="text-white">
                  {formatCurrency(
                    totalAmount(allCart || [], allProducts || []) * 0.15
                  )}
                </p>
              </div>
            </div>
            <div className="w-full px-4 ">
              <div className="flex justify-between items-center align-middle font-bold">
                <p className="text-white">Grand Total</p>
                <p className="text-white">
                  {formatCurrency(
                    totalAmount(allCart || [], allProducts || []) * 0.15 +
                      totalAmount(allCart || [], allProducts || [])
                  )}
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
    </div>
  );
}

interface CartItemProps {
  item: Cart;
  index: number;
  refetch: () => void; // Pass refetch as a prop
}
function CartItem({ item, index, refetch }: CartItemProps) {
  const { setSelectedProductId } = useSelectedMode();
  const { setCart } = useCart();
  const { user } = useUser();
  const router = useRouter();

  const { data: allProducts } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await axios.get<Product[]>("/api/all-products");
      return response.data;
    },
  });

  const [product, setProduct] = useState(
    allProducts?.find((i) => i._id === item.product_id)
  );
  const [loadin, setLoadin] = useState({
    isLoading: false,
    action: "INCREAMENT",
  });
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDeleteCart() {
    setIsDeleting(true);
    try {
      const response = await axios.post<Cart[]>("/api/cart/delete-cart", {
        _id: item._id,
        user_id: item.user_id,
      });
      setProduct({ ...product!, purchace_quantity: 0 });
      setCart(response.data);
      toast.success("Successfully deleted Cart Item");
      refetch(); // Refetch data after deletion
    } catch (error) {
      toast.error("Failed to delete Cart Item", error || "");
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleUpdateDecrease() {
    setLoadin({ isLoading: true, action: "DECREAMENT" });
    
    try {
      const response = await axios.post<Cart[]>("/api/cart/add-cart", {
        product_id: product?._id,
        quantity: item.quantity - 1,
        user_id: user._id,
        action: "DECREAMENT",
      });
      setCart(response.data);
      toast.success("SUCCESSFUL: Updated cart");
      refetch(); // Refetch data after decreasing quantity
    } catch (error) {
      toast.error("FAILED: Did not update cart!!!", error || "");
    } finally {
      setLoadin({ isLoading: false, action: "DECREAMENT" });
    }
  }

  async function handleUpdateIncrease() {
    setLoadin({ isLoading: true, action: "INCREAMENT" });

    try {
      const response = await axios.post<Cart[]>("/api/cart/add-cart", {
        product_id: product?._id,
        quantity: item.quantity + 1,
        user_id: user._id,
        action: "INCREAMENT",
      });
      setProduct({ ...product!, purchace_quantity: item.quantity + 1 });
      setCart(response.data);
      toast.success("SUCCESSFUL: Updated cart");
      refetch(); // Refetch data after increasing quantity
    } catch (error) {
      toast.error("FAILED: Did not update cart!!!", error || "");
    } finally {
      setLoadin({ isLoading: false, action: "INCREAMENT" });
    }
  }

  return (
    <div className="w-full">
      <div className="w-full p-2">
        <div className="flex w-full bg-stone-200 rounded-xl p-2 shadow-md shadow-stone-400">
          <p className="">{index}.</p>

          <button
            onClick={(e) => {
              e.preventDefault(); // Prevent default navigation
              setSelectedProductId(product?._id||''); // Set the selected product ID
              router.push("/view-product"); // Navigate programmatically
            }}
            className="w-2/12 justify-center align-middle items-center flex"
          >
            <Image
              src={product?.image_src || "/public/icons/avatar-icon.png"}
              alt="pic of the item"
              width={80}
              height={80}
              className="w-20 h-20 shadow-md shadow-stone-500 rounded-full align-middle items-center justify-center"
            />
          </button>
          <div className="w-8/12 items-center align-middle justify-center">
            <p className="sm:text-lg font-bold">
              {product?.color} {product?.make} {product?.model}
            </p>
            <p className="italic w-full text-stone-400">
              {product?.category} | {product?.sub_category}
            </p>
            <p className="italic text-stone-500 w-full text-ellipsis whitespace-break-spaces overflow-hidden h-10 hidden sm:block">
              {product?.description}
            </p>
          </div>
          <div className="w-3/12 items-center align-middle justify-center">
            <p className="italic w-full text-center text-stone-400">Quantity</p>
            <div className="items-center align-middle justify-center flex">
              <button
                disabled={item.quantity === 1}
                onClick={handleUpdateDecrease}
                className={`hover:opacity-70 active:opacity-40 ${
                  item.quantity === 1 &&
                  "text-stone-300 active:opacity-100 hover:opacity-100"
                }`}
              >
                {loadin.isLoading && loadin.action === "DECREAMENT" ? (
                  <ImSpinner9 className="animate-spin" size={40} />
                ) : (
                  <IoArrowBackCircleSharp size={40} />
                )}
              </button>
              <p className="w-4/12 text-center ">
                {item.quantity}/{product?.stock_quantity}
              </p>
              <button
                disabled={item.quantity === product?.stock_quantity}
                onClick={handleUpdateIncrease}
                className={`hover:opacity-70 active:opacity-40 ${
                  item.quantity === product?.stock_quantity &&
                  "text-stone-300 active:opacity-100 hover:opacity-100"
                }`}
              >
                {loadin.isLoading && loadin.action === "INCREAMENT" ? (
                  <ImSpinner9 className="animate-spin" size={40} />
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
              {formatCurrency(
                (product?.sale_price ? product?.sale_price : 1) *
                  (product?.purchace_quantity || 1)
              )}
            </p>
          </div>
          <button
            onClick={handleDeleteCart}
            className="relative right-0 top-0 mt-[-50] hover:opacity-70 active:opacity-40"
          >
            {isDeleting ? (
              <div>deleting...</div>
            ) : (
              <MdDeleteForever size={30} color="red" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function totalQuantity(cart: Cart[]) {
  return cart.reduce((acc, item) => acc + item.quantity, 0);
}

function totalAmount(cart: Cart[], allProducts: Product[]) {
  return cart.reduce(
    (acc, item) =>
      acc +
      item.quantity *
        allProducts.find((pro) => item.product_id === pro._id)!.sale_price,
    0
  );
}
