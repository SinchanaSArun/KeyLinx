'use client';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function SignatureVerifier() {
  const [state, setState] = useState({
    status: 'idle', // 'idle' | 'fetching_key' | 'reading_usb' | 'verifying' | 'success' | 'error'
    publicKey: null,
    signature: null,
    originalMessage: null,
    error: null,
    showPublicKey: false 
  });

  // 1. Enhanced Public Key Fetch from Blockchain
  const fetchPublicKey = async (userId) => {
    try {
      const response = await fetch('https://keylinx.onrender.com/getUser/alice123', {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`
        },
     
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch public key');
      }
      
      const { publicKey } = await response.json();
      
    //   if (!publicKey || !publicKey.includes('BEGIN PUBLIC KEY')) {
    //     throw new Error('Invalid public key format received');
    //   }
      console.log(publicKey);
      return publicKey;
    } catch (error) {
      console.error('Blockchain error:', error);
      throw new Error(`Blockchain connection failed: ${error.message}`);
    }
  };
 // Add this function to toggle public key visibility
//  const togglePublicKey = () => {
//     setState(prev => ({ ...prev, showPublicKey: !prev.showPublicKey }));
//   };
  // 2. Robust USB Device Communication
  const readFromUSB = async () => {
    if (!navigator.usb) {
      throw new Error('USB security device requires Chrome/Edge browser');
    }

    let device;
    try {
      device = await navigator.usb.requestDevice({
        filters: [
          { vendorId: parseInt(process.env.NEXT_PUBLIC_USB_VENDOR_ID || '0x1234') }
        ]
      });

      // Add USB operation timeout (5 seconds)
      const usbTimeout = (promise, ms) => 
        Promise.race([
          promise,
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Device timeout')), ms)
          )
        ]);

      await usbTimeout(device.open(), 5000);
      
      const validConfig = device.configurations.find(c => c.configurationValue === 1);
      if (!validConfig) throw new Error('Invalid device configuration');
      
      await usbTimeout(device.selectConfiguration(1), 2000);
      await usbTimeout(device.claimInterface(0), 2000);

      // Protocol implementation
      const requestPayload = JSON.stringify({
        command: 'SIGN',
        nonce: crypto.getRandomValues(new Uint8Array(16)).join(''),
        timestamp: Date.now()
      });

      await usbTimeout(
        device.transferOut(2, new TextEncoder().encode(requestPayload)),
        3000
      );

      const result = await usbTimeout(device.transferIn(2, 512), 5000);
      const decoded = new TextDecoder().decode(result.data.buffer);
      
      // Secure response parsing
      try {
        const { message, signature, status } = JSON.parse(decoded);
        if (status !== 'SUCCESS') throw new Error('Device rejected request');
        if (!signature || !message) throw new Error('Invalid response format');
        
        return { 
          message: message.slice(0, 1024), // Prevent huge messages
          signature: signature.slice(0, 512) // Limit signature size
        };
      } catch (parseError) {
        throw new Error('Invalid device response format');
      }
    } finally {
      if (device) {
        try {
          await device.close();
        } catch (closeError) {
          console.error('Error closing device:', closeError);
        }
      }
    }
  };

  // 3. Secure Signature Verification
  const verifySignature = async (publicKey, message, signature) => {
    try {
      // Input validation
      if (!publicKey || !message || !signature) {
        throw new Error('Missing verification parameters');
      }

      if (message.length > 1024 || signature.length > 512) {
        throw new Error('Invalid input size');
      }

      const cryptoKey = await window.crypto.subtle.importKey(
        'spki',
        pemToArrayBuffer(publicKey),
        { 
          name: 'RSASSA-PKCS1-v1_5',
          hash: 'SHA-256'
        },
        true,
        ['verify']
      );

      const isValid = await window.crypto.subtle.verify(
        'RSASSA-PKCS1-v1_5',
        cryptoKey,
        base64ToArrayBuffer(signature),
        new TextEncoder().encode(message)
      );

      if (!isValid) {
        console.warn('Invalid signature detected');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Verification error:', error);
      throw new Error(`Security verification failed: ${error.message}`);
    }
  };

  // Main Verification Flow with Error Boundaries
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
      
      // 1. Get Public Key with retry
      const publicKey = await fetchPublicKey('user123')
        .catch(async () => await fetchPublicKey('user123'));

      toast.loading('Please authenticate with your security device...');
      
      // 2. Get Signature
      const { message, signature } = await readFromUSB();
      toast.loading('Validating cryptographic proof...');
      
      // 3. Verify
      const isValid = await verifySignature(publicKey, message, signature);
      
      setState({
        status: 'success',
        publicKey: publicKey.slice(0, 50) + '...', // Truncated display
        signature: signature.slice(0, 20) + '...',
        originalMessage: message,
        error: null
      });

      toast.success(`Security verification ${isValid ? 'passed' : 'failed'}`);
    } catch (error) {
      console.error('Verification process error:', error);
      setState({
        status: 'error',
        error: error.message.includes('timeout') 
          ? 'Device not responding' 
          : error.message
      });
      toast.error(`Verification failed: ${error.message}`);
    } finally {
      toast.dismiss();
    }
  };

  // Utility Functions with Validation
  const pemToArrayBuffer = (pem) => {
    try {
      const base64 = pem
        .replace(/-+BEGIN PUBLIC KEY-+/g, '')
        .replace(/-+END PUBLIC KEY-+/g, '')
        .replace(/\s/g, '');
      
      if (!base64 || base64.length < 100) {
        throw new Error('Invalid PEM content');
      }
      return base64ToArrayBuffer(base64);
    } catch (error) {
      console.error('PEM conversion error:', error);
      throw new Error('Invalid public key format');
    }
  };

  const base64ToArrayBuffer = (base64) => {
    try {
      const binaryString = atob(base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes;
    } catch (error) {
      console.error('Base64 conversion error:', error);
      throw new Error('Invalid signature encoding');
    }
  };

  return (
    <div className="space-y-6">
          {state.publicKey && (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-gray-800">Public Key</h3>
            <button 
              onClick={togglePublicKey}
              className="text-sm text-blue-600 hover:underline"
            >
              {state.showPublicKey ? 'Hide' : 'Show'}
            </button>
          </div>
          
          {state.showPublicKey ? (
            <div className="mt-2">
              <pre className="text-xs p-2 bg-white rounded overflow-x-auto">
                {state.publicKey}
              </pre>
              <p className="text-xs text-gray-500 mt-1">
                This is your public key retrieved from the blockchain
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-500 mt-1">
              Click "Show" to display the public key
            </p>
          )}
        </div>
      )}
      <button
        onClick={handleVerify}
        disabled={state.status !== 'idle'}
        className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
          state.status === 'idle' 
            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
        }`}
      >
        {state.status === 'idle' ? 'Verify Signature' : 
         state.status === 'fetching_key' ? 'Connecting to Blockchain...' :
         state.status === 'reading_usb' ? 'Waiting for Security Device...' :
         state.status === 'verifying' ? 'Validating Proof...' :
         'Processing...'}
      </button>

      {state.status === 'success' && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-medium text-green-800">Verification Successful</h3>
          <div className="mt-2 space-y-2 text-sm">
            <p className="break-all">
              <span className="font-medium">Message:</span> 
              {state.originalMessage?.slice(0, 100)}...
            </p>
            <p className="break-all">
              <span className="font-medium">Signature:</span> 
              {state.signature}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Public key truncated for security
            </p>
          </div>
        </div>
      )}

      {state.status === 'error' && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="font-medium text-red-800">Verification Failed</h3>
          <p className="mt-1 text-sm text-red-600">{state.error}</p>
          <button
            onClick={handleVerify}
            className="mt-3 text-sm text-blue-600 hover:underline"
          >
            Try Again
          </button>
        </div>
      )}

      {(state.status === 'fetching_key' || state.status === 'reading_usb' || state.status === 'verifying') && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
            <p className="text-blue-800">
              {state.status === 'fetching_key' && 'Connecting to blockchain...'}
              {state.status === 'reading_usb' && 'Waiting for device response...'}
              {state.status === 'verifying' && 'Validating cryptographic proof...'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

