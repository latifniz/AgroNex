export function AgroNexLogo() {
  return (
    <div className="flex items-center justify-center gap-2">
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="36" height="36" rx="8" fill="#16a34a"/>
        <text x="18" y="24" fontFamily="Arial,sans-serif" fontSize="14" fontWeight="bold" fill="white" textAnchor="middle">AN</text>
      </svg>
      <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#16a34a', letterSpacing: '-0.02em' }}>
        AgroNex
      </span>
    </div>
  );
}
