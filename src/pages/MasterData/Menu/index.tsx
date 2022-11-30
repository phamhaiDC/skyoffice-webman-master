import { Navigate, Route, Routes } from 'react-router-dom'
import ClassificationGroup from './Classification'
import Combo from './Combo'
import ComboScheme from './ComboScheme'
import MenuItem from './MenuItem'
import Modifier from './Modifier'
import ModiScheme from './ModiScheme'

const Menu = () => {
  return (
    <Routes>
      <Route element={<Modifier />} path="modi-groups/*" />
      <Route element={<MenuItem />} path="menu-groups/*" />
      <Route element={<Combo />} path="combo-groups/*" />
      <Route element={<ModiScheme />} path="modifier-schemes/*" />
      <Route element={<ComboScheme />} path="combo-schemes/*" />
      <Route element={<ClassificationGroup />} path="classification-groups/*" />
      <Route element={<Navigate to="menu-groups" />} path="" />
    </Routes>
  )
}

export default Menu
