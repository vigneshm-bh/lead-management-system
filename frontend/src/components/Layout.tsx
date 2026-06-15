/** @jsxImportSource @emotion/react */
import React from 'react';
import styled from '@emotion/styled';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, colors } from '../styles/shared';

const LayoutWrapper = styled.div`
  min-height: 100vh;
  background: ${colors.background};
`;

const Navbar = styled.nav`
  background: ${colors.surface};
  border-bottom: 1px solid ${colors.border};
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Logo = styled.span`
  font-size: 20px;
  font-weight: 700;
  color: ${colors.primary};
`;

const NavLinks = styled.div`
  display: flex;
  gap: 24px;
  align-items: center;
`;

const StyledNavLink = styled(NavLink)`
  text-decoration: none;
  color: ${colors.textSecondary};
  font-weight: 500;
  font-size: 14px;
  padding: 8px 0;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;

  &.active {
    color: ${colors.primary};
    border-bottom-color: ${colors.primary};
  }

  &:hover {
    color: ${colors.primary};
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: ${colors.textSecondary};
`;

const Content = styled.main`
  padding: 32px 0;
`;

const Layout: React.FC = () => {
  const { username, logout } = useAuth();

  return (
    <LayoutWrapper>
      <Navbar>
        <NavLinks>
          <Logo>LeadManager</Logo>
          <StyledNavLink to="/">Dashboard</StyledNavLink>
          <StyledNavLink to="/leads">Leads</StyledNavLink>
        </NavLinks>
        <UserInfo>
          <span>{username}</span>
          <Button variant="secondary" onClick={logout} style={{ padding: '6px 14px', fontSize: '13px' }}>
            Logout
          </Button>
        </UserInfo>
      </Navbar>
      <Content>
        <Outlet />
      </Content>
    </LayoutWrapper>
  );
};

export default Layout;

