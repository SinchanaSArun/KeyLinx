import styles from '../styles/footer.css'; // Import CSS module

export default function Footer() {
    return (
      <footer className="footer">
        <div className="footer-container">
          <p className="copyright">
            {/* &copy; {new Date().getFullYear()} KeyLinx. All rights reserved. */}
         &copy;2025 KeyLinx. All rights reserved
          </p>
          
          <div className="footer-links">
            <a href="/privacy" className="footer-link">Privacy Policy</a>
            <a href="/terms" className="footer-link">Terms of Service</a>
            <a href="/contact" className="footer-link">Contact Us</a>
          </div>
        </div>
      </footer>
    )
  }