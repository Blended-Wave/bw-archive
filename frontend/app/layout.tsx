'use client';

import '@/styles/globals.css';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useState, useEffect } from 'react';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname();
    const [page, setPage] = useState('');

    useEffect(() => {
        if (pathname.startsWith('/admin')) {
            setPage('admin');
        }
        else if (pathname.startsWith('/artist/instroduction')) {
            setPage('artist/instroduction');
        }
    }, [pathname]);

    if (page === 'admin') {
        return (
            <html>
                <body className="admin_body">
                    {children}
                </body>
            </html>
        );
    }
    else if (page === 'artist/instroduction') {
        return (
            <html>
                <body>
                    <Navbar />
                    {children}
                </body>
            </html>
        );
    }

    return (
        <html>
            <body>
                <Navbar />
                {children}
                <Footer />
            </body>
        </html>
    );
}
