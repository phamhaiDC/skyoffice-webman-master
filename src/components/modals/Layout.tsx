import styled from 'styled-components'
import tw, { theme } from 'twin.macro'
import { ReactComponent as NoDataIcon } from '@assets/icons/EmptyIcon.svg'
import NoData from '../elements/NoData'

export const NoDataContainer = () => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <NoData icon={<NoDataIcon />} />
    </div>
  )
}

export const Header = styled.div`
  ${tw`flex items-center justify-between pt-2 pb-[6px] pr-4 text-base font-medium`}
`

export const Action = styled.div`
  ${tw`flex gap-2 items-center justify-center`}
`

export const Right = styled.div`
  ${tw`w-3/5`}
`

export const Left = styled.div`
  height: 100%;
  ${tw`w-2/5`}
  border-right: 1px solid ${theme`colors.table.line` as string};
`
export const FadedText = styled.span`
  ${tw`text-xs font-normal text-gray-500`}
`
