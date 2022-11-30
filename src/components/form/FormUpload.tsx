import { PropsWithChildren } from 'react'
import { ControllerProps } from 'react-hook-form'
import { Upload, UploadProps } from 'antd'
import { ControlledFormItem } from './ControlledFormItem'

type Props = PropsWithChildren<
  {
    name: string
    uploadProps?: UploadProps
  } & Omit<ControllerProps, 'render'>
>

const FormUpload: React.FC<Props> = ({ uploadProps, children, ...rest }) => {
  return (
    <ControlledFormItem
      {...rest}
      render={({ value, onChange }) => {
        return (
          <Upload {...{ value, onChange }} {...uploadProps}>
            {children}
          </Upload>
        )
      }}
    />
  )
}

export default FormUpload
