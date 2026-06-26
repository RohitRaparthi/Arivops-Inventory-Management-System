import React from 'react';

function ProtectedRoute({ isLoggedIn, children }) {
  if (!isLoggedIn) {
    return null;
  }
  return children;
}

export default ProtectedRoute;
