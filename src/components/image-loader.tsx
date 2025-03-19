// components/ImageSelector.tsx
'use client'
import React from 'react';
import { useDropzone } from 'react-dropzone';

interface ImageSelectorProps {
    onImageSelect: (image: string) => void;
}

const ImageSelector: React.FC<ImageSelectorProps> = ({ onImageSelect }) => {

    const onDrop = (acceptedFiles: File[]) => {
        const reader = new FileReader();
        reader.onload = () => {
            onImageSelect(reader.result as string);
        };
        reader.readAsDataURL(acceptedFiles[0]);
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    return (
        <div className='rounded-lg border-dashed cursor-pointer' {...getRootProps()} style={{ border: '3px dashed #cccccc', padding: '10px', textAlign: 'center' }}>
            <input {...getInputProps()} />
            <p className='text-[14px]'>Drag & drop an image here, or click to select one</p>
        </div>
    );
};

export default ImageSelector;
