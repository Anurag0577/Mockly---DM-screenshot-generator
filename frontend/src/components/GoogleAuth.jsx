import React from 'react';
import api from "@/api/axios.js";
import useAuthStore from '@/stores/useAuthStore';
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';

const GoogleAuth = () => {
  const navigate = useNavigate();
  const { login, setOpenLoginDialog: setOpen } = useAuthStore();
  
  // ⚠️ BEST PRACTICE: Move this to your .env file (e.g., import.meta.env.VITE_GOOGLE_CLIENT_ID)
  const clientId = "783336438617-m4lf3kl6hmlid32uu38rfdgm82g0dots.apps.googleusercontent.com";

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      console.log('Google Credential Response:', credentialResponse);

      // 1. Prepare payload matching Backend expectations
      // Backend expects: { credential, client_id }
      // Google gives: { credential, clientId }
      const payload = {
        credential: credentialResponse.credential,
        client_id: credentialResponse.clientId 
      };

      // 2. Send to backend
      const response = await api.post('/auth/googleLogin', payload, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });

      console.log('Backend Login Response:', response?.data?.data);
      if (response?.data?.data?.accessToken) {
        login(response.data?.data?.accessToken);
      }

      // 3. Handle Success
      const apiData = response.data; // The standard axios data wrapper
      
      // Access token location based on your backend response structure:
      // res.json(new apiResponse(200, "...", userResponse))
      // So it is likely inside: apiData.data.accessToken
      const accessToken = apiData?.data?.accessToken;

      if (accessToken) {
        login(accessToken);
        toast.success('You are logged in!');
        setOpen(false); // Close modal
        navigate('/');
      } else {
        throw new Error('No access token received');
      }

    } catch (error) {
      console.error('Error during Google login:', error);
      const errorMessage = error.response?.data?.message || 'Google Login Failed';
      toast.error(errorMessage);
    }
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => {
            console.log('Login Failed');
            toast.error("Google Popup Closed or Failed");
          }}
          useOneTap // Optional: Adds the prompt in the top right corner
        />
      </div>
    </GoogleOAuthProvider>
  );
};

export default GoogleAuth;