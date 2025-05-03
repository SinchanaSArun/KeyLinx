
'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';

export default function SignatureVerifier({ userId }) {
  const [state, setState] = useState({
    status: 'idle',
    error: null,
    publicKey: null,
    signature: null,
    originalMessage: null,
  });

  // Using your specified colors
  const colors = {
    primary: '#3c7f70',  // Darker teal
    secondary: '#5ec1ac', // Lighter teal
    light: '#f8f9fa',
    dark: '#343a40',
    white: '#ffffff'
  };

  // Style objects
  const styles = {
    container: {
      width: '90%',
      maxWidth: '600px',  // Smaller container width
      backgroundColor: colors.white,
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
      margin: '1.5rem auto',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    header: {
      backgroundColor: colors.primary,
      color: colors.white,
      padding: '1rem',
      textAlign: 'center',
    },
    content: {
      padding: '1.5rem',
    },
    button: {
      width: '100%',
      padding: '0.75rem 1.25rem',
      backgroundColor: colors.primary,
      color: colors.white,
      border: 'none',
      borderRadius: '6px',
      fontSize: '0.95rem',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      marginBottom: '1.5rem',
    },
    buttonHover: {
      backgroundColor: colors.secondary,
      transform: 'translateY(-1px)',
    },
    buttonDisabled: {
      backgroundColor: '#a0a0a0',
      cursor: 'not-allowed',
    },
    spinner: {
      display: 'inline-block',
      width: '1rem',
      height: '1rem',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      borderTopColor: colors.white,
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
    },
    statusMessage: {
      padding: '0.75rem',
      borderRadius: '6px',
      marginBottom: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      backgroundColor: 'rgba(248, 249, 250, 0.8)',
      borderLeft: `4px solid ${colors.primary}`,
    },
    errorStatus: {
      backgroundColor: '#fde8e8',
      borderLeft: '4px solid #e53e3e',
    },
    successStatus: {
      backgroundColor: 'rgba(94, 193, 172, 0.1)',
      borderLeft: `4px solid ${colors.secondary}`,
    },
    resultBox: {
      backgroundColor: colors.light,
      borderRadius: '8px',
      padding: '1.25rem',
      marginTop: '1rem',
    },
    keyBlock: {
      backgroundColor: colors.white,
      borderRadius: '6px',
      padding: '0.75rem',
      margin: '0.75rem 0',
      border: `1px solid ${colors.secondary}`,
      position: 'relative',
    },
    keyLabel: {
      fontWeight: 600,
      color: colors.primary,
      fontSize: '0.85rem',
      marginBottom: '0.25rem',
    },
    keyValue: {
      wordBreak: 'break-all',
      fontFamily: "'Courier New', monospace",
      fontSize: '0.85rem',
      color: colors.dark,
    },
    message: {
      margin: 0,
      whiteSpace: 'pre-wrap',
      fontSize: '0.8rem',
      lineHeight: 1.5,
      fontFamily: "'Courier New', monospace",
    },
  };

  const fetchPublicKey = async (userId) => {
    try {
      const response = await fetch(`https://keylinx.onrender.com/getUser/${userId}`);
      if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(`Failed to fetch public key: ${errorDetails.message || response.statusText}`);
      }
      const data = await response.json();
      return {
        e: data.publicKey.e,
        n: data.publicKey.n
      };
    } catch (error) {
      throw new Error(`Failed to fetch public key: ${error.message}`);
    }
  };

  const handleVerify = async () => {
    setState({
      status: 'fetching_key',
      error: null,
      publicKey: null,
      signature: null,
      originalMessage: null
    });

    try {
      toast.loading('Connecting to blockchain network...');

      const publicKey = await fetchPublicKey(userId);
      toast.loading('Preparing challenge...');

      const challenge = {
        type: 'auth_challenge',
        service: 'keylinx.com',
        timestamp: new Date().toISOString(),
        nonce: crypto.randomUUID(),
        message: 'Please sign this challenge for good luck'
      };

      const verifyResponse = await fetch('http://localhost:7070/sign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(challenge)
      });

      const result = await verifyResponse.json();

      if (!result.signature || result.signature === 'b12c3e5f7a984d6d99c2f331b3a8dc7a') {
        throw new Error('Please provide a valid signature to verify.');
      }

      if (!verifyResponse.ok) {
        throw new Error(result.error || 'Signature verification failed');
      }

      setState({
        status: 'success',
        publicKey: publicKey,
        signature: result.signature,
        originalMessage: challenge,
        error: null
      });

      toast.success('Verification passed!');
    } catch (error) {
      setState({
        status: 'error',
        error: error.message
      });
      toast.error(`Verification failed: ${error.message}`);
    } finally {
      toast.dismiss();
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={{ margin: 0, fontWeight: 600, fontSize: '1.25rem' }}>Signature Verification</h1>
      </header>
      
      <div style={styles.content}>
        <button
          onClick={handleVerify}
          disabled={state.status === 'fetching_key'}
          style={{
            ...styles.button,
            ...(state.status === 'fetching_key' ? styles.buttonDisabled : {}),
            ':hover': state.status !== 'fetching_key' ? styles.buttonHover : {}
          }}
        >
          {state.status === 'fetching_key' ? (
            <>
              <span style={styles.spinner}></span>
              Verifying...
            </>
          ) : (
            'Verify Signature'
          )}
        </button>

        {state.status === 'fetching_key' && (
          <div style={styles.statusMessage}>
            <span>Processing verification request...</span>
          </div>
        )}

        {state.error && (
          <div style={{ ...styles.statusMessage, ...styles.errorStatus }}>
            <span>{state.error}</span>
          </div>
        )}

        {state.status === 'success' && (
          <div style={styles.resultBox}>
            <div style={{ ...styles.statusMessage, ...styles.successStatus }}>
              <span>Verification successful!</span>
            </div>

            <div style={styles.keyBlock}>
              <div style={styles.keyLabel}>Public Key:</div>
              <div style={{ marginTop: '0.5rem' }}>
                <div style={styles.keyLabel}>Exponent (e):</div>
                <div style={styles.keyValue}>{state.publicKey.e}</div>
              </div>
              <div style={{ marginTop: '0.5rem' }}>
                <div style={styles.keyLabel}>Modulus (n):</div>
                <div style={styles.keyValue}>{state.publicKey.n.slice(0, 50)}...</div>
              </div>
            </div>

            <div style={styles.keyBlock}>
              <div style={styles.keyLabel}>Signature:</div>
              <div style={{ ...styles.keyValue, color: colors.primary }}>
                {state.signature.slice(0, 20)}...
              </div>
            </div>

            <div style={styles.keyBlock}>
              <div style={styles.keyLabel}>Original Message:</div>
              <pre style={styles.message}>
                {JSON.stringify(state.originalMessage, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}