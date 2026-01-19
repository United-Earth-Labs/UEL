import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth';
import { db } from '../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function AdminLogin({ onLoginSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(false);
  const auth = getAuth();
  const googleProvider = new GoogleAuthProvider();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log('Auth state changed:', currentUser?.email);
      
      if (currentUser) {
        setCheckingAuth(true);
        try {
          // Check if user is admin
          console.log('Checking if user is admin...');
          const adminsRef = collection(db, 'admins');
          const q = query(adminsRef, where('email', '==', currentUser.email));
          const snapshot = await getDocs(q);
          
          console.log('Admin check result:', snapshot.docs.length, 'documents found');
          
          if (snapshot.empty) {
            console.log('User not found in admins collection');
            setError('You are not authorized as an admin. Contact your administrator.');
            await signOut(auth);
            setCheckingAuth(false);
          } else {
            console.log('User is authorized admin');
            setUser(currentUser);
            setError(null);
            setCheckingAuth(false);
            onLoginSuccess(currentUser);
          }
        } catch (err) {
          console.error('Error checking admin status:', err);
          setError(`Error: ${err.message}`);
          await signOut(auth);
          setCheckingAuth(false);
        }
      } else {
        setUser(null);
        setCheckingAuth(false);
      }
    });

    return () => unsubscribe();
  }, [auth, onLoginSuccess]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Starting Google sign in...');
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Google sign in successful:', result.user.email);
      // The onAuthStateChanged will handle the rest
    } catch (err) {
      console.error('Google sign in error:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  if (user) {
    return null;
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-2xl text-cyan-400 mb-4">Verifying admin status...</div>
          <div className="animate-spin text-4xl">⏳</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-gradient-to-br from-gray-900 to-gray-800 border border-purple-500/30 rounded-lg p-8"
      >
        <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 mb-2">
          Admin Login
        </h1>
        <p className="text-gray-400 mb-8">Sign in with your Google account</p>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg"
          >
            <p className="text-red-300 text-sm">{error}</p>
          </motion.div>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="animate-spin">⏳</span>
              Signing in...
            </>
          ) : (
            '🔐 Sign in with Google'
          )}
        </motion.button>

        <p className="text-gray-400 text-xs text-center mt-6">
          Only authorized admin accounts can access this panel
        </p>
        
        <p className="text-gray-500 text-xs text-center mt-4 border-t border-gray-700 pt-4">
          Make sure your Google email is added to the admins collection in Firestore
        </p>
      </motion.div>
    </div>
  );
}
