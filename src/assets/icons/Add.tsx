type AddIconProps = {
  color?: string
  className?: string
}

export const AddIcon: React.FC<AddIconProps> = ({
  color = 'white',
  className,
}) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M12.6667 8.66671H8.66668V12.6667H7.33334V8.66671H3.33334V7.33337H7.33334V3.33337H8.66668V7.33337H12.6667V8.66671Z" />
    </svg>
  )
}
