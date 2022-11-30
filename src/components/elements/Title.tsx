import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import tw, { theme } from 'twin.macro'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useFormStateStore } from '../../store'
import { confirm } from '../../utils/modal'

export const TitleBar = styled.div.attrs({
  className: 'h-14 flex items-center py-2 px-4',
})`
  border-bottom: 1px solid ${theme`colors.menu.line`};
`

export const Title = styled.div`
  ${tw`relative h-[40px] flex items-center px-3 font-medium text-base gap-2`}
  line-height: 40px;
  ::before {
    content: '';
    ${tw`absolute left-0 top-2 bottom-2 w-1 rounded-full bg-primary-500`};
  }
`

export const TitleText = styled.span.attrs({
  className: 'font-medium text-base',
})``

export const TitleContent = styled.div.attrs({
  className: 'py-2 flex items-center font-semibold text-base h-10 gap-2',
})``

const X = styled(Title)`
  ${tw`my-2 mx-8`}
  ::before {
    content: '';
    ${tw`absolute top-2 bottom-2 left-0 w-1 bg-primary-500 rounded-full`}
  }
`

type Props = { label: string }
const PageTitle: React.FC<Props> = ({ label }) => {
  return <X>{label}</X>
}

export default PageTitle

type TreeDetailTitleProps = {
  title: string
  onBack: () => void
}

export const TreeDetailTitle: React.FC<TreeDetailTitleProps> = ({
  title,
  onBack,
}) => {
  const { t } = useTranslation()
  const isDirty = useFormStateStore(state => state.isDirty)

  const back = () => {
    if (isDirty) {
      return confirm(t('common.confirm.unsave'), 'primary', onBack)()
    }
    return onBack()
  }

  return (
    <TitleBar>
      <TitleContent>
        <ArrowLeftOutlined onClick={back} className="cursor-pointer" />
        <TitleText>{title}</TitleText>
      </TitleContent>
    </TitleBar>
  )
}
