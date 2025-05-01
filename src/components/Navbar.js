import Link from "next/link";
import styles from '../styles/navbar.module.css'; // Import CSS module
import Image from 'next/image'

export default function Navbar() {
  return (
    <header className={styles.navbar}>
      <div className={styles.navContainer}>
        {/* Logo on the left */}
        <Link href="/" className={styles.logo}>
    
    KeyLinx
  </Link>
        <Image
      src="/logo.jpeg"
      width={80}
      height={80}
      border-radius='10%'
      
      alt="KeyLinx logo"
      style={{
        position: "absolute",
        top: 0,
        left: 30,
        zIndex: 10,
      }}
  
    />
      
        
        {/* Center navigation links */}
        <nav className={styles.navLinks}>
          <Link href="/" className={styles.navItem}>
            Home
          </Link>
          <Link href="/working" className={styles.navItem}>
          

            How it Works
          </Link>
          {/* <Link href="/verify" className={styles.navItem}>
            Verify
          </Link> */}
        </nav>
        
        {/* Login button on the right */}
        <div className={styles.loginContainer}>
          <Link href="/login" className={styles.loginButton}>
            Login
          </Link>
        </div>
      </div>
    </header>
  );
}