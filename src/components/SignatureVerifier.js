'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';

export default function SignatureVerifier({ userId }) {
  const [state, setState] = useState({
    status: 'idle',
    error: null,
    publicKey: null,
    signature: null,
    originalMessage: null
  });

  const fetchPublicKey = async (userId) => {
    try {
      // Fetch the public key from the correct endpoint
      const response = await fetch(`https://keylinx.onrender.com/getUser/${userId}`);
      if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(`Failed to fetch public key: ${errorDetails.message || response.statusText}`);
      }
      const data = await response.json();
      return {
        e: data.e, // Assuming the response contains `e` (exponent) and `n` (modulus)
        n: data.n
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

      // Construct the challenge
      const challenge = {
        type: 'auth_challenge',
        service: 'keylinx.com',
        timestamp: new Date().toISOString(),
        nonce: crypto.randomUUID(),
        message: 'Please sign this challenge to authenticate'
      };

      // Send to localhost:7070 for signature verification
      const verifyResponse = await fetch('http://localhost:7070/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          publicKey,  // Sending the public key with `e` and `n` in the request
          challenge,
          signature: 'b12c3e5f7a984d6d99c2f331b3a8dc7a' // Example signature, replace with actual
        })
      });

      const result = await verifyResponse.json();

      // Make sure there's a valid signature in the result
      if (!result.signature || result.signature === 'b12c3e5f7a984d6d99c2f331b3a8dc7a') {
        throw new Error('Please provide a valid signature to verify.');
      }

      if (!verifyResponse.ok || !result.valid) {
        throw new Error(result.error || 'Signature verification failed');
      }

      setState({
        status: 'success',
        publicKey: `${publicKey.e}, ${publicKey.n.slice(0, 50)}...`, // Displaying the public key's e and n parts
        signature: result.signature.slice(0, 20) + '...' || 'provided',
        originalMessage: JSON.stringify(challenge, null, 2),
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
    <div>
      <button onClick={handleVerify} disabled={state.status === 'fetching_key'}>
        {state.status === 'fetching_key' ? 'Verifying...' : 'Verify Signature'}
      </button>

      {state.error && <p style={{ color: 'red' }}>{state.error}</p>}

      {state.status === 'success' && (
        <div>
          <p>Public Key: e = {state.publicKey.split(', ')[0]}, n = {state.publicKey.split(', ')[1]}</p>
          <p>Signature: {state.signature}</p>
          <pre>{state.originalMessage}</pre>
        </div>
      )}
    </div>
  );
}
