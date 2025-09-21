import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.NODE_ENV === 'production' 
        ? 'https://your-api-domain.com/api' // 실제 백엔드 API 도메인으로 변경
        : 'http://localhost:4000/api',
    withCredentials: true,
});

// 응답 인터셉터 추가 - 인증 오류 처리
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // 인증 관련 오류 처리
        if (error.response?.status === 401 || error.response?.status === 403) {
            console.log('인증 오류 발생, 로그인 페이지로 리다이렉트');
            
            // 현재 경로가 이미 로그인 페이지가 아닌 경우에만 리다이렉트
            if (typeof window !== 'undefined' && !window.location.pathname.includes('/admin')) {
                window.location.href = '/admin';
            }
        }
        
        // 네트워크 오류 또는 서버 연결 오류
        if (error.code === 'ECONNRESET' || error.code === 'ECONNREFUSED' || !error.response) {
            console.error('서버 연결 오류:', error.message);
            
            // 사용자에게 알림 (선택적)
            if (typeof window !== 'undefined') {
                // alert('서버와의 연결이 끊어졌습니다. 잠시 후 다시 시도해주세요.');
            }
        }
        
        return Promise.reject(error);
    }
);

export default axiosInstance; 