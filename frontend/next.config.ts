import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
async rewrites() {
  return [
    {
      source: '/login',
      destination: '/auth/login',
    },
    {
      source: '/signup',
      destination: '/auth/signup',
    },
    {
      source: '/profile',
      destination: '/auth/profile',
    },
    {
      source: '/',
      destination: '/main/home',
    },
    {
      source: '/detail-product',
      destination: '/main/home/detail-product',
    },
    {
      source: '/my-business',
      destination: '/main/my-business',
    },
    {
      source: '/product-detail',
      destination: '/main/my-business/product-detail',
    },
    {
      source: '/add-product',
      destination: '/main/my-business/add-product',
    },
    {
      source: '/my-cart',
      destination: '/main/my-cart',
    },
  ];
},
};

export default nextConfig;
