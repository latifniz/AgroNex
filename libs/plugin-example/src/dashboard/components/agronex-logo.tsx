export function AgroNexLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="30" height="30" rx="6" fill="#0ea5e9"/>
        <text x="15" y="20" fontFamily="Arial,sans-serif" fontSize="12" fontWeight="bold" fill="white" textAnchor="middle">AN</text>
      </svg>
      <span style={{ fontSize: '1.5rem', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1 }}>
        agronex
      </span>
    </div>
  );
}
