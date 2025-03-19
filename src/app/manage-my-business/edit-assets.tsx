'use client';
;
import { toast, Toaster } from "sonner";
import axios from "axios";
import { ImSpinner9 } from "react-icons/im";
import { useQuery } from "@tanstack/react-query";
import { useSelectedMode } from "@/contexts/SelectionModeContext";
import { Product } from "@/data-types/product";
import ImagesInformation from "./images-information";
import { useState } from "react";
import { convertImageToBase64 } from "@/utils/util";

export default function EditAsset() {
  const { data: allProducts } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await axios.get<Product[]>("/api/all-products");
      return response.data;
    },
  });

  const { selectedProductId, setMode } = useSelectedMode();
  const findProduct = allProducts?.find((product) => product._id === selectedProductId);
  const [newAsset, setNewAsset] = useState<Product>(findProduct!);
  const [images, setImages] = useState<string[]>(findProduct!.images_src||[]);
  const [isLoading, setIsLoading] = useState(false);

  async function handleAddAsset() {
    if (newAsset) {
      setIsLoading(true);
      try {
        //const imageSrc = await convertImageToBase64(image);
   
        setNewAsset({ ...newAsset, images_src: images,image_src: await convertImageToBase64(images[0]) });

        const res = await axios.patch<Product>("/api/manage-my-business/update-asset", {...newAsset, images_src: images, image_src: images[0]});
        allProducts?.map((product) => product._id === selectedProductId ? res.data : product);
        toast.success("Successfully edited your asset...");
        setMode("All Assets");
      } catch (error) {
        console.error("Error processing the image:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error(
        "One of the field(s) is empty, provide a value for it and try again..."
      );
  
    }
  }

  return (
    <div className="max-w-7xl w-full justify-center items-center align-middle">
          <div className="justify-center items-center align-middle mx-auto flex w-full px-10">
            <div className="flex justify-center align-middle items-center gap-2 text-white">
              <RiEdit2Fill className="w-7 h-7 text-center" />
              <p className="w-full text-2xl font-bold">Modify Selected Asset</p>
            </div>
          </div>
          <div className="w-full border border-b my-5 border-white"></div>
          <div className="justify-center items-center align-middle mx-auto flex bg-stone-300 flex-wrap rounded-xl">
            <div className="justify-center align-middle items-center gap-2 md:w-1/3 w-full p-5 space-y-6">
              <div className="w-full bg-white rounded-lg shadow-md shadow-stone-500 h-[430px]">
                <ImagesInformation images={images||[]} setImages={setImages} />
              </div>
            </div>
    
            <div className="justify-center align-middle items-center gap-2 md:w-1/3 w-full p-5 space-y-6">
              <div className="w-full bg-white rounded-lg shadow-md shadow-stone-500">
                <p className="absolute mt-[-13] ml-7 text-xs text-stone-500">
                  Make
                </p>
                <input
                  value={newAsset.make}
                  onChange={(e) =>
                    setNewAsset({ ...newAsset, make: e.target.value })
                  }
                  className="w-full bg-transparent p-2 px-5 outline-none placeholder:text-stone-400"
                  placeholder="Make / Manufacturer / Creater name"
                />
              </div>
              <div className="w-full bg-white rounded-lg shadow-md shadow-stone-500">
                <p className="absolute mt-[-13] ml-7 text-xs text-stone-500">
                  Model
                </p>
                <input
                  value={newAsset.model}
                  onChange={(e) =>
                    setNewAsset({ ...newAsset, model: e.target.value })
                  }
                  className="w-full bg-transparent p-2 px-5 outline-none placeholder:text-stone-400"
                  placeholder="Model name"
                />
              </div>
              <div className="w-full bg-white rounded-lg shadow-md shadow-stone-500">
                <p className="absolute mt-[-13] ml-7 text-xs text-stone-500">
                  Year
                </p>
                <input
                  value={newAsset.year}
                  onChange={(e) =>
                    setNewAsset({ ...newAsset, year: parseInt(e.target.value) })
                  }
                  maxLength={4}
                  type="number"
                  className="w-full bg-transparent p-2 px-5 outline-none placeholder:text-stone-400"
                  placeholder="Year"
                />
              </div>
              <div className="w-full bg-white rounded-lg shadow-md shadow-stone-500">
                <p className="absolute mt-[-13] ml-7 text-xs text-stone-500">
                  Color
                </p>
                <input
                  value={newAsset.color}
                  onChange={(e) =>
                    setNewAsset({ ...newAsset, color: e.target.value })
                  }
                  className="w-full bg-transparent p-2 px-5 outline-none placeholder:text-stone-400"
                  placeholder="Color"
                />
              </div>
              <div className="w-full bg-white rounded-lg shadow-md shadow-stone-500">
                <p className="absolute mt-[-13] ml-7 text-xs text-stone-500">
                  Size
                </p>
                <input
                  value={newAsset.size}
                  onChange={(e) =>
                    setNewAsset({ ...newAsset, size: e.target.value })
                  }
                  className="w-full bg-transparent p-2 px-5 outline-none placeholder:text-stone-400"
                  placeholder="Size"
                />
              </div>
              <div className="w-full bg-white rounded-lg shadow-md shadow-stone-500">
                <p className="absolute mt-[-13] ml-7 text-xs text-stone-500">
                  Category
                </p>
                <input
                  value={newAsset.category}
                  onChange={(e) =>
                    setNewAsset({ ...newAsset, category: e.target.value })
                  }
                  className="w-full bg-transparent p-2 px-5 outline-none placeholder:text-stone-400"
                  placeholder="Category"
                />
              </div>
              <div className="w-full bg-white rounded-lg shadow-md shadow-stone-500">
                <p className="absolute mt-[-13] ml-7 text-xs text-stone-500">
                  Sub-Category
                </p>
                <input
                  value={newAsset.sub_category}
                  onChange={(e) =>
                    setNewAsset({ ...newAsset, sub_category: e.target.value })
                  }
                  className="w-full bg-transparent p-2 px-5 outline-none placeholder:text-stone-400"
                  placeholder="Sub-Category"
                />
              </div>
            </div>
    
            <Toaster richColors position="top-center" />
    
            <div className="justify-center align-middle items-center gap-2 md:w-1/3 w-full p-5 space-y-6">
              <div className="w-full bg-white rounded-lg shadow-md shadow-stone-500">
                <p className="absolute mt-[-13] ml-7 text-xs text-stone-500">
                  Tags
                </p>
                <input
                  value={newAsset.tags}
                  onChange={(e) =>
                    setNewAsset({ ...newAsset, tags: e.target.value })
                  }
                  className="w-full bg-transparent p-2 px-5 outline-none placeholder:text-stone-400"
                  placeholder="Tags (each separated by comma)"
                />
              </div>
              <div className="w-full bg-white rounded-lg shadow-md shadow-stone-500">
                <p className="absolute mt-[-13] ml-7 text-xs text-stone-500">
                  Description
                </p>
                <textarea
                  value={newAsset.description}
                  onChange={(e) =>
                    setNewAsset({ ...newAsset, description: e.target.value })
                  }
                  className="w-full bg-transparent p-2 px-5 outline-none placeholder:text-stone-400 line-clamp-6 h-24 whitespace-pre-line overflow-hidden"
                  placeholder="Category"
                />
              </div>
              <div className="w-full bg-white rounded-lg shadow-md shadow-stone-500">
                <p className="absolute mt-[-13] ml-7 text-xs text-stone-500">
                  Stock Quantity
                </p>
                <input
                  value={newAsset.stock_quantity}
                  onChange={(e) =>
                    setNewAsset({
                      ...newAsset,
                      stock_quantity: parseInt(e.target.value),
                    })
                  }
                  type="number"
                  className="w-full bg-transparent p-2 px-5 outline-none placeholder:text-stone-400"
                  placeholder="Stock Quantity"
                />
              </div>
              <div className="w-full bg-white rounded-lg shadow-md shadow-stone-500">
                <p className="absolute mt-[-13] ml-7 text-xs text-stone-500">
                  Original Price
                </p>
                <input
                  value={newAsset.original_price}
                  onChange={(e) =>
                    setNewAsset({
                      ...newAsset,
                      original_price: parseInt(e.target.value),
                    })
                  }
                  type="number"
                  className="w-full bg-transparent p-2 px-5 outline-none placeholder:text-stone-400"
                  placeholder="Original Price"
                />
              </div>
              <div className="w-full bg-white rounded-lg shadow-md shadow-stone-500">
                <p className="absolute mt-[-13] ml-7 text-xs text-stone-500">
                  Sale Price
                </p>
                <input
                  value={newAsset.sale_price}
                  onChange={(e) =>
                    setNewAsset({
                      ...newAsset,
                      sale_price: parseInt(e.target.value),
                    })
                  }
                  type="number"
                  className="w-full bg-transparent p-2 px-5 outline-none placeholder:text-stone-400"
                  placeholder="Sale Price"
                />
              </div>
              <div className="w-full bg-stone-200 rounded-xl shadow-xl shadow-stone-800">
                <button
                  onClick={handleAddAsset}
                  className="w-full bg-stone-500 font-bold hover:bg-stone-400 active:bg-red-700 rounded-xl p-2 px-5 outline-none "
                >
                  {isLoading ? (
                    <div className="flex align-middle justify-center items-center gap-2 w-full">
                      <ImSpinner9 size={23} className="animate-spin" />
                      <p>Updating Asset...</p>
                    </div>
                  ) : (
                    <div className="flex align-middle justify-center items-center gap-2 w-full">
                      <RiEdit2Fill className="w-7 h-7" />
                      <p>Update Asset</p>
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
  );
}
