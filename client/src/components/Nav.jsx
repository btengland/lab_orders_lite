import React from 'react'
import { useLocation, Link } from 'react-router-dom'
import { 
  Container, 
  Navbar, 
  NavbarBrand, 
  Nav as BootstrapNav, 
  NavItem, 
  NavLink 
} from 'reactstrap'

function Nav() {
  const location = useLocation()
  
  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <Navbar color="primary" dark expand="md" className="mb-4 navbar-top-fixed">
      <Container>
        <NavbarBrand tag={Link} to="/patients">
          Lab Orders Lite
        </NavbarBrand>
        <BootstrapNav navbar>
          <NavItem>
            <NavLink 
              tag={Link}
              to="/patients" 
              active={isActive('/patients')}
            >
              Patients
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink 
              tag={Link}
              to="/catalog"
              active={isActive('/catalog')}
            >
              Lab Test Catalog
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink 
              tag={Link}
              to="/orders"
              active={isActive('/orders')}
            >
              Orders
            </NavLink>
          </NavItem>
        </BootstrapNav>
      </Container>
    </Navbar>
  )
}

export default Nav