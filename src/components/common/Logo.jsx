/**
 * Mitplan Logo - Shield with pulse/timeline line
 * SVG logo for inline rendering (no network request)
 */
const Logo = ({ className, size = 32 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Shield Base */}
      <path
        d="M16 2L4 6V14C4 21.5 9.5 28.5 16 30C22.5 28.5 28 21.5 28 14V6L16 2Z"
        fill="url(#shieldGradient)"
        stroke="url(#borderGradient)"
        strokeWidth="2"
      />

      {/* Pulse/Timeline Line - Gold */}
      <path
        d="M9 16H11L13 11L16 21L19 13L21 16H23"
        stroke="#FFD866"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Definitions */}
      <defs>
        <linearGradient
          id="shieldGradient"
          x1="16"
          y1="2"
          x2="16"
          y2="30"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#1A1A23" />
          <stop offset="1" stopColor="#0D0D11" />
        </linearGradient>
        <linearGradient
          id="borderGradient"
          x1="4"
          y1="6"
          x2="28"
          y2="30"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#505064" />
          <stop offset="1" stopColor="#232330" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default Logo;
