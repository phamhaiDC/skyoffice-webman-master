import NumberFormat from 'react-number-format'

type Props = {
  value: number
}

const ThousandNumber: React.FC<Props> = ({ value }) => {
  return <NumberFormat value={value} displayType="text" thousandSeparator />
}

export default ThousandNumber
