"use client";

export default function Home() {
  if (typeof window !== 'undefined') {
    window.location.href = '/old-design.html';
  }
  
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#06060a',
      color: '#f4f4ff',
      fontFamily: 'Inter, sans-serif'
    }}>
      <p>Redirecting to home page...</p>
    </div>
  );
}
