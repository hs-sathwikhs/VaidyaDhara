// Simple HomePage for debugging
import React from 'react';

function SimpleHomePage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-blue-600">Simple Home Page</h1>
      <p className="text-gray-700 mt-4">This is a simple homepage to test if React is working.</p>
      <div className="mt-6 p-4 bg-green-100 rounded-lg">
        <p className="text-green-800">If you can see this, the basic React setup is working!</p>
      </div>
    </div>
  );
}

export default SimpleHomePage;
