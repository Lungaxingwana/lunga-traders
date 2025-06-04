interface Area {
    x: number;
    y: number;
    width: number;
    height: number;
}

const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = (error) => reject(new Error(`Failed to load image: ${error}`));
        image.crossOrigin = 'anonymous'; // Avoid cross-origin issues
        image.src = url;
    });

export default async function getCroppedImg(imageSrc: string, pixelCrop: Area): Promise<string | null> {
    try {
        const image = await createImage(imageSrc);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            throw new Error('Failed to get 2D context from canvas');
        }

        // Set canvas dimensions to match the crop area
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        // Draw the cropped image onto the canvas
        ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height
        );

        // Return the cropped image as a data URL (same format as input)
        return canvas.toDataURL('image/jpeg', 1.0);
    } catch (error) {
        console.error('Error in getCroppedImg:', error);
        return null;
    }
}