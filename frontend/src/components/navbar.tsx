import { useState, useRef, useEffect } from "react";
import { FaUserCircle, FaSignOutAlt, FaHome } from "react-icons/fa";
import { useNavigate, type Location } from "react-router-dom";
import { useInvoiceStore } from "../stores/useInvoiceStore";
import type { Invoice } from "../data-types/invoice.type";
import { useAuthStore } from "../stores/useAuthStore";
import { useSelectedModeStore } from "../stores/useSelectedModeStore";

interface NavBarProps {
  pathname: Location["pathname"];
}
export default function Navbar({ pathname }: NavBarProps) {
  const [showPopup, setShowPopup] = useState(false);
  const [showUserPopup, setShowUserPopup] = useState(false);
  const [profilePicUrl, setProfilePicUrl] = useState<string>(
    "/background/both_avatar.jpg"
  );
  const popupRef = useRef<HTMLDivElement>(null);
  const userPopupRef = useRef<HTMLDivElement>(null);
  const { allInvoices } = useInvoiceStore();
  const { authUser } = useAuthStore();
  const navigate = useNavigate();

  // Fetch profile picture if not present
  useEffect(() => {
    async function fetchProfilePic() {
      if (
        authUser?.person?.profile_image_id &&
        !authUser?.person?.profile_picture
      ) {
        try {
          const res = await fetch(
            (import.meta.env.MODE === "development"
              ? "http://localhost:5002/api"
              : "/api") +
              `/images/get-image/${authUser.person.profile_image_id}`,
            {
              method: "GET",
              credentials: "include",
            }
          );
          if (res.ok) {
            const blob = await res.blob();
            const file = new File([blob], "profile_image.jpg", {
              type: blob.type,
            });
            useAuthStore.setState((state) => {
              if (!state.authUser || !state.authUser.person) return {};
              return {
                authUser: {
                  ...state.authUser,
                  person: {
                    ...state.authUser.person,
                    profile_picture: file,
                  },
                },
              };
            });
            useSelectedModeStore.setState({profile_picture: file});
            setProfilePicUrl(URL.createObjectURL(file));
          } else {
            setProfilePicUrl("/background/both_avatar.jpg");
          }
        } catch {
          setProfilePicUrl("/background/both_avatar.jpg");
        }
      } else if (authUser?.person?.profile_picture) {
        setProfilePicUrl(
          URL.createObjectURL(authUser.person.profile_picture as File)
        );
      } else {
        setProfilePicUrl("/background/both_avatar.jpg");
      }
    }
    fetchProfilePic();
  }, [
    authUser?.person?.profile_image_id,
    authUser?.person?.profile_picture,
  ]);

  const cartQuantitySum = allInvoices.reduce((acc, invoice) => {
    const cart = (invoice as Invoice).cart || [];
    return (
      acc +
      (Array.isArray(cart)
        ? cart.reduce((itemAcc, t) => itemAcc + (t.quantity || 0), 0)
        : 0)
    );
  }, 0);

  // Close main popup on outside click or touch
  useEffect(() => {
    if (!showPopup) return;
    function handleEvent(event: MouseEvent | TouchEvent) {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setShowPopup(false);
      }
    }
    document.addEventListener("mousedown", handleEvent);
    document.addEventListener("touchstart", handleEvent);
    return () => {
      document.removeEventListener("mousedown", handleEvent);
      document.removeEventListener("touchstart", handleEvent);
    };
  }, [showPopup]);

  // Close user popup on outside click or touch
  useEffect(() => {
    if (!showUserPopup) return;
    function handleEvent(event: MouseEvent | TouchEvent) {
      if (
        userPopupRef.current &&
        !userPopupRef.current.contains(event.target as Node)
      ) {
        setShowUserPopup(false);
      }
    }
    document.addEventListener("mousedown", handleEvent);
    document.addEventListener("touchstart", handleEvent);
    return () => {
      document.removeEventListener("mousedown", handleEvent);
      document.removeEventListener("touchstart", handleEvent);
    };
  }, [showUserPopup]);

  if (pathname === "/login" || pathname === "/signup") {
    return null; // Don't show navbar on login or signup pages
  }

  return (
    <nav className="bg-white fixed w-full z-10 top-0 h-12 shadow-stone-500 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-full">
        <div className="flex items-center justify-start space-x-4 relative">
          <img
            onClick={() => setShowPopup((v) => !v)}
            src="/background/lunga-trader.png"
            alt="Company Logo"
            className="h-10 w-10 rounded-full shadow-lg cursor-pointer hover:opacity-70 active:opacity-40 transition-opacity duration-300"
          />
          <span className="text-lg font-bold">Lunga Traders</span>
          {showPopup && (
            <div
              ref={popupRef}
              className="absolute left-1/2 top-full mt-2 -translate-x-1/2 bg-white/70 rounded-lg shadow-lg p-2 z-50 min-w-[180px] h-fit items-center space-y-3"
            >
              <button
                type="button"
                onClick={() => {
                  setShowPopup(false);
                  navigate("/");
                }}
                className="flex items-center cursor-pointer align-middle w-full hover:bg-gradient-to-r from-stone-600 via-stone-500 to-stone-600 bg-white p-1 px-3 border-b-gray-300 border rounded-3xl gap-3 shadow-md shadow-black hover:font-bold"
              >
                <FaHome size={24} />
                <p className=" text-sm">Home</p>
              </button>
              {/* <button
                type="button"
                onClick={() => {
                  setShowPopup(false);
                  window.location.href = "/installation/lunga-traders.apk";
                }}
                className="flex items-center cursor-pointer align-middle w-full hover:bg-gradient-to-r from-stone-600 via-stone-500 to-stone-600 bg-white p-1 px-3 border-b-gray-300 border rounded-3xl gap-3 shadow-md shadow-black hover:font-bold"
              >
                <FaCloudDownloadAlt size={24} />
                <p className=" text-sm">Download APK</p>
              </button> */}
              {authUser && <button
                type="button"
                onClick={() => {
                  setShowPopup(false);
                  navigate("/my-business");
                }}
                className="flex items-center cursor-pointer align-middle w-full hover:bg-gradient-to-r from-stone-600 via-stone-500 to-stone-600 bg-white p-1 px-3 border-b-gray-300 border rounded-3xl gap-3 shadow-md shadow-black hover:font-bold"
              >
                <img
                  src="/icons/briefcase-fill.svg"
                  alt="business logo"
                  className="w-6 h-6"
                />
                <p className=" text-sm">My Business</p>
              </button>}
            </div>
          )}
        </div>
        <div className="space-x-6 flex justify-center items-center ">
          <div className="items-center space-x-2 cursor-pointer hover:opacity-70 active:opacity-40 transition-opacity duration-300" onClick={()=> navigate("/my-cart")}>
            <p className="font-bold text-[16px] absolute mt-[-7px] ml-3 w-full">
              {cartQuantitySum}
            </p>
            <img
              
              src={"/background/cart-image-black.png"}
              alt="cart pic"
              className="w-7 h-7 "
            />
          </div>
          {/* User avatar with its own popup */}
          <div className="relative inline-block">
            <img
              onClick={() => setShowUserPopup((v) => !v)}
              src={profilePicUrl}
              alt="pic of user or default picture of user"
              className="h-10 w-10 rounded-full shadow-lg cursor-pointer hover:opacity-70 active:opacity-40 transition-opacity duration-300"
            />
            {showUserPopup && (
              <div
                ref={userPopupRef}
                className="absolute right-[-70px] top-full mt-2 -translate-x-1/2 bg-white/70 rounded-lg shadow-lg p-2 z-50 min-w-[150px] h-fit items-center space-y-3"
              >
                {!authUser && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowUserPopup(false);
                      navigate("/login");
                    }}
                    className="flex items-center cursor-pointer align-middle w-full hover:bg-gradient-to-r from-stone-600 via-stone-500 to-stone-600 bg-white p-1 px-3 border-b-gray-300 border rounded-3xl gap-3 shadow-md shadow-black hover:font-bold"
                  >
                    <FaUserCircle size={18} className="" />
                    <span className="text-sm">Login</span>
                  </button>
                )}
                {authUser && <button
                  type="button"
                  onClick={() => {
                    setShowUserPopup(false);
                    navigate("/profile");
                  }}
                  className="flex items-center cursor-pointer align-middle w-full hover:bg-gradient-to-r from-stone-600 via-stone-500 to-stone-600 bg-white p-1 px-3 border-b-gray-300 border rounded-3xl gap-3 shadow-md shadow-black hover:font-bold"
                >
                  <FaUserCircle size={18} className="" />
                  <span className="text-sm">My Profile</span>
                </button>}
                {authUser && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowUserPopup(false);
                      useAuthStore.getState().logout();
                      navigate("/login");
                    }}
                    className="flex items-center cursor-pointer align-middle w-full hover:bg-gradient-to-r from-red-800 via-red-400 to-red-800 bg-white p-1 px-3 border-b-gray-300 border rounded-3xl gap-3 shadow-md shadow-black hover:font-bold"
                  >
                    <FaSignOutAlt size={18} className="" />
                    <span className="text-sm">Logout</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
