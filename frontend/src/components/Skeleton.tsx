import React from 'react';
import { ImSpinner9 } from "react-icons/im";

const Skeleton: React.FC = () => {
    return (
        <div className="align-middle justify-center flex px-3 rounded-xl animate-pulse max-w-7xl   w-full">
            <div className="w-full justify-center flex space-x-2 align-middle items-center">
                <ImSpinner9 size={36} className='animate-spin text-stone-400'/>
                <p className='text-xl text-stone-500 w-full font-bold text-center'>Loading All Products...</p>
            </div>
        </div>
    );
};

export default Skeleton;
