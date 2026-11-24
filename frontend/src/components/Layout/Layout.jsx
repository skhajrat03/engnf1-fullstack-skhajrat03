
import React from 'react';
import './Layout.css';

function Layout({ title, children }) {
  return (
    <div className="layout">
      <main className="layout-content">
        {children}
      </main>
    </div>
  );
}

export default Layout;
