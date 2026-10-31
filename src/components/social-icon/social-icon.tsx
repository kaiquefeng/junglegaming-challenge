import type { SocialIconProps } from './social-icon.types'

const paths = {
  facebook: 'M14 8h3V4h-3c-2.2 0-4 1.8-4 4v2H7v4h3v6h4v-6h3l1-4h-4V8z',
  twitter:
    'M22 5.9c-.7.3-1.5.5-2.4.6.9-.5 1.5-1.3 1.8-2.3-.8.5-1.7.8-2.6 1a4.1 4.1 0 0 0-7 3.7C8.4 8.7 5.4 7.1 3.4 4.6c-1.100 1.900-.5 4.200 1.200 5.400-.7 0-1.300-.2-1.900-.5 0 2 1.400 3.700 3.300 4.100-.6.2-1.200.2-1.800.1.5 1.600 2 2.800 3.800 2.800A8.200 8.200 0 0 1 2 18.300 11.600 11.600 0 0 0 8.300 20c7.500 0 11.700-6.300 11.400-12 .8-.6 1.500-1.300 2.300-2.100z',
  linkedin:
    'M5 9h3v10H5V9zm1.500-5a1.750 1.750 0 1 1 0 3.500 1.750 1.750 0 0 1 0-3.500zM10 9h2.900v1.400c.4-.8 1.400-1.600 2.900-1.600 3 0 3.600 2 3.600 4.600V19h-3v-5c0-1.200 0-2.700-1.700-2.700S13 12.600 13 13.900V19h-3V9z',
  youtube:
    'M21.600 7.200a2.500 2.500 0 0 0-1.800-1.800C18.200 5 12 5 12 5s-6.200 0-7.800.4A2.500 2.500 0 0 0 2.400 7.200C2 8.800 2 12 2 12s0 3.200.4 4.800a2.500 2.500 0 0 0 1.800 1.800C5.800 19 12 19 12 19s6.200 0 7.800-.4a2.500 2.500 0 0 0 1.800-1.800c.4-1.600.4-4.800.4-4.800s0-3.200-.4-4.800zM10 15V9l5.200 3L10 15z',
}

export function SocialIcon({ network, className }: SocialIconProps) {
  if (network === 'instagram') {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.800"
        aria-hidden="true"
        className={className}
      >
        <rect x="4" y="4" width="16" height="16" rx="4.500" />
        <circle cx="12" cy="12" r="3.700" />
        <circle
          cx="16.800"
          cy="7.200"
          r="0.800"
          fill="currentColor"
          stroke="none"
        />
      </svg>
    )
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d={paths[network]} fillRule="evenodd" />
    </svg>
  )
}
