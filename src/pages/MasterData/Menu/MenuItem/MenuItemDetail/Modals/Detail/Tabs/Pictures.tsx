import React, { useState } from 'react'
import { Modal, Upload } from 'antd'
import type { RcFile, UploadProps } from 'antd/es/upload'
import type { UploadFile } from 'antd/es/upload/interface'
import styled from 'styled-components'
import { PlusOutlined } from '@ant-design/icons'
import {
  useGetMenuItemDetailQuery,
  useGetMenuItemPictures,
} from '../../../../../../../../apis'
import FormUpload from '../../../../../../../../components/form/FormUpload'
import { ImageObject } from '../../../../../../../../models'
import DropZone from './DropZone'

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
  })
type Props = {
  visibleDropZone: boolean
  pictures: ImageObject[]
}

const Pictures: React.FC<Props> = ({ visibleDropZone, pictures }) => {
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [previewTitle, setPreviewTitle] = useState('')
  const [fileList, setFileList] = useState<UploadFile[]>(
    pictures.map(picture => {
      return {
        uid: picture.id,
        // url: picture.imageUrl,
        url: 'https://images.pexels.com/photos/13741227/pexels-photo-13741227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        name: picture.imageUrl,
      }
    })
  )

  const handleCancel = () => setPreviewOpen(false)

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile)
    }

    setPreviewImage(file.url || (file.preview as string))
    setPreviewOpen(true)
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1)
    )
  }

  const handleChange: UploadProps['onChange'] = ({
    fileList: newFileList,
    file,
  }) => {
    console.log(newFileList)
    setFileList(newFileList)
  }
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  )
  const extname = (url: string = '') => {
    const temp = url.split('/')
    const filename = temp[temp.length - 1]
    const filenameWithoutSuffix = filename.split(/#|\?/)[0]
    return (/\.[^./\\]*$/.exec(filenameWithoutSuffix) || [''])[0]
  }

  const isImageFileType = (type: string): boolean =>
    type.indexOf('image/') === 0

  const isImageUrl = (file: UploadFile): boolean => {
    if (file.type) {
      return isImageFileType(file.type)
    }
    const url: string = (file.thumbUrl || file.url) as string
    const extension = extname(url)
    if (
      /^data:image\//.test(url) ||
      /(webp|svg|png|gif|jpg|jpeg|jfif|bmp|dpg|ico)$/i.test(extension)
    ) {
      return true
    }
    if (/^data:/.test(url)) {
      // other file types of base64
      return false
    }
    if (extension) {
      // other file types which have extension
      return false
    }
    return true
  }

  return (
    <Container>
      <FormUpload
        name="images"
        uploadProps={{
          listType: 'picture-card',
          fileList,
          onPreview: handlePreview,
          onChange: handleChange,
          multiple: true,
          isImageUrl,
          beforeUpload: () => false,
        }}
      >
        {uploadButton}
      </FormUpload>

      {visibleDropZone && (
        <DropZone
          setFileList={setFileList}
          handleChange={handleChange}
          fileList={fileList}
        />
      )}
      <Modal visible={previewOpen} onCancel={handleCancel} footer={null}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </Container>
  )
}

const Container = styled.div`
  .ant-upload-list-item,
  .ant-upload-select-picture-card {
    border-radius: 0.5rem;
    margin-top: 12px;
  }
  .ant-upload {
    color: rgb(217, 217, 217);
  }
  .ant-upload-list-item-thumbnail img {
    object-fit: cover;
  }
`

export default Pictures
