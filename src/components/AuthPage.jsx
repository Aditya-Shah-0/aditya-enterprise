import React ,{ useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import {auth} from "../App"

export const AuthPage = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError("Please enter both email and password.");
      setLoading(false);
      return;
    }

    try {
      if (isLoginView) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''));
    }
    setLoading(false);
  };

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-2xl shadow-2xl">
        <h1 className="text-3xl font-bold text-center text-white mb-2">Welcome</h1>
        <p className="text-center text-gray-400 mb-8">{isLoginView ? 'Log in to continue' : 'Create your account'}</p>

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-400">Email Address</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full bg-gray-700 text-white rounded-lg p-3 mt-2 mb-4 border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-gray-400">Password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-gray-700 text-white rounded-lg p-3 mt-2 mb-4 border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white rounded-lg py-3 font-semibold hover:bg-indigo-700 transition duration-300 disabled:bg-indigo-800">
            {loading ? 'Processing...' : (isLoginView ? 'Log In' : 'Sign Up')}
          </button>
        </form>

        {error && <p className="text-red-400 text-center mt-4 text-sm">{error}</p>}

        <div className="text-center mt-6">
          <button onClick={() => { setIsLoginView(!isLoginView); setError(''); }} className="text-sm text-indigo-400 hover:text-indigo-300">
            {isLoginView ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
          </button>
        </div>
      </div>
    </div>
  );
};
