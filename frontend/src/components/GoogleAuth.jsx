import React from 'react';
import api from "@/api/axios.js"
import { jwtDecode } from "jwt-decode";
import useAuthStore from '@/stores/useAuthStore';
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
const GoogleAuth = () => {
  const navigate = useNavigate();
    const {login} = useAuthStore();
    const { setOpenLoginDialog: setOpen} = useAuthStore();
 const clientId = "783336438617-m4lf3kl6hmlid32uu38rfdgm82g0dots.apps.googleusercontent.com";
  return (
   <GoogleOAuthProvider clientId={clientId}>
     <GoogleLogin
       onSuccess={credentialResponse => {
         console.log(credentialResponse);
         console.log(jwtDecode(credentialResponse.credential));
         // THIS IS THE FOLLOWING STEPS WE HAVE TO DO:
         // 1. Send this credential to the backend for verification and login/signup
         try{
          api.post('/auth/google-login', credentialResponse, {
                headers: {'Content-Type': 'application/json'},
                withCredentials: true
              })

              .then((data) => {
                console.log('Google login response:', data);
                // Handle successful login here
                console.log('User login successful', data)
                if (data?.data?.data?.accessToken) {
                  login(data.data?.data.accessToken);
                }
                toast.success('You are logged in!');
                setOpen(false)
                navigate('/')
              })
              .catch((error) => {
                console.error('Error during Google login:', error);
                // Handle login error here
              });
         } catch(err){
          console.error('Error during Google login:', err);
         }
         
         // 2. Backend will respond with our own JWT token
         // 3. Store that token in our auth store (similar to normal login)
       }}
       onError={() => {
         console.log('Login Failed');
       }}
     />
   </GoogleOAuthProvider>
   );
 };
export default GoogleAuth;