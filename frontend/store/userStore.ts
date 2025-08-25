// zutstand 사용자 정보 관리
import { create } from 'zustand';

interface User {
    id: number;
    nickname: string;
    roles: number[];
}

interface UserState {
    user: User | null;
    isLoggedIn: boolean;
    login: (user: User) => void;
    logout: () => void;
}

const useUserStore = create<UserState>((set) => ({
    user: null,
    isLoggedIn: false,
    login: (user) => set({ user, isLoggedIn: true }),
    logout: () => set({ user: null, isLoggedIn: false }),
}));

export default useUserStore; 