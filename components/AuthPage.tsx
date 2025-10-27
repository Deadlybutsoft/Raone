import React, { useState, useEffect } from 'react';
import { GoogleIcon, XIcon } from './icons';
import { useAuth0 } from '@auth0/auth0-react';

interface AuthPageProps {
  onClose: () => void;
  onTryDemo: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onClose, onTryDemo }) => {
  const [isVisible, setIsVisible] = useState(false);
  const { loginWithRedirect, isLoading, error } = useAuth0();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleLogin = () => {
    loginWithRedirect({
      appState: {
        returnTo: window.location.pathname,
      },
    });
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-2xl transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      onClick={handleClose}
    >
      <div 
        className={`relative border border-white/20 bg-white/10 rounded-2xl max-w-4xl w-full flex overflow-hidden shadow-2xl text-white transition-all duration-300 ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Side Image */}
        <div className="w-1/2 hidden md:block">
            <img 
                src="https://res.cloudinary.com/dkvkxermy/image/upload/v1761377735/MODERN_halftone_DESIGN_OF_A_BL_5_fw49ua.jpg" 
                alt="AI Agent Illustration"
                className="w-full h-full object-cover"
            />
        </div>

        {/* Right Side Content */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center relative">
            <button 
              onClick={handleClose}
              className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors z-10"
            >
              <XIcon className="h-6 w-6" />
            </button>
            <div className="text-center">
                <h2 className="text-3xl font-bold mb-4">Get Started</h2>

                <button
                  onClick={handleLogin}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 bg-white/10 border border-white/20 py-3 rounded-lg hover:bg-white/20 transition-colors mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <GoogleIcon className="h-5 w-5" />
                  <span className="font-semibold text-sm">
                    {isLoading ? 'Signing in...' : 'Continue with Google'}
                  </span>
                </button>
                {error && (
                  <div className="text-red-400 text-sm text-center">
                    Error: {error.message}
                  </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};
