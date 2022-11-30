import styled from 'styled-components'
import tw from 'twin.macro'

type Props = {
  label?: string
  required?: boolean
}

const FormItemLabel: React.FC<Props> = ({ label, required }) => {
  return (
    <>
      {label}
      {required && <Star>*</Star>}
    </>
  )
}

export default FormItemLabel

export const Star = styled.span`
  ${tw`pl-2 text-red-500`}
  font-family: SimSun, sans-serif;
`
