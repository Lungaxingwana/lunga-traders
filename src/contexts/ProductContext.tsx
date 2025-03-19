'use client'
import { Product } from '@/data-types/product';
import React, { createContext, useState, ReactNode, useContext } from 'react';

// Define the shape of the context
interface ProductContextProps {
    allProducts: Product[];
    setAllProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

// Create the context with default values
const ProductContext = createContext<ProductContextProps | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [allProducts, setAllProducts] = useState<Product[]>([]);

    return (
        <ProductContext.Provider value={{ allProducts, setAllProducts }}>
            {children}
        </ProductContext.Provider>
    );
};

// Custom hook to use the CartContext
export const useProduct = (): ProductContextProps => {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error('useProduct must be used within a ProductProvider');
    }
    return context;
};
