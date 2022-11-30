import { ReactNode, useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Button, Dropdown, Menu, message, Select, Switch, Tooltip } from 'antd'
import SimpleBar from 'simplebar-react'
import styled from 'styled-components'
import tw, { theme } from 'twin.macro'
import { InfoCircleOutlined } from '@ant-design/icons'
import { ReactComponent as ColumnsIcon } from '@assets/icons/CheckList.svg'
import { ReactComponent as FilterIcon } from '@assets/icons/Filter.svg'
import FormSelect from '@components/form/FormSelect'
import usePagination from '@hooks/usePagination'
import { Screen, useTablesStore } from '@store'
import { confirm } from '@utils/modal'
import { useGetConceptsQuery, useGetRestaurantsQuery } from '../apis'
import useFilter from '../hooks/useFilter'
import { CommonStatus, Region, RestaurantCreateInputs } from '../models'
import { Status } from '../models/swagger'
import { DeleteButton } from './elements/ActionButton'
import SearchInput from './elements/SearchInput'
import ChooseColumns from './ChooseColumns'
import FormDetail from './FormDetail'

type Props = {
  showDelete: boolean
  isDeleting: boolean
  screenName: Screen
  onDelete: () => void
  addButton?: ReactNode
  onSearch?: (search: string) => void
  title?: {
    name: string
    description?: string
  }
  hideFilter?: boolean
  isShowDropDownList?: boolean
  refetch?: () => void
}

