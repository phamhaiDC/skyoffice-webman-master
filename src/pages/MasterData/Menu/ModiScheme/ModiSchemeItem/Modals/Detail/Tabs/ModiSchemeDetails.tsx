import { ModiScheme } from '@models'
import ModiSchemeDetailList from '../../../../ModiSchemeDetail/ModiSchemeDetailList'

type Props = {
  modiScheme: Pick<ModiScheme, 'id' | 'name' | 'useUpperLimit'>
  isUpdatingParent: boolean
  onSaveParent: () => void
}

const ModiSchemeDetails: React.FC<Props> = ({
  modiScheme,
  isUpdatingParent,
  onSaveParent,
}) => {
  return (
    <div className="mt-4">
      <ModiSchemeDetailList
        modiScheme={modiScheme}
        isUpdatingParent={isUpdatingParent}
        onSaveParent={onSaveParent}
      />
    </div>
  )
}

export default ModiSchemeDetails
