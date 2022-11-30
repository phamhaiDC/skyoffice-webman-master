import { useTranslation } from 'react-i18next'
import { Col, message, Tooltip } from 'antd'
import styled from 'styled-components'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { useGetClassificationGroupsQuery } from '@apis'
import DescriptionText from '@components/DescriptionText'
import { Star } from '@components/elements/FormItemLabel'
import FormSelect from '@components/form/FormSelect'
import { NoDataContainer } from '@components/modals/Layout'
import { Classification as ClassificationModel } from '@models'

type Props = {
  classifications?: ClassificationModel[]
}

const Classifications: React.FC<Props> = ({ classifications = [] }) => {
  const { data } = useGetClassificationGroupsQuery(
    {},
    {
      onError: (e: any) => {
        message.error({ content: e.message })
      },
    }
  )

  if (!classifications.length) {
    return <NoDataContainer />
  }

  return (
    <>
      {classifications.map((classification, index) => (
        <Classification key={classification.id}>
          <Col span={12} className="pb-4">
            <div className="flex flex-col">
              <span className="font-semibold">
                {classification.name}
                {!!classification.groupingRequired && <Star>*</Star>}
                <Tooltip
                  title={classification.description || classification.name}
                >
                  <QuestionCircleOutlined className="text-gray-400 cursor-help ml-2" />
                </Tooltip>
              </span>
              <DescriptionText description={classification.description} />
            </div>
          </Col>
          <Col span={12}>
            <ClassificationItem
              classificator={
                data?.classificatorGroups?.filter(
                  i => i.parentId === classification.id
                ) || []
              }
              name={`classificatorGroups.${index}`}
              isRequired={!!classification.groupingRequired}
            />
          </Col>
        </Classification>
      ))}
    </>
  )
}

export default Classifications

const Classification = styled.div.attrs({
  className: 'flex items-center',
})``

type ClassificationItemProps = {
  name: string
  isRequired: boolean
  classificator: ClassificationModel[]
}

const ClassificationItem = ({
  name,
  isRequired,
  classificator,
}: ClassificationItemProps) => {
  const { t } = useTranslation()
  return (
    <FormSelect
      name={`${name}.numInGroup`}
      rules={
        isRequired ? { required: t('common.rule.classification') } : undefined
      }
      options={[
        ...(classificator || []).map(item => ({
          label: item.name,
          value: item.id,
        })),
      ]}
      selectProps={{
        placeholder: t('menuItem.selectClassification'),
        allowClear: true,
      }}
    />
  )
}
