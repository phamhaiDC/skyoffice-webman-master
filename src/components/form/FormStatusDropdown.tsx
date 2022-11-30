import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Dropdown, DropDownProps, FormItemProps, Menu } from 'antd'
import styled from 'styled-components'
import tw, { theme } from 'twin.macro'
import { DownOutlined } from '@ant-design/icons'
import { CommonStatus } from '../../models'
import { Status } from '../../models/swagger'
import { ControlledFormItem } from './ControlledFormItem'

type Props = {
  label?: string
  name?: string
  formItemProps?: FormItemProps
  dropdownProps?: DropDownProps
}

const FormStatusDropdown: React.FC<Props> = ({
  dropdownProps,
  label,
  name = 'status',
  ...rest
}) => {
  const [visible, setVisible] = useState(false)
  const { t } = useTranslation()

  return (
    <ControlledFormItem
      {...rest}
      name={name}
      formItemProps={{
        className: `${rest.formItemProps?.className} !mb-0`,
      }}
      render={({ value, onChange }) => (
        <StyledDropdownButton
          {...dropdownProps}
          className={`status-${value}`}
          status={value}
          visible={visible}
          onVisibleChange={setVisible}
          onClick={() => setVisible(true)}
          overlay={
            <StyledMenu
              selectedKeys={[value]}
              onClick={e => {
                onChange(+e.key)
                setVisible(false)
              }}
              items={Object.entries(CommonStatus)
                .map(([key, val]) => ({
                  key,
                  label: t(`${val}`),
                  className: `status-${key}`,
                }))
                .filter(
                  item =>
                    +item.key !== 4 &&
                    ((value === 3 && +item.key === 2) ||
                      (value === 2 && +item.key === 3) ||
                      ([0, 1].includes(value) && [2, 3].includes(+item.key)))
                )}
            />
          }
          trigger={['click']}
          size="small"
          icon={<DownOutlined />}
        >
          {label}
        </StyledDropdownButton>
      )}
    />
  )
}

export default FormStatusDropdown

const StyledDropdownButton = styled(Dropdown.Button)<{ status: Status }>`
  .ant-btn:first-child:not(:last-child) {
    border-top-left-radius: 30px;
    border-bottom-left-radius: 30px;
  }

  .ant-btn:last-child:not(:first-child) {
    border-top-right-radius: 30px;
    border-bottom-right-radius: 30px;
  }

  // common
  &.status-1,
  &.status-2,
  &.status-3,
  &.status-4,
  &.status-0 {
    button:first-child {
      ${tw`pl-3 pr-2`}
    }

    button:first-child span {
      min-width: 3rem;
    }

    :hover {
      button {
        ${tw`bg-opacity-70`}
      }
    }
  }

  // for border
  &.status-0 {
    button {
      ${tw`border-red-400 border-opacity-50`}
    }

    :hover {
      button {
        ${tw`border-red-400 border-opacity-50`}
      }

      button:first-child {
        border-right: 1px solid ${theme`colors.red.400`};
      }

      button:last-child {
        border-left: 1px solid ${theme`colors.red.400`};
      }
    }
  }

  &.status-1 {
    button {
      ${tw`border-gray-100 border-opacity-50`}
    }

    :hover {
      button {
        ${tw`border-gray-100 border-opacity-50`}
      }

      button:first-child {
        border-right: 1px solid ${theme`colors.gray.100`};
      }

      button:last-child {
        border-left: 1px solid ${theme`colors.gray.100`};
      }
    }
  }

  &.status-2 {
    button {
      ${tw`border-yellow-400 border-opacity-50`}
    }

    :hover {
      button {
        ${tw`border-yellow-400 border-opacity-50`}
      }

      button:first-child {
        border-right: 1px solid ${theme`colors.yellow.400`};
      }

      button:last-child {
        border-left: 1px solid ${theme`colors.yellow.400`};
      }
    }
  }

  &.status-3 {
    button {
      ${tw`border-green-400 border-opacity-50`}
    }

    :hover {
      button {
        ${tw`border-green-400 border-opacity-50`}
      }

      button:first-child {
        border-right: 1px solid ${theme`colors.green.400`};
      }

      button:last-child {
        border-left: 1px solid ${theme`colors.green.400`};
      }
    }
  }

  &.status-4 {
    button {
      ${tw`border-blue-400 border-opacity-50`}
    }

    :hover {
      button {
        ${tw`border-blue-400 border-opacity-50`}
      }

      button:first-child {
        border-right: 1px solid ${theme`colors.blue.400`};
      }

      button:last-child {
        border-left: 1px solid ${theme`colors.blue.400`};
      }
    }
  }

  // for text color
  &.status-1 {
    button {
      ${tw`text-gray-700`}
    }

    :hover {
      button {
        ${tw`text-gray-700`}
      }
    }
  }

  &.status-0,
  &.status-2,
  &.status-3,
  &.status-4 {
    button {
      ${tw`text-gray-100`}
    }

    :hover {
      button {
        ${tw`text-gray-100`}
      }
    }
  }

  // for background
  &.status-0 button {
    ${tw`bg-status-0`}
  }

  &.status-1 button {
    ${tw`bg-status-1`}
  }

  &.status-2 button {
    ${tw`bg-status-2`}
  }

  &.status-3 button {
    ${tw`bg-status-3`}
  }

  &.status-4 button {
    ${tw`bg-status-4`}
  }

  [ant-click-animating-without-extra-node='true']::after {
    display: none;
  }
`

const StyledMenu = styled(Menu)`
  ${tw`!py-0`};

  .ant-dropdown-menu-item {
    min-width: 5.625rem;
    /* &.status-0 {
      ${tw`bg-status-0 text-gray-100`}
    } */
  }
`
