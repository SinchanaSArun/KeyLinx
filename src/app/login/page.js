// 'use client';  // Required for client-side hooks in Next.js

// import { useState } from 'react';
// import './login.css'; // Add the CSS file for styling
// import Link from 'next/link';
// import Navbar from '@/components/Navbar';
// import Footer from '@/components/Footer';
// export default function Login() {
//   const [email, setEmail] = useState('');
//   const [message, setMessage] = useState('');

//   const handleLogin = async () => {
//     if (email.trim()) {
//       // Send a POST request to the login API
//       const response = await fetch('/api/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email }),
//       });

//       const result = await response.json();

//       if (response.ok) {
//         setMessage(`User ID: ${result.userId}`);  // Display the userId if found
//       } else {
//         setMessage(result.error);  // Display the error message if email not registered
//       }
//     } else {
//       setMessage('Please enter a valid email.');
//     }
//   };

//   return (
//     <>
//    <Navbar/>
//    <body>
//     <div class="page-container">
//     {/* <div className="custom-body"> */}
//       <div className="container">
//         <header>
//           <h1>Login</h1>
//         </header>
//         <div className="content">
//           <input
//             type="email"
//             placeholder="Enter your Email"
//             className="input-field"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//           <button onClick={handleLogin} className="login-btn">Login</button>
         
//           <p className="message">{message}</p>
//           Not a User? <Link href="/register">Register Here
//           </Link>
//           <br/>  <br/>
//           <Link href='/'>HOME</Link> 
          
         
//         </div>
       
//       </div>
//     </div>
//     {/* </div> */}
//    </body>
 
//     <Footer/>
//     </>

//   );
// }
'use client';

import { useState } from 'react';
import './login.css';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Login() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setIsLoading(true);
    setMessage('');

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
        setMessage(`Login successful! User ID: ${result.userId}`);
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