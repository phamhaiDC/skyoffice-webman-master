type MenuIconProps = {
  color?: string
  onClick?: () => void
}

export const MenuIcon: React.FC<MenuIconProps> = ({
  color = '#FAFAFA',
  onClick,
}) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      className="cursor-pointer"
      onClick={onClick}
    >
      <circle cx="5.17126" cy="5.17126" r="2.17126" />
      <circle cx="12.007" cy="5.17126" r="2.17126" />
      <circle cx="18.8432" cy="5.17126" r="2.17126" />
      <circle cx="5.17126" cy="11.6849" r="2.17126" />
      <circle cx="12.007" cy="11.6849" r="2.17126" />
      <circle cx="18.8432" cy="11.6849" r="2.17126" />
      <circle cx="5.17126" cy="18.1986" r="2.17126" />
      <circle cx="12.007" cy="18.1986" r="2.17126" />
      <circle cx="18.8432" cy="18.1986" r="2.17126" />
    </svg>
  )
}
