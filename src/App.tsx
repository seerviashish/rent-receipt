import { BrowserRouter } from 'react-router-dom'
import PageRoutes from './pages/routes'

const App: React.FC = () => {
  return (
    <BrowserRouter basename="rent-receipt">
      <PageRoutes />
    </BrowserRouter>
  )
}

export default App
