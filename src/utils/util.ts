import { Cart } from "@/data-types/cart";

export async function convertImageToBase64(image: string): Promise<string> {
    const response = await fetch(image);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
            const base64data = reader.result as string;
            resolve(base64data);
        };
        reader.onerror = (error) => {
            reject(error);
        };
    });
}

export async function convertImageFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            const base64data = reader.result as string;
            resolve(base64data);
        };
        reader.onerror = (error) => {
            reject(error);
        };
    });
  }

export function totalQuantity(cart: Cart[]) {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
}

export function formatCurrency(
    price: number | string = 0,
    currency: string = "ZAR"
) {
    const normalizedPrice = Number(price) / 100;
    return Intl.NumberFormat("en-ZA", { style: "currency", currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
        normalizedPrice
    );
}

interface SubCategory {
    name: string;
}

interface Category {
    name: string;
    subCategories: SubCategory[];
}

const productCategories: Category[] = [
    {
        name: "Electronics",
        subCategories: [
            { name: "Mobile Phones" },
            { name: "Laptops" },
            { name: "Televisions" },
            { name: "Cameras" },
            { name: "Vehicle" }
        ]
    },
    {
        name: "Fashion",
        subCategories: [
            { name: "Men's Clothing" },
            { name: "Women's Clothing" },
            { name: "Footwear" },
            { name: "Accessories" }
        ]
    },
    {
        name: "Home & Kitchen",
        subCategories: [
            { name: "Furniture" },
            { name: "Home Decor" },
            { name: "Kitchen Appliances" },
            { name: "Bedding" }
        ]
    },
    {
        name: "Books",
        subCategories: [
            { name: "Fiction" },
            { name: "Non-Fiction" },
            { name: "Educational" },
            { name: "Children's Books" }
        ]
    },
    {
        name: "Beauty & Personal Care",
        subCategories: [
            { name: "Skincare" },
            { name: "Hair Care" },
            { name: "Makeup" },
            { name: "Fragrances" }
        ]
    }
];

console.log(productCategories);




// export const initialProducts: Product[] = [
//     {
//         _id: '1',
//         name: 'Organic Apples',
//         description: 'Fresh organic apples straight from the farm.',
//         price: 3.5,
//         quantity: 50,
//         category: 'Food',
//         sub_category: 'Fruits',
//         manufacturer: 'Nature\'s Bounty',
//         tags: ['organic', 'fruit', 'fresh'],
//         images: ['apple1.png', 'apple2.png'],
//         user_id: 'user1',
//         size: 'N/A',
//         color: 'Red',
//         ratio_review: '4.8',
//         number_of_reviews_done: '150'
//     },
//     {
//         _id: '2',
//         name: 'Men\'s T-Shirt',
//         description: 'Comfortable and stylish men\'s t-shirt.',
//         price: 15.0,
//         quantity: 100,
//         category: 'Clothes',
//         sub_category: 'T-Shirts',
//         manufacturer: 'Fashion Hub',
//         tags: ['clothing', 'men', 't-shirt'],
//         images: ['tshirt1.png', 'tshirt2.png'],
//         user_id: 'user2',
//         size: 'L',
//         color: 'Blue',
//         ratio_review: '4.3',
//         number_of_reviews_done: '85'
//     },
//     {
//         _id: '3',
//         name: 'Microwave Oven',
//         description: 'Efficient and compact microwave oven with multiple settings.',
//         price: 120.0,
//         quantity: 30,
//         category: 'Appliance',
//         sub_category: 'Kitchen',
//         manufacturer: 'HomeTech',
//         tags: ['appliance', 'microwave', 'kitchen'],
//         images: ['microwave1.png', 'microwave2.png'],
//         user_id: 'user3',
//         size: 'Medium',
//         color: 'Black',
//         ratio_review: '4.6',
//         number_of_reviews_done: '200'
//     },
//     {
//         _id: '4',
//         name: 'Yoga Mat',
//         description: 'Eco-friendly yoga mat with non-slip surface.',
//         price: 25.0,
//         quantity: 75,
//         category: 'Fitness',
//         sub_category: 'Yoga',
//         manufacturer: 'FitLife',
//         tags: ['fitness', 'yoga', 'mat'],
//         images: ['yogamat1.png', 'yogamat2.png'],
//         user_id: 'user4',
//         size: 'One Size',
//         color: 'Green',
//         ratio_review: '4.7',
//         number_of_reviews_done: '110'
//     },
//     {
//         _id: '5',
//         name: 'Bluetooth Headphones',
//         description: 'Wireless Bluetooth headphones with noise cancellation.',
//         price: 80.0,
//         quantity: 40,
//         category: 'Electronics',
//         sub_category: 'Audio',
//         manufacturer: 'SoundPro',
//         tags: ['electronics', 'headphones', 'audio'],
//         images: ['headphones1.png', 'headphones2.png'],
//         user_id: 'user5',
//         size: 'Adjustable',
//         color: 'Black',
//         ratio_review: '4.9',
//         number_of_reviews_done: '300'
//     }
// ];
