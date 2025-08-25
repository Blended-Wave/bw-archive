'use client';

import '@/styles/globals.css';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useEffect } from 'react';
import useUserStore from '@/store/userStore';
import api from '@/lib/axios';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname();
    const { login } = useUserStore();

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const response = await api.get('/auth/status');
                if (response.data.isAuthenticated && response.data.user) {
                    login(response.data.user);
                }
            } catch (error) {
                console.error('인증 상태 확인 실패:', error);
            }
        };
        checkAuthStatus();
    }, [login]);

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
                <div id="modal-root"></div>
            </body>
        </html>
    );
}
