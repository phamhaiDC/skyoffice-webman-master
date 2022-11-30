import styled from 'styled-components'
import tw, { theme } from 'twin.macro'
import { ReactComponent as CancelIcon } from '@assets/icons/Cancel.svg'
import AnimateIcon from './AnimateIcon'

type Props = {
  title: string
  onClose: () => void
}

const DrawerTitle: React.FC<Props> = ({ title, onClose }) => {
  return (
    <Container>
      <span>{title}</span>
      <AnimateIcon
        activeColor={theme`colors.white`}
        bgColor={theme`colors.red.500`}
        onClick={onClose}
      >
        <CancelIcon />
      </AnimateIcon>
    </Container>
  )
}

const Container = styled.div`
  ${tw`flex justify-between items-center`}
`

export default DrawerTitle
