import Link from "next/link";
import styles from '../styles/navbar.module.css'; // Import CSS module

export default function Navbar() {
  return (
    <header className={styles.navbar}>
      <div className={styles.navContainer}>
        {/* Logo on the left */}
        <Link href="/" className={styles.logo}>
          KeyLinx
        </Link>
        
        {/* Center navigation links */}
        <nav className={styles.navLinks}>
          <Link href="/" className={styles.navItem}>
            Home
          </Link>
          <Link href="/working" className={styles.navItem}>
          

            How it Works
          </Link>
          <Link href="/verify" className={styles.navItem}>
            Verify
          </Link>
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