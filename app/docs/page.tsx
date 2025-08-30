'use client';

import { useEffect } from 'react';

export default function DocsPage() {
  useEffect(() => {
    // Redirect to the Mintlify docs (will be at docs.hedgepayments.com in production)
    window.location.href = 'http://localhost:3333';
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Redirecting to documentation...</h1>
        <p className="text-gray-400">
          If you're not redirected, <a href="http://localhost:3333" className="text-emerald-400 hover:text-emerald-300">click here</a>
        </p>
      </div>
    </div>
  );
}