import { Zap } from "@/types/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import Cookies from 'js-cookie';

interface StoreState {
    userId: string;
    accessToken: string;
    updateUserDetails: (userId: string, accessToken: string) => void;
    zaps: Zap[];
    deleteZap: (zapId: string) => void;
    deleteUserDetails: () => void;
}

// Custom storage object that uses cookies
const cookieStorage = {
    getItem: (name: string): string | null => {
        try {
            const cookie = Cookies.get(name);
            if (!cookie) return null;

            // Parse the cookie value
            const parsedCookie = JSON.parse(cookie);

            // If it's already in the correct format, return as is
            if (parsedCookie.state) {
                return JSON.stringify(parsedCookie);
            }

            // Otherwise, wrap it in the expected structure
            return JSON.stringify({
                state: parsedCookie,
                version: 0,
            });
        } catch (error) {
            console.error('Error reading cookie:', error);
            return null;
        }
    },
    setItem: (name: string, value: string) => {
        try {
            const data = JSON.parse(value);
            // Store the state object directly
            Cookies.set(name, JSON.stringify(data.state), {
                path: '/',
                expires: 30,
                sameSite: 'lax'
            });
        } catch (error) {
            console.error('Error setting cookie:', error);
        }
    },
    removeItem: (name: string) => {
        Cookies.remove(name, { path: '/' });
    },
};

const useStore = create<StoreState>()(
    persist(
        (set) => ({
            userId: "",
            accessToken: "",
            updateUserDetails: (userId, accessToken) => {
                console.log('Updating user details:', { userId, accessToken });
                set({ userId, accessToken });
            },
            zaps: [],
            deleteZap: (zapId) =>
                set((state) => ({
                    zaps: state.zaps.filter((zap) => zap.id !== zapId),
                })),
            deleteUserDetails: () => {
                console.log('Deleting user details');
                set({ userId: "", accessToken: "", zaps: [] });
            },
        }),
        {
            name: "userData",
            storage: createJSONStorage(() => cookieStorage),
            partialize: (state) => ({
                userId: state.userId,
                accessToken: state.accessToken
            }),
        },
    ),
);

export default useStore;