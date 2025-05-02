// 'use client';

// import { useState } from 'react';
// import Link from 'next/link';
// import Navbar from './Navbar';
// import Footer from './Footer';
// import '../styles/register.css';
// // Import CSS module


// export default function RegisterForm() {
//   const [userId, setUserId] = useState('');
//   const [email, setEmail] = useState('');
//   const [message, setMessage] = useState('');

//   const handleRegister = async () => {
//     if (!userId.trim() || !email.trim()) {
//       setMessage('Please enter both User ID and Email');
//       return;
//     }

//     try {
//       const response = await fetch('/api/register', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ userId, email }),
//       });

//       const result = await response.json();

//       if (response.ok) {
//         setMessage(`${userId} registered successfully!`);
//       } else {
//         setMessage(result.error || 'Registration failed');
//       }
//     } catch (err) {
//       setMessage('Something went wrong. Please try again.');
//       console.error(err);
//     }
//   };

//   return (
//    <>
//   <Navbar/>
//     <div className="custom-body">
//       <div className="container">
      
//         <h1>Register</h1>
//         <input
//           type="text"
//           placeholder="Enter User ID"
//           value={userId}
//           onChange={(e) => setUserId(e.target.value)}
//           className="input-field"
//         />
//         <input
//           type="email"
//           placeholder="Enter Email ID"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="input-field"
//         />
//         <button onClick={handleRegister} className="register-btn">
//           Register
//         </button>
//         {message && <p className="message">{message}</p>}
//         <br/>  <br/>
//         <Link href='/'>HOME</Link> 
//       </div>
//     </div>
//     <Footer/>
//     </>
//   );
// }
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from './Navbar';
import Footer from './Footer';
import '../styles/register.css';

export default function RegisterForm() {
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    if (!userId.trim() || !email.trim()) {
      setMessage('Please enter both User ID and Email');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, email }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(`${userId} registered successfully!`);
        // Clear form on successful registration
        setUserId('');
        setEmail('');
      } else {
        setMessage(result.error || 'Registration failed');
      }
    } catch (err) {
      setMessage('Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page">
      <Navbar />
      
      <main className="page-container">
        <div className="container">
          <header>
            <h1>Register</h1>
          </header>
          
          <form onSubmit={handleRegister} className="content">
            <input
              type="text"
              placeholder="Enter User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="input-field"
              required
            />
            <input
              type="email"
              placeholder="Enter Email ID"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              required
            />
            
            <button 
              type="submit" 
              className="register-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Registering...' : 'Register'}
            </button>
            
            {message && (
              <p className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
                {message}
              </p>
            )}
            
            <div className="auth-links">
              <p>Already have an account? <Link href="/login">Login Here</Link></p>
              <p><Link href="/">Return to Home</Link></p>
            </div>
          </form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}