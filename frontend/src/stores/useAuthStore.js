import { jwtDecode } from "jwt-decode";
import { create } from "zustand";
import api from "@/api/axios";

const useAuthStore = create((set) => ({
    user : null,
    isAuthenticated : false,
    openLoginDialog : false,
    openSignupDialog : false,
    initializeAuth : () => {
        const token = localStorage.getItem('accessToken');
        if(token){
            try {
                const decodedToken = jwtDecode(token);
                set({user: decodedToken, isAuthenticated: true});
            } catch (error) {
                console.log("Invalid token: ", error)
                localStorage.removeItem('accessToken');
                set({user: null, isAuthenticated: false})
            }
        } else {
            set({user: null, isAuthenticated: false})
        }
    },
    
    setOpenLoginDialog : (isOpen) => set({openLoginDialog: isOpen}),
    setOpenSignupDialog : (isOpen) => set({openSignupDialog: isOpen}),

    // when login/signup succeeds
    login : (token) => {
        localStorage.setItem('accessToken', token);
        set({user: jwtDecode(token), isAuthenticated: true});
    },

    // logout - calls backend API and clears frontend state
    logout : async () => {
        try {
            // Call backend logout API to clear refresh token from database and cookie
            await api.get('/auth/logout', {
                withCredentials: true
            });
            console.log('Logout successful');
        } catch (error) {
            // Even if API call fails, clear frontend state
            console.error('Logout API error (continuing with frontend logout):', error);
        } finally {
            // Always clear frontend state regardless of API call result
            localStorage.removeItem('accessToken');
            set({user: null, isAuthenticated: false});
        }
    }
}))

export default useAuthStore;