import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import HomePage from './home'
import LayoutPage from './layout.tsx'
import ReceiptPage from './receipt'
import VersionPage from './version'

const router = createBrowserRouter([
  {
    path: '/rent-receipt/',
    element: <LayoutPage />,
    children: [
      { element: <HomePage />, path: '/rent-receipt/' },
      {
        path: '/rent-receipt/v',
        element: <VersionPage />,
      },
      {
        path: '/rent-receipt/receipt',
        element: <ReceiptPage />,
      },
      { path: '*', element: <HomePage /> },
    ],
  },
])

const PageRoutes: React.FC = () => {
  return <RouterProvider router={router} />
}

export default PageRoutes
