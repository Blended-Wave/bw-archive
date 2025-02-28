'use client';

import '@/styles/globals.css';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // useState -> usePathname으로 수정 (초기 렌더링 시 page 값이 빈 문자열이므로 기본 레이아웃이 먼저 렌더링됨)
    const pathname = usePathname();

    if (pathname.startsWith('/admin')) {
        return (
            <html>
                <body className="admin_body">
                    {children}
                </body>
            </html>
        );
    }

    if (pathname.startsWith('/artist/instroduction')) {
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
