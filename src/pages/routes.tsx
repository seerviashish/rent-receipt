import { Route, Routes } from 'react-router-dom'
import HomePage from './home'
import Layout from './layout'
import ReceiptPage from './receipt'

const PageRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="" element={<Layout />}>
        <Route path="" element={<HomePage />} />
        <Route path="receipt" element={<ReceiptPage />} />
        <Route path="*" element={<HomePage />} />
      </Route>
    </Routes>
  )
}

export default PageRoutes
