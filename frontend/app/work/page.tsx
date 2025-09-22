import { Suspense } from 'react';
import WorkClient from './WorkClient';

export default function WorkPage() {
    return (
        <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white' }}>로딩 중...</div>}>
            <WorkClient />
        </Suspense>
    );
}