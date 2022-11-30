import { ComboScheme } from '@models'
import ComboSchemeDetailList from '../../../../ComboSchemeDetail/ComboSchemeDetailList'

type Props = {
  comboScheme: Pick<ComboScheme, 'id' | 'name' | 'useUpperLimit'>
  isUpdatingParent: boolean
  onSaveParent: () => void
}

const ComboSchemeDetails: React.FC<Props> = ({
  comboScheme,
  isUpdatingParent,
  onSaveParent,
}) => {
  return (
    <div className="mt-4">
      <ComboSchemeDetailList
        comboScheme={comboScheme}
        isUpdatingParent={isUpdatingParent}
        onSaveParent={onSaveParent}
      />
    </div>
  )
}

export default ComboSchemeDetails
