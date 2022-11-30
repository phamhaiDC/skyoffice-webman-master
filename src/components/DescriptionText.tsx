type Props = {
  description?: string
}

const DescriptionText: React.FC<Props> = ({ description }) => {
  if (!description) {
    return <div />
  }

  return (
    <span className="font-normal text-xs text-gray-500">{description}</span>
  )
}

export default DescriptionText
