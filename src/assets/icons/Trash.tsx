type TrashIconProps = {
  color?: string
  className?: string
}

export const TrashIcon: React.FC<TrashIconProps> = ({
  color = 'white',
  className,
}) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke={color}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M14 3.98665C11.78 3.76665 9.54667 3.65332 7.32 3.65332C6 3.65332 4.68 3.71999 3.36 3.85332L2 3.98665"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.66667 3.31337L5.81334 2.44004C5.92001 1.80671 6 1.33337 7.12667 1.33337H8.87334C10 1.33337 10.0867 1.83337 10.1867 2.44671L10.3333 3.31337"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.5667 6.09338L12.1333 12.8067C12.06 13.8534 12 14.6667 10.14 14.6667H5.86C4 14.6667 3.94 13.8534 3.86667 12.8067L3.43333 6.09338"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.88667 11H9.10667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.33333 8.33337H9.66666"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