const ListViewHeader = <T,>({
  showDelete,
  isDeleting,
  screenName,
  onDelete,
  addButton,
  onSearch,
  title,
  hideFilter,
  isShowDropDownList,
  refetch,
}: Props) => {
  const [visibleChooseCols, setVisibleChooseCols] = useState(false)
  const { t } = useTranslation()
  const status = useTablesStore(state => state.status)
  const setStatus = useTablesStore(state => state.setStatus)
  const [concepts, setConcepts] = useState<Region[]>([])
  const conceptPagination = usePagination()

  const filterList = (
    <Menu
      items={Object.keys(CommonStatus).map(item => {
        const mStatus = parseInt(item, 10) as unknown as Status
        return {
          label: (
            <div
              className="flex items-center gap-2 justify-between"
              onClick={e => e.stopPropagation()}
            >
              <span>{t(`${CommonStatus[mStatus]}`)}</span>
              <Switch
                size="small"
                checked={status.includes(mStatus)}
                onChange={e =>
                  setStatus(
                    e
                      ? [...status, mStatus]
                      : status.filter(_item => _item !== mStatus)
                  )
                }
              />
            </div>
          ),
          key: item,
        }
      })}
    />
  )
  const conceptFilter = useFilter({
    goToFirstPage: () => conceptPagination.setOffset(0),
  })

  const { data: conceptsResponse, isLoading: isFetchingConcepts } =
    useGetConceptsQuery(
      {
        // limit: conceptPagination.limit,
        offset: conceptPagination.offset,
        search: conceptFilter.search,
        status: [3],
      },
      {
        // onSuccess: data => setRegions([...regions, ...data.regions]),
        onError: (e: any) => {
          message.error({ content: e.message })
        },
      }
    )
  useEffect(() => {
    const data = conceptsResponse?.concepts
    if (data) {
      const activeConceptList = data.filter(concept => concept.status === 3)
      setConcepts(activeConceptList)
    }
  }, [conceptsResponse])
  const pagination = usePagination()
  // ----------------------------------------------

  // const formMethods = useForm<RestaurantCreateInputs>({
  //   defaultValues: { status: 1 },
  // })

  // const removeAccents = (str: string) => {
  //   return str
  //     .normalize('NFD')
  //     .replace(/[\u0300-\u036f]/g, '')
  //     .replace(/đ/g, 'd')
  //     .replace(/Đ/g, 'D')
  // }
  const { Option } = Select
  return (
    <Container>
      {title && (
        <TitleContainer>
          <TitleHeader>{title.name}</TitleHeader>
          {title.description && (
            <TitleDescription>
              <Tooltip title={title.description}>
                <InfoCircleOutlined />
              </Tooltip>
              {title.description}
            </TitleDescription>
          )}
        </TitleContainer>
      )}

      <Action>
        {onSearch ? (
          <div>
            <SearchInput
              placeholder={`${t('common.search')}...`}
              allowClear
              enterButton
              onSearch={onSearch}
              className="w-fit"
            />
            {isShowDropDownList && (
              <Select
                allowClear
                className="ml-2"
                onChange={refetch}
                showSearch
                style={{ width: 200 }}
                placeholder="Search to Select"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option!.children as unknown as string).includes(input)
                }
                filterSort={(optionA, optionB) =>
                  (optionA!.children as unknown as string)
                    .toLowerCase()
                    .localeCompare(
                      (optionB!.children as unknown as string).toLowerCase()
                    )
                }
              >
                {conceptsResponse?.concepts?.map(concept => (
                  <Option value={concept.id}>{concept.name}</Option>
                ))}
              </Select>
            )}
          </div>
        ) : (
          <div className="inline-block text-start align-top w-fit">{}</div>
        )}{' '}
        {/* {isShowDropDownList ? (
          <FormProvider {...formMethods}>
            <FormSelect
              name="conceptId"
              label={t('concept.concept')}
              formItemProps={{ tooltip: t('restaurant.tooltip.concept') }}
              options={[
                ...concepts.map(concept => ({
                  label: concept.name,
                  value: concept.id,
                })),
              ]}
              totalItem={conceptsResponse?.total}
              pagination={conceptPagination}
              searchItems={search => {
                setConcepts([])
                conceptFilter.setSearch(search)
              }}
              selectProps={{
                loading: isFetchingConcepts,
                placeholder: t('concept.selectConcept'),
                allowClear: true,
                showSearch: true,
                filterOption: (input, option) => {
                  return removeAccents(option?.label as unknown as string)
                    .toLowerCase()
                    .includes(removeAccents(input.toLocaleLowerCase()))
                },
              }}
            />
          </FormProvider>
        ) : (
          ''
        )} */}
        <ActionButtonContainer>
          {showDelete && (
            <DeleteButton
              loading={isDeleting}
              onClick={confirm(t('common.confirm.delete'), 'danger', onDelete)}
            >
              {t('common.delete')}
            </DeleteButton>
          )}
          {!hideFilter ? (
            <Dropdown
              overlay={filterList}
              trigger={['click']}
              placement="bottomRight"
            >
              <Button icon={<FilterIcon className="h-full" />} shape="circle" />
            </Dropdown>
          ) : (
            <div>{}</div>
          )}
          <Button
            icon={<ColumnsIcon className="h-full" />}
            onClick={() => setVisibleChooseCols(true)}
            shape="circle"
          />
          <ChooseColumns<T>
            onClose={() => setVisibleChooseCols(false)}
            visible={visibleChooseCols}
            screenName={screenName}
          />
          {addButton}
        </ActionButtonContainer>
      </Action>
    </Container>
  )
}

export default ListViewHeader

const Container = styled.div`
  ${tw`mb-4 flex flex-col gap-4`}
`
const TitleContainer = styled.div`
  ${tw`h-14 flex justify-center items-start flex-col px-8`}
  border-bottom: 1px solid ${theme`colors.table.line` as string};
`

const TitleHeader = styled.span`
  ${tw`font-medium text-gray-800 text-base`}
`
const TitleDescription = styled.span`
  ${tw`text-gray-400 text-xs flex justify-center items-center gap-1`}
`

const Action = styled.div`
  ${tw`flex gap-4 justify-between px-8`}
`

const ActionButtonContainer = styled.div`
  ${tw`flex gap-4`}
`
