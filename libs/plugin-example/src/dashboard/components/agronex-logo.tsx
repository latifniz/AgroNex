export function AgroNexLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="7" fill="#16a34a"/>
        <text x="16" y="22" fontFamily="Arial,sans-serif" fontSize="13" fontWeight="bold" fill="white" textAnchor="middle">AN</text>
      </svg>
      <span style={{ fontSize: '1.6rem', fontWeight: 600, color: '#16a34a', letterSpacing: '-0.01em', lineHeight: 1 }}>
        agronex
      </span>
    </div>
  );
}
