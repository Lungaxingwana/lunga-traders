'use client';
import React, { useState } from "react";

import Image from "next/image";
import { convertImageFileToBase64 } from "@/utils/util";

interface ImagesProps {
    images: string[];
    setImages: (images: string[]) => void;
}

export default function ImagesInformation({ images, setImages }: ImagesProps) {
    const [selectedImages, setSelectedImages] = useState<string[]>(images);

    const handleImageChange = async(event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const fileArray = Array.from(event.target.files).map((file) =>
                URL.createObjectURL(file)
            );
            setSelectedImages(() => [...fileArray]);
            const base64Images = await Promise.all(
                Array.from(event.target.files!).map(async (file) => await convertImageFileToBase64(file))
            );
            setImages([...base64Images]);
        }
    };

    const renderImages = () =>
        selectedImages.map((src, index) => (
            <Image
                key={index}
                src={src}
                alt={`Selected ${index}`}
                className=" object-cover m-1 border border-white"
                width={80}
                height={80}
            />
        ));

    return (
        <div className="w-full h-full  bg-opacity-80 overflow-y-auto space-y-1   items-center align-middle flex flex-col ">
            <p className=" w-full text-center  text-xs text-stone-500">
                Product Images
            </p>
            <label className=" w-full text-center font-bold border border-dashed " htmlFor={'chooseImages'}>Click here to select your images</label>
            <input
                type="file"
                hidden
                multiple
                id="chooseImages"
                onChange={handleImageChange}
                className="w-full bg-transparent outline-none px-4 placeholder:text-stone-500 "
            />
            <div className="flex flex-wrap mt-4 scroll-my-10">{renderImages()}</div>
        </div>
    );
}
