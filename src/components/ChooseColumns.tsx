import { Controller, DefaultValues, Path, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Button, Checkbox, Drawer, Menu } from 'antd'
import SimpleBar from 'simplebar-react'
import styled from 'styled-components'
import tw from 'twin.macro'
import { Column, Columns, Screen, useTablesStore } from '../store'
import { lowerFirstChar } from '../utils/string'
import DrawerTitle from './elements/DrawerTitle'
import { DrawerDetailProps } from './DrawerDetail'

export type Props = Pick<DrawerDetailProps, 'visible' | 'onClose'> & {
  screenName: Screen
}

const ChooseColumns = <T,>({ onClose, visible, screenName }: Props) => {
  const { t } = useTranslation()
  const columns = useTablesStore(store => store[screenName].columns)
  const setColumns = useTablesStore(store => store.setColumns)
  const formMethods = useForm<Columns<T>>({
    defaultValues: columns as unknown as DefaultValues<Columns<T>>,
  })
  const { handleSubmit, control, watch } = formMethods

  const handleSave = handleSubmit(data => {
    setColumns(screenName, data as Columns<T>)
    onClose()
  })

  return (
    <StyledDrawer
      title={
        <DrawerTitle title={t('common.chooseColumns')} onClose={onClose} />
      }
      visible={visible}
      closable={false}
      mask={false}
      footer={
        <Footer>
          <Button onClick={handleSave} type="primary">
            {t('common.ok')}
          </Button>
          <Button onClick={onClose}>{t('common.cancel')}</Button>
        </Footer>
      }
    >
      <Content>
        <span className="font-semibold">{t('common.columns')}</span>
        <SimpleBar className="pl-2 pt-3 flex flex-col gap-2 h-5/6 flex-1">
          <StyledMenu>
            {Object.entries<Column>(columns).map(([col, state]) => (
              <StyledMenuItem key={col}>
                <Controller<Columns<T>>
                  // @ts-ignore
                  name={`${col}.checked`}
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Checkbox
                      className="m-0 w-full"
                      checked={
                        (value ||
                          watch(`${col}.fixed` as Path<Columns<T>>)) as boolean
                      }
                      onChange={onChange}
                      disabled={state.fixed}
                    >
                      <span className="w-full">
                        {t(`common.field.${lowerFirstChar(col)}`)}
                      </span>
                    </Checkbox>
                  )}
                />
              </StyledMenuItem>
            ))}
          </StyledMenu>
        </SimpleBar>
      </Content>
    </StyledDrawer>
  )
}

export default ChooseColumns

const Footer = styled.div`
  ${tw`flex gap-2`}
`

const Content = styled.div`
  ${tw`flex flex-col h-full`}
`

const StyledDrawer = styled(Drawer)`
  height: 100vh;
  .ant-drawer-header {
    ${tw`px-4 py-3`}
    border-bottom: transparent;
  }

  .ant-drawer-title {
    ${tw`font-bold text-2xl`}
  }

  .ant-drawer-body {
    ${tw`pr-0`}
  }

  .ant-drawer-footer {
    ${tw`h-14 px-4 py-3 flex items-center`}
  }

  .ant-drawer-content-wrapper {
    ${tw`mt-12`}
    height: calc(100vh - 48px);
  }
`

const StyledMenu = styled(Menu)`
  border: none;

  .ant-menu-item {
    padding: 0;
    margin: 0;
  }

  .ant-menu-item:not(:last-child) {
    margin-bottom: 0;
  }

  .ant-menu-item-selected {
    background-color: transparent !important;
  }

  .ant-checkbox-wrapper {
    ${tw`pl-2`}
  }
`

const StyledMenuItem = styled(Menu.Item)`
  ${tw`m-0`}
`
