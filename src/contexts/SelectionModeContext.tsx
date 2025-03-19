'use client'
import React, { createContext, useState, useContext } from 'react';

const SelectedModeContext = createContext<any>({
    mode:'Add New Asset',
    setMode: ()=>{},
    selectedMode: 'Customer',
    setSelectedMode: () => { },
    edit_id: '',
    setEdit_id: () => { },
    search: '',
    setSearch: () => { },
    productId: '',
    setProductId: () => { },
    selectedProductId: '',
    setSelectedProductId: () => { },
});

export const SelectedModeProvider = ({ children }: any) => {
    const [mode, setMode] = useState<'All Assets' | 'Asset Structure' | 'More Information' | 'Add New Asset' | string>('All Assets');
    const [selectedMode, setSelectedMode] = useState<'Customer' | 'Expert'>('Customer');
    const [edit_id, setEdit_id] = useState('');
    const [search, setSearch] = useState('');
    const [selectedProductId, setSelectedProductId] = useState('');

    return (
        <SelectedModeContext.Provider value={{
            selectedMode, setSelectedMode,  mode, setMode, edit_id, setEdit_id, search, setSearch, selectedProductId, setSelectedProductId
        }}>
            {children}
        </SelectedModeContext.Provider>
    );
};

export const useSelectedMode = () => useContext(SelectedModeContext);