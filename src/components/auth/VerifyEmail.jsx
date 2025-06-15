import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { verifyEmail } from '../../utils/firebase';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function VerifyEmail() {
  const { oobCode } = useParams();
  const navigate = useNavigate();
  const { logIn } = useAuth();
  const [status, setStatus] = useState('verifying');
  const [error, setError] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    async function handleVerification() {
      try {
        // Verify the email using the oobCode
        const user = await verifyEmail(oobCode);
        setUserEmail(user.email);
        
        // Automatically log in the user
        await logIn(user.email, user.password); // Note: You might need to adjust this
        
        setStatus('verified');
        
        // Redirect to dashboard after 3 seconds
        setTimeout(() => navigate('/'), 3000);
      } catch (err) {
        console.error('Verification error:', err);
        setError(err.message.replace('Firebase: ', ''));
        setStatus('error');
      }
    }
    
    handleVerification();
  }, [oobCode, navigate, logIn]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center px-4 bg-transparent"
    >
      <div className="max-w-md w-full p-8 bg-gray-800 rounded-xl shadow-lg border border-gray-700">
        {status === 'verifying' && (
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-900/20 rounded-full">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h2 className="text-2xl font-bold text-white">Verifying Your Email</h2>
            <p className="text-gray-400">Please wait while we verify your email address...</p>
          </div>
        )}

        {status === 'verified' && (
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-900/20 rounded-full">
              <CheckCircle2 className="w-8 h-8 text-green-500" strokeWidth={2} />
            </div>
            <h2 className="text-2xl font-bold text-white">Email Verified!</h2>
            <p className="text-gray-300">
              Your email <span className="font-semibold text-blue-300">{userEmail}</span> has been successfully verified.
            </p>
            <p className="text-gray-400">You'll be redirected to the app in a moment...</p>
            <div className="pt-4">
              <div className="h-1 w-full bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full animate-[progress_3s_linear_forwards]"
                  style={{ animationName: 'progress' }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-900/20 rounded-full">
              <AlertCircle className="w-8 h-8 text-red-500" strokeWidth={2} />
            </div>
            <h2 className="text-2xl font-bold text-white">Verification Failed</h2>
            <p className="text-gray-300">{error}</p>
            <div className="pt-4 space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded text-white"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="w-full py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded text-white"
              >
                Go to Sign Up
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes progress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </motion.div>
  );
}