import { create } from "zustand";
import { axiosInstance } from "../libs/axios";
import toast from "react-hot-toast";
import io from "socket.io-client";
import { User } from "../data-types/user.type";
import { Socket } from "socket.io-client";
import { useProductStore } from "./useProductStore";
import { Product } from "@/data-types/product.type";

const BASE_URL = process.env.NODE_ENV === "development" ? "http://localhost:5002" : "/";

interface AuthStore {
  authUser: User | null;
  expert: User | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
  isUpdatingLastSeen: boolean;
  onlineUsers: string[];
  isFetchingUser: boolean;
  socket: typeof Socket | null;
  isFetchingAdmins: boolean;
  allAdmins: User[] | null;
  isFetchingUserProfileImage: boolean;

  updateLastSeen: (userId: string, date: string) => Promise<void>;
  getAllAdmins: () => Promise<void>;
  fetchingUser: (userId: string) => Promise<void>;
  checkAuth: () => Promise<void>;
  getImage: (fileId: string, text?: string) => Promise<void>;
  signup: (payload: { form: FormData; navigate: (path: string) => void }) => Promise<void>;
  login: (payload: { data: FormData; navigate: (path: string) => void }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (form: FormData) => Promise<boolean>;
  connectSocket: () => void;
  disconnectSocket: () => void;
}



export const useAuthStore = create<AuthStore>((set, get) => {
  return {
    authUser: null,
    expert: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,
    isFetchingUser: false,
    isFetchingAdmins: false,
    allAdmins: null,
    isUpdatingLastSeen: false,
    isFetchingUserProfileImage: false,

    getImage: async (fileId: string, text?: string) => {
      set({ isFetchingUserProfileImage: true });
      try {
        console.log("File ID in getImage: ", fileId);
        const res = await axiosInstance.get(`/images/get-image/${fileId}`);
        const authUser = get().authUser;
        if (text) {
          set((state) => (
            state.expert
              ? { expert: { ...state.expert, person: { ...state.expert.person, profile_picture: res.data } } }
              : {}
          ));
        }
        else {
          if (authUser) {
            set({ authUser: { ...authUser, person: { ...authUser.person, profile_picture: res.data } } });
          }
        }
      } catch (error) {
        console.log("Error in getImage:", error);
      } finally {
        set({ isFetchingUserProfileImage: false });
      }
    },

    updateLastSeen: async (userId: string, date: string) => {
      set({ isUpdatingLastSeen: true });
      try {
        const res = await axiosInstance.put<User>(`/auth/update-last-seen/${userId}`, { last_seen: date });
        set({ authUser: res.data });
        console.log("Last seen updated successfully");
      } catch (error) {
        console.log("Error in updateLastSeen:", error);
      } finally {
        set({ isUpdatingLastSeen: false });
      }
    },

    getAllAdmins: async () => {
      set({ isFetchingAdmins: true });
      try {
        const res = await axiosInstance.get<User[]>("/auth/get-admins");
        set({ allAdmins: res.data });
      } catch (error) {
        console.log("Error in getAllAdmins:", error);
      } finally {
        set({ isFetchingAdmins: false });
      }
    },

    checkAuth: async () => {
      try {
        const res = await axiosInstance.get<User>("/auth/");
        set({ authUser: res.data });
        get().connectSocket(); // Connect socket after authentication
      } catch (error) {
        console.log("Error in checkAuth:", error);
        set({ authUser: null });
      } finally {
        set({ isCheckingAuth: false });
      }
    },

    signup: async ({ form, navigate }: { form: FormData; navigate: (path: string) => void }) => {
      set({ isSigningUp: true });
      try {
        const res = await fetch(
          (process.env.NODE_ENV === "development" ? "http://localhost:5002/api" : "/api") + `/auth/signup`,
          {
            method: "POST",
            credentials: "include",
            body: form,
          }
        );
        if (res.ok) {
          set({ authUser: await res.json() });
          toast.success("Successfully created account...");
          navigate("/");
        }

        const data = await res.json();
        console.log(data);

      } catch (error) {
        console.log("Profile update failed!");
        console.error(error);
      } finally {
        set({ isSigningUp: false });
      }
    },

    login: async ({ data, navigate }: { data: FormData; navigate: (path: string) => void }) => {
      set({ isLoggingIn: true });
      try {
        const res = await axiosInstance.post<User>("/auth/login", data);
        set({ authUser: res.data });
        navigate('/');
        toast.success("Logged in successfully");
        get().connectSocket(); // Connect socket after authentication
      } catch {
        toast.error("Login failed");
      } finally {
        set({ isLoggingIn: false });
      }
    },

    logout: async () => {
      try {
        await axiosInstance.post("/auth/logout");
        set({ authUser: null });
        toast.success("Logged out successfully");
        console.log('Login in: Lunga')
        get().disconnectSocket();
      } catch {
        toast.error("Logout failed");
      }
    },


    updateProfile: async (form: FormData) => {
      set({ isUpdatingProfile: true });
      try {
        const res = await fetch((process.env.NODE_ENV === "development" ? "http://localhost:5002/api" : "/api") + `/auth/update-profile/${get().authUser?._id}`, {
          method: "PUT",
          credentials: "include",
          body: form,
        });
        const data = await res.json();
        console.log(data);
        console.log("Profile updated!");
        return res.ok;
      } catch (error) {
        console.log("Profile update failed!");
        console.error(error);
        return false;
      } finally {
        set({ isUpdatingProfile: false });
      }
    },

    fetchingUser: async (userId: string) => {
      set({ isFetchingUser: true });
      try {
        const res = await axiosInstance.get<User>(`/auth/${userId}`);
        set({ expert: res.data });
      } catch (error) {
        console.log("Error in fetching user:", error);
      } finally {
        set({ isFetchingUser: false });
      }
    },

    connectSocket: () => {
      const { authUser } = get();
      if (!authUser || get().socket?.connected) return;

      const socket = io(BASE_URL, {
        query: {
          userId: authUser._id,
        },
      });
      socket.connect();

      set({ socket });

      socket.on("getOnlineUsers", (userIds: string[]) => {
        set({ onlineUsers: userIds });
      });

      // Listen for the productDeleted event
      socket.on("productDeleted", (productId: string) => {
        const updateProducts = useProductStore.getState().allProducts?.filter(
          (product) => product._id !== productId
        );
        useProductStore.setState({ allProducts: updateProducts });
      });

      // Listen for the productAdded event
      socket.on("productCreated", (product: Product) => {
        const currentProducts = useProductStore.getState().allProducts || [];
        useProductStore.setState({
          allProducts: [...currentProducts, product],
        });
      });

      // Listen for the productUpdated event
      socket.on("productUpdated", (updatedProduct: Product) => {
        const currentProducts = useProductStore.getState().allProducts || [];
        const updatedProducts = currentProducts.map((product) =>
          product._id === updatedProduct._id ? updatedProduct : product
        );
        useProductStore.setState({ allProducts: updatedProducts });
      });
    },

    disconnectSocket: () => {
      if (get().socket?.connected) get().socket?.disconnect();
    },
  };
});