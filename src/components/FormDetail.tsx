import React, { PropsWithChildren } from 'react'
import { Form } from 'antd'
import SimpleBar from 'simplebar-react'
import styled from 'styled-components'
import tw from 'twin.macro'
import Spin from '@components/elements/Spin'
import FormFooter from '@components/FormFooter'

type FormDetailProps = PropsWithChildren<{
  isFetching: boolean
  isExecuting: boolean
  onCancel: () => void
  onSave: () => void
}>

const FormDetail: React.FC<FormDetailProps> = ({
  isFetching,
  isExecuting,
  onCancel,
  onSave,
  children,
}) => {
  return (
    <FormContainer>
      <div className="flex-1 overflow-auto">
        <ScrollableContent>
          {isFetching ? (
            <Spin />
          ) : (
            <Form
              className="flex-1 flex flex-col"
              size="middle"
              layout="vertical"
            >
              {children}
            </Form>
          )}
        </ScrollableContent>
      </div>
      <FormFooter
        onCancel={onCancel}
        onSave={onSave}
        isLoading={isExecuting}
        disabled={isFetching}
      />
    </FormContainer>
  )
}

export default FormDetail

const FormContainer = styled.div.attrs({
  className: 'h-full flex flex-col',
})``

const ScrollableContent = styled(SimpleBar).attrs({
  className: 'h-full px-8 pb-4 pt-2',
})`
  .simplebar-content {
    ${tw`px-8 py-4 h-full`}
  }
`
