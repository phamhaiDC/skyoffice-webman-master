import { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Card, Tooltip } from 'antd'
import styled from 'styled-components'
import tw from 'twin.macro'
import { FullscreenOutlined } from '@ant-design/icons'

type Props = {
  title: string
  onViewFull?: () => void
  print?: React.ReactNode
}

export const ReportCard: React.FC<PropsWithChildren<Props>> = ({
  title,
  children,
  onViewFull,
  print,
}) => {
  const { t } = useTranslation()

  return (
    <StyledCard>
      <Title>
        <span>{title}</span>
        <Action>
          {/* {print} */}
          {!!onViewFull && (
            <Tooltip title={t('dashboard.viewFull')}>
              <StyledButton onClick={onViewFull}>
                <FullscreenOutlined className="text-xl" />
              </StyledButton>
            </Tooltip>
          )}
        </Action>
      </Title>
      {children}
    </StyledCard>
  )
}

const StyledCard = styled(Card)`
  filter: drop-shadow(2px 2px 12px rgba(0, 0, 0, 0.08));
  ${tw`rounded h-full`}

  .ant-card-body {
    ${tw`h-full p-5 flex flex-col gap-4 justify-between`}

    :before, :after {
      content: unset;
    }
  }
`

const Action = styled.div`
  ${tw`flex items-center justify-end gap-2`}
`

const Title = styled.span.attrs({
  className:
    'font-semibold text-base text-gray-1000 flex justify-between items-center capitalize',
})``

const StyledButton = styled(Button)`
  padding: 0;
  border-color: transparent;
  :hover,
  :active,
  :focus {
    border-color: transparent;
  }
`
