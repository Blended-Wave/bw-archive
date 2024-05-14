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
    const [isAdminPage, setIsAdminPage] = useState(false);

    useEffect(() => {
        setIsAdminPage(pathname.startsWith('/admin'));
    }, [pathname]);

    if (isAdminPage) {
        return (
            <html>
                <body className="admin_body">
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
