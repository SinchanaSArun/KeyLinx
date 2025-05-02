'use client';
// import Link from "next/link";
// import styles from '../styles/navbar.module.css'; // Import CSS module
// import Image from 'next/image';
// import { useState } from 'react';

// export default function Navbar() {
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   return (
//     <header className={styles.navbar}>
//       <div className={styles.navContainer}>
//         {/* Logo on the left */}
//         <Link href="/" className={styles.logo}>
    
//     KeyLinx
//   </Link>
//         <Image
//       src="/logo.jpeg"
//       width={80}
//       height={80}
//       border-radius='10%'
      
//       alt="KeyLinx logo"
//       style={{
//         position: "absolute",
//         top: 0,
//         left: 30,
//         zIndex: 10,
//       }}
  
//     />
//         {/* Mobile menu button (hidden on desktop) */}
//         <button 
//           className={styles.mobileMenuButton}
//           onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//           aria-label="Toggle menu"
//         >
//           {/* Hamburger icon - you can use SVG or CSS */}
//           <span></span>
//           <span></span>
//           <span></span>
//         </button>
        
//         {/* Center navigation links */}
//         <nav className={`${styles.navLinks} ${mobileMenuOpen ? styles.mobileActive : ''}`}>
//           <Link href="/" className={styles.navItem} onClick={() => setMobileMenuOpen(false)}>
//             Home
//           </Link>
//           <Link href="/working" className={styles.navItem} onClick={() => setMobileMenuOpen(false)}>
//             Getting Started
//           </Link>
//           {/* Add more links as needed */}
          
//           {/* Moved login button inside nav for mobile */}
//           <div className={styles.loginContainer}>
//             <Link href="/login" className={styles.loginButton} onClick={() => setMobileMenuOpen(false)}>
//               Login
//             </Link>
//           </div>
//         </nav>
//       </div>
//     </header>
//   );
// }
import Link from "next/link";
import styles from '../styles/navbar.module.css';
import Image from 'next/image';
import { useState } from 'react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className={styles.navbar}>
      <div className={styles.navContainer}>
        {/* Logo and name container */}
        <div className={styles.logoContainer}>
          <Image
            src="/logo.jpeg"
            width={50}
            height={50}
            alt="KeyLinx logo"
            className={styles.logoImage}
          />
          <Link href="/" className={styles.logo}>
            KeyLinx
          </Link>
        </div>
        
        {/* Center navigation links */}
        <nav className={styles.navLinks}>
          <Link href="/" className={styles.navItem}>
            Home
          </Link>
          <Link href="/working" className={styles.navItem}>
            Getting Started
          </Link>
        </nav>
        
        {/* Right-aligned login button */}
        <div className={styles.loginWrapper}>
          <Link href="/login" className={styles.loginButton}>
            Login
          </Link>
        </div>
        
        {/* Mobile menu button */}
        <button 
          className={styles.mobileMenuButton}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        
        {/* Mobile menu (contains login button for mobile) */}
        <div className={`${styles.mobileMenu} ${mobileMenuOpen ? styles.mobileActive : ''}`}>
          <Link href="/" className={styles.navItem} onClick={() => setMobileMenuOpen(false)}>
            Home
          </Link>
          <Link href="/working" className={styles.navItem} onClick={() => setMobileMenuOpen(false)}>
            Getting Started
          </Link>
          <Link href="/login" className={styles.loginButton} onClick={() => setMobileMenuOpen(false)}>
            Login
          </Link>
        </div>
      </div>
    </header>
  );
}