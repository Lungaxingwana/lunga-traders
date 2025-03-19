import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/login',
        destination: '/auth/login',
      },
      {
        source: '/create-account',
        destination: '/auth/create-account',
      },
      {
        source: '/forgot-password',
        destination: '/auth/forgot-password',
      },
      {
        source: '/profile',
        destination: '/auth/profile',
      },





      {
        source: '/people',
        destination: '/manage-business/manage-people',
      },
      {
        source: '/vehicles',
        destination: '/manage-business/manage-vehicles',
      },
    ];
  },

};

export default nextConfig;
