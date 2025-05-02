import SignatureVerifier from '@/components/SignatureVerifier';

export const metadata = {
  title: 'Blockchain Signature Verification',
  description: 'Verify signed messages using blockchain public keys',
};

export default function Login() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white p-8 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
            Digital Signature Verification
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Verify messages signed with your USB security device
          </p>
          <SignatureVerifier />
        </div>
      </div>
    </main>
  );
}