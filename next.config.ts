import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    // eslint-disable-next-line @typescript-eslint/require-await
    rewrites: async () => {
        return {
            beforeFiles: [
                {
                    source: '/mainstems/:id',
                    destination: '/',
                },
            ],
            afterFiles: [],
            fallback: [],
        };
    },
};

export default nextConfig;
