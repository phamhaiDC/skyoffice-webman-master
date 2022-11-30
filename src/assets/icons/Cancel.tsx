type CancelIconProps = {
  color?: string
  onClick?: () => void
  className?: string
}

export const CancelIcon: React.FC<CancelIconProps> = ({
  color = '#242D35',
  onClick,
  className,
}) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      xmlns="http://www.w3.org/2000/svg"
      className={`cursor-pointer ${className}`}
      onClick={onClick}
    >
      <path d="M18 6L6 18" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 6L18 18" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
