import { jwtDecode } from "jwt-decode";
import { create } from "zustand";

const useAuthStore = create((set) => ({
    user : null,
    isAuthenticated : false,

    // initialise your localStorage
    initializeAuth : () => {
        const token = localStorage.getItem('accessToken');
        if(token){
            try {
                const decodedToken = jwtDecode(token);
                set({user: decodedToken, isAuthenticated: true});
            } catch (error) {
                console.log("Invalid token: ", token)
                localStorage.removeItem('accessToken');
                set({user: null, isAuthenticated: false})
            }
        } else {
            set({user: null, isAuthenticated: false})
        }
    },

    // when login/signup succeeds
    login : (token) => {
        console.log('this is token in store', token);
        localStorage.setItem('accessToken', token);
        set({user: jwtDecode(token), isAuthenticated: true});
    },

    // logout successfull
    logout : () => {
        localStorage.removeItem('accessToken');
        set({user: null, isAuthenticated: false})
    }
}))

export default useAuthStore;