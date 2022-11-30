import { Upload } from 'antd'
import { UploadChangeParam, UploadFile } from 'antd/lib/upload'
import styled from 'styled-components'

type Props = {
  fileList: UploadFile<any>[]
  setFileList: (file: any) => void
  handleChange: (info: UploadChangeParam<UploadFile<any>>) => void
}

const DropZone: React.FC<Props> = ({ handleChange, fileList }) => {
  return (
    <Container>
      <DropContent className="h-full flex justify-center items-center	">
        <Upload
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          listType="picture-card"
          fileList={fileList}
          onChange={handleChange}
          multiple
        >
          Drag file to this area to upload
        </Upload>
      </DropContent>
    </Container>
  )
}
const Container = styled.div`
  position: absolute;
  height: 100%;
  top: 32px;
  left: 0;
  bottom: 0;
  right: 32px;
  border-radius: 10px;
  z-index: 9999;

  .ant-upload-list-item,
  .ant-upload-list-item-done,
  .ant-upload-list-item-list-type-picture-card {
    display: none;
    visibility: hidden;
    margin: 0;
  }

  .ant-upload.ant-upload-select-picture-card {
    margin: 0;
  }

  .ant-upload {
    width: 100%;
    height: calc(100% - 64px);
    background-color: #fafafafa;
    opacity: 0.7;
    color: #161616;
    font-size: 16px;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    border-radius: 10px;
    box-sizing: border-box;
    margin: 0;
  }
  .ant-upload.ant-upload-select-picture-card {
    border: 3px dashed rgb(217, 217, 217);
  }
`

const DropContent = styled.div``
export default DropZone
