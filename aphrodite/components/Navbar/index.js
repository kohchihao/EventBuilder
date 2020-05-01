import React, { useState } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import { auth } from '../../firebase';
import axios from '../../helpers/axios';
import { getCookie, removeCookie } from '../../helpers/cookie';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';

const Navigation = props => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const token = useSelector(state => state.token);
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const logout = () => {
    axios
      .delete('/auth/', {
        headers: {
          Authorization: 'Token ' + token
        }
      })
      .then(res => {
        auth.signOut().then(() => {});
        dispatch({
          type: 'LOGOUT'
        });
        router.replace('/');
      })
      .catch(err => {
        alert(err);
      });
  };

  return (
    <div>
      <Navbar color="light" light expand="md">
        <NavbarBrand href="/dashboard">BuildEvents</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink href="/dashboard">Dashboard</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/service-types">Service Types</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/services">Services</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/event-types">Event Types</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/packages">Packages</NavLink>
            </NavItem>

            <NavItem>
              <NavLink href="/providers">Providers</NavLink>
            </NavItem>

            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                Settings
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem>{user ? user.email : null}</DropdownItem>
                <DropdownItem onClick={logout}>Logout</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default Navigation;
