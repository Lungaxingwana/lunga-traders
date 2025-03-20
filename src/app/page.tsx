'use client'
import Skeleton from "@/components/Skeleton";
import { useSelectedMode } from "@/contexts/SelectionModeContext";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { Toaster } from 'sonner';
import ProductItem from "./product-item";
import { Product } from "@/data-types/product";

export default function Home() {
    const { setSearch, search } = useSelectedMode();
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

    const { data: allProducts, isLoading, error, refetch } = useQuery<Product[]>({
        queryKey: ["products"],
        queryFn: async () => {
            const response = await axios.get<Product[]>("/api/all-products");
            return response.data;
        },
        retry: 3, // Retry failed requests up to 3 times
        refetchOnWindowFocus: false, // Disable refetching on window focus
    });

    useEffect(() => {
        if (search) {
            const lowerCaseSearch = search.toLowerCase();
            const filtered = allProducts?.filter(item =>
                item.make.toLowerCase().includes(lowerCaseSearch) ||
                item.model.toLowerCase().includes(lowerCaseSearch) ||
                item.year.toString().toLowerCase().includes(lowerCaseSearch) ||
                item.color.toLowerCase().includes(lowerCaseSearch)
            );
            setFilteredProducts(filtered || []);
        } else {
            setFilteredProducts(allProducts || []);
        }
    }, [search, allProducts]);

    return (
        <div className="min-h-screen bg-stone-200 w-full ">
            <div className="items-center justify-items-center align-middle gap-16 mx-auto">
                <p className="text-lg sm:text-3xl md:text-4xl font-bold mt-10 pt-6">Buy. Sell. Trade.</p>
                <div className="align-middle justify-center mx-auto w-full flex">
                    <input onChange={(e) => setSearch(e.target.value)} className="mt-6 p-1 sm:p-4 w-7/12 rounded-3xl shadow-md bg-white shadow-stone-400 text-center italic outline-none" placeholder="Search by Make, Model, Year or Color (any product you might think we have for you)" />
                </div>
                <div className="max-w-7xl w-full items-center align-middle justify-center flex mx-auto flex-wrap rounded-xl mt-7">
                    <div className="w-full items-center align-middle justify-center">
                        <p className="text-center my-4 text-xl font-bold text-stone-500">{search === '' ? 'All Products' : search}</p>
                        {error ? (
                            <div className="text-center text-red-500">
                                <p>Failed to load products. Please try again.</p>
                                <button onClick={()=>refetch} className="mt-2 p-2 bg-red-500 text-white rounded">Retry</button>
                            </div>
                        ) : (
                            allProducts?.length === 0 ? (
                                <div className="max-w-7xl w-full items-center align-middle justify-center mx-auto flex-wrap rounded-xl sm:mt-40 mt-10">
                                    <p className="text-3xl font-bold text-red-700 text-center">Product list is empty...</p>
                                    <p className="text-stone-500 text-center">Add product(s) under Manage-My-Business</p>
                                </div>
                            ) : (
                                <div className="w-full items-center align-middle justify-center flex flex-wrap gap-2 sm:gap-8">
                                    <Toaster richColors position='top-center' />
                                    {isLoading ? (
                                        <div><Skeleton /></div>
                                    ) : (
                                        filteredProducts.map((product, index) => <ProductItem product={product} key={index} />)
                                    )}
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}