import { 
  Container, 
  Navbar, 
  NavbarBrand, 
  Nav as BootstrapNav, 
  NavItem, 
  NavLink 
} from 'reactstrap'

function Nav({ activeTab, setActiveTab }) {
  return (
    <Navbar color="primary" dark expand="md" className="mb-4 navbar-top-fixed">
      <Container>
        <NavbarBrand href="/">Lab Orders Lite</NavbarBrand>
        <BootstrapNav navbar>
          <NavItem>
            <NavLink 
              href="#" 
              active={activeTab === 'patients'}
              onClick={() => setActiveTab('patients')}
            >
              Patients
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink 
              href="#" 
              active={activeTab === 'catalog'}
              onClick={() => setActiveTab('catalog')}
            >
              Lab Test Catalog
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink 
              href="#" 
              active={activeTab === 'orders'}
              onClick={() => setActiveTab('orders')}
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