'use client';

import { useState } from 'react';
import './login.css';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SignatureVerifier from '@/components/SignatureVerifier';

export default function Login() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState(null); // Track login success
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setUserId(null);

    if (!email.trim()) {
      setMessage('Please enter a valid email.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (response.ok) {
        setUserId(result.userId); // Set userId to enable SignatureVerifier
        setMessage(`Login successful!`);
      } else {
        setMessage(result.error || 'Login failed. Please try again.');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Navbar />
      
      <main className="page-container">
        <div className="container">
          <header>
            <h1>Login</h1>
          </header>
          
          <form onSubmit={handleLogin} className="content">
            <input
              type="email"
              placeholder="Enter your Email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <button 
              type="submit" 
              className="login-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Login'}
            </button>

            {message && (
              <p className={`message ${message.includes('successful') ? 'success' : 'error'}`}>
                {message}
              </p>
            )}



            {/* Conditionally render SignatureVerifier after login */}
            {userId && (
                <div className="mt-6">
                  <p className="text-sm text-gray-600 mb-2">
                    UserId: <span className="font-medium text-black">{userId}</span>
                  </p>
                  <SignatureVerifier userId={userId} />
                </div>
              
)}
  
            <div className="auth-links">
              <p>Not a User? <Link href="/register">Register Here</Link></p>
              <p><Link href="/">Return to Home</Link></p>
            </div>
          </form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
