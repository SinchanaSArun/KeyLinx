"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./verify.css";

export default function Verify() {
  // Button click handlers
  const handleRegister = () => {
    // Register keys logic here
    console.log("Register button clicked");
  };

  const handleVerify = () => {
    // Verify keys logic here
    console.log("Verify button clicked");
  };

  return (
    <>
      <Navbar />
      <main>
        <h1>Verify page</h1>
        <div className="container">
          <header>
            <h1>Secure Key Manager</h1>
          </header>
          
          <div className="content">
            <div className="button-group">
              <button 
                id="registerBtn" 
                onClick={handleRegister}
                className="action-button"
              >
                <span className="icon">🔑</span> Register Keys
              </button>
              <button 
                id="verifyBtn" 
                onClick={handleVerify}
                className="action-button"
              >
                <span className="icon">🔍</span> Verify Keys
              </button>
            </div>
            
            <div id="output">
              <div className="status-message">
                <span className="icon">ℹ️</span> System ready. Click a button to begin.
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
