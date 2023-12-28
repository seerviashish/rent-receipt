import { Home as HomeIcon } from '@mui/icons-material'
import { AppBar, Box, Button, Container, Toolbar } from '@mui/material'
import * as React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

const pages = [
  { name: 'Home', link: '/rent-receipt/' },
  { name: 'Version', link: '/rent-receipt/v' },
  { name: 'View Receipt', link: '/rent-receipt/receipt' },
]

const Layout: React.FC = () => {
  const navigate = useNavigate()

  return (
    <main>
      <AppBar position="sticky">
        <Container style={{ maxWidth: '100%' }}>
          <Toolbar disableGutters>
            <HomeIcon sx={{ display: { xs: 'flex', md: 'flex' }, mr: 0 }} />
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'flex' } }}>
              {pages.map((page) => (
                <Button
                  key={page.name}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                  onClick={() => {
                    navigate(page.link)
                  }}
                >
                  {page.name}
                </Button>
              ))}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Outlet />
    </main>
  )
}

export default Layout
