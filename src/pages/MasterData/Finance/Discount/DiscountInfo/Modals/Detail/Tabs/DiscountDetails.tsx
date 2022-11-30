import { useFormContext } from 'react-hook-form'
import { Discount } from '@models'
import { DiscountDetailList } from '../../../../DiscountDetail'

type Props = {
  discount: Discount
  isUpdatingParent: boolean
  handleSaveParent: () => void
}

const DiscountDetails: React.FC<Props> = ({
  discount,
  isUpdatingParent,
  handleSaveParent,
}) => {
  const { watch, formState } = useFormContext()
  const { isDirty } = formState

  const countType = watch('countType')

  return (
    <div className="mt-4">
      <DiscountDetailList
        discount={{
          ...discount,
          classification: {
            ...discount.classification,
            name: discount.classification?.name || '',
            status: discount.status || 0,
            id: watch('classificatorGroupId') || 0,
          },
          countType: countType ?? discount.countType,
        }}
        isUpdatingParent={isUpdatingParent}
        onSaveDiscount={() => {
          if (isDirty) {
            handleSaveParent()
          }
        }}
      />
    </div>
  )
}

export default DiscountDetails
