import './Home.css';
import Image from 'next/image';

export default function Home() {
  return (
    <>
    <main className="main">
      <section className="hero">
        <h1 className="hero-title">Decentralized USB Authentication</h1>
        <p className="hero-subtitle">
          Plug in. Prove. You're in. Secure authentication powered by your USB key and the blockchain.
        </p>
        <a href="/login" className="demo-button">
          Try the Live Demo
        </a>
      </section>

      <section className="features">
        <Feature
          title="Decentralized Identity"
          description="Public keys are stored on-chain — no central authority needed."
        />
        <Feature
          title="Hardware-Based Security"
          description="Authenticate using cryptographic signatures from your USB device."
        />
        <Feature
          title="Privacy-First Design"
          description="No personal data stored or transmitted. Only proof of possession."
        />
      </section>

      <section className="why-section">
      <h2 className="section-title">Why Use Decentralized USB Auth?</h2>
      <ul className="why-list">
        <li><strong>No Vendor Lock-In:</strong> Public keys are truly yours, stored on a decentralized ledger.</li>
        <li><strong>Zero Trust Compatible:</strong> Local USB-based challenge-response eliminates password risk.</li>
        <li><strong>Easy to Adopt:</strong> Services can integrate using our helper daemon and JS SDK.</li>
      </ul>
      </section>

      <section className="how-it-works">
        <h2 className="how-title">How It Works</h2>
        <div>
          <Image 
            src="/block_diag.png"
            width={800}
            height={360}/>
        </div>
        <ol className="how-list">
          <li><strong>1. Fetch Public Key:</strong> We get your public key from the blockchain.</li>
          <li><strong>2. Challenge from Server:</strong> A random message is sent to your local helper daemon.</li>
          <li><strong>3. USB Signs & Verifies:</strong> Your USB device signs the challenge. The server verifies it.</li>
        </ol>
      </section>
      
      

    </main>
    </>
);
}

function Feature({ title, description }) {
  return (
    <div className="feature-card">
      <h3 className="feature-title">{title}</h3>
      <p className="feature-desc">{description}</p>
    </div>
  );
}
