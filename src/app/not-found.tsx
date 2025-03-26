'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
export default function Custom404() {
    const router = useRouter();

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        router.push('/');
    });

    return null;
}
