/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    swcMinify: true,
    images: {
        domains: ['wallpaperaccess.com', 'lh3.googleusercontent.com']
    },
    typescript : {
        ignoreBuildErrors: true,
    }
}

const withTM = require('next-transpile-modules')(["react-icons"]);

module.exports = withTM(nextConfig)