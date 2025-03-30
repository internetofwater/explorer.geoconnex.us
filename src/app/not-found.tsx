'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Explorer is a SPA, redirect to the home page if a user enters an unexpected route
export default function Custom404() {
    const router = useRouter();

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        router.push('/');
    });

    return null;
}
