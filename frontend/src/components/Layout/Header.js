import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Menu, X, User, LogOut, Settings } from 'lucide-react';

const HeaderContainer = styled.header`
  background: ${({ theme }) => theme.colors.background.primary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
  position: sticky;
  top: 0;
  z-index: ${({ theme }) => theme.zIndex.sticky};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const Nav = styled.nav`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing[6]};
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  text-decoration: none;
  color: ${({ theme }) => theme.colors.primary[600]};
  font-family: ${({ theme }) => theme.fonts.secondary};
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};

  &:hover {
    text-decoration: none;
    color: ${({ theme }) => theme.colors.primary[700]};
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[8]};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: ${({ theme }) => theme.colors.text.secondary};
  text-decoration: none;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  padding: ${({ theme }) => theme.spacing[2]} 0;
  border-bottom: 2px solid transparent;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.primary[600]};
    border-bottom-color: ${({ theme }) => theme.colors.primary[200]};
    text-decoration: none;
  }

  &.active {
    color: ${({ theme }) => theme.colors.primary[600]};
    border-bottom-color: ${({ theme }) => theme.colors.primary[500]};
  }
`;

const AuthSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const AuthButton = styled(Link)`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[6]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  text-decoration: none;
  transition: all ${({ theme }) => theme.transitions.fast};
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};

  &.login {
    color: ${({ theme }) => theme.colors.primary[600]};
    background: transparent;
    border: 1px solid ${({ theme }) => theme.colors.primary[200]};

    &:hover {
      background: ${({ theme }) => theme.colors.primary[50]};
      text-decoration: none;
      color: ${({ theme }) => theme.colors.primary[700]};
    }
  }

  &.register {
    color: white;
    background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[500]}, ${({ theme }) => theme.colors.primary[600]});
    box-shadow: ${({ theme }) => theme.shadows.sm};

    &:hover {
      transform: translateY(-1px);
      box-shadow: ${({ theme }) => theme.shadows.md};
      text-decoration: none;
      color: white;
    }
  }
`;

const UserMenu = styled.div`
  position: relative;
`;

const UserButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  background: ${({ theme }) => theme.colors.background.secondary};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.background.tertiary};
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: ${({ theme }) => theme.spacing[2]};
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  min-width: 200px;
  overflow: hidden;
  z-index: ${({ theme }) => theme.zIndex.dropdown};
`;

const DropdownItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  color: ${({ theme }) => theme.colors.text.secondary};
  text-decoration: none;
  transition: background-color ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.background.secondary};
    color: ${({ theme }) => theme.colors.text.primary};
    text-decoration: none;
  }
`;

const DropdownButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  color: ${({ theme }) => theme.colors.text.secondary};
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.background.secondary};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing[2]};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: block;
  }
`;

const MobileMenu = styled.div`
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  padding: ${({ theme }) => theme.spacing[4]};

  &.open {
    display: block;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: block;
  }
`;

const MobileNavLink = styled(Link)`
  display: block;
  padding: ${({ theme }) => theme.spacing[3]} 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-decoration: none;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};

  &:hover {
    color: ${({ theme }) => theme.colors.primary[600]};
    text-decoration: none;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <HeaderContainer>
      <Nav>
        <Logo to="/">
          SkinWise
        </Logo>

        <NavLinks>
          <NavLink to="/products">Products</NavLink>
          <NavLink to="/skin-analysis">Skin Analysis</NavLink>
          {user && <NavLink to="/dashboard">Dashboard</NavLink>}
        </NavLinks>

        <AuthSection>
          {user ? (
            <UserMenu>
              <UserButton onClick={() => setShowUserMenu(!showUserMenu)}>
                <User size={18} />
                {user.firstName}
              </UserButton>
              
              {showUserMenu && (
                <DropdownMenu>
                  <DropdownItem to="/profile" onClick={() => setShowUserMenu(false)}>
                    <Settings size={16} />
                    Profile
                  </DropdownItem>
                  <DropdownButton onClick={handleLogout}>
                    <LogOut size={16} />
                    Logout
                  </DropdownButton>
                </DropdownMenu>
              )}
            </UserMenu>
          ) : (
            <>
              <AuthButton to="/login" className="login">
                Login
              </AuthButton>
              <AuthButton to="/register" className="register">
                Get Started
              </AuthButton>
            </>
          )}
        </AuthSection>

        <MobileMenuButton onClick={() => setShowMobileMenu(!showMobileMenu)}>
          {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
        </MobileMenuButton>
      </Nav>

      <MobileMenu className={showMobileMenu ? 'open' : ''}>
        <MobileNavLink to="/products" onClick={() => setShowMobileMenu(false)}>
          Products
        </MobileNavLink>
        <MobileNavLink to="/skin-analysis" onClick={() => setShowMobileMenu(false)}>
          Skin Analysis
        </MobileNavLink>
        {user ? (
          <>
            <MobileNavLink to="/dashboard" onClick={() => setShowMobileMenu(false)}>
              Dashboard
            </MobileNavLink>
            <MobileNavLink to="/profile" onClick={() => setShowMobileMenu(false)}>
              Profile
            </MobileNavLink>
            <MobileNavLink to="#" onClick={() => { handleLogout(); setShowMobileMenu(false); }}>
              Logout
            </MobileNavLink>
          </>
        ) : (
          <>
            <MobileNavLink to="/login" onClick={() => setShowMobileMenu(false)}>
              Login
            </MobileNavLink>
            <MobileNavLink to="/register" onClick={() => setShowMobileMenu(false)}>
              Register
            </MobileNavLink>
          </>
        )}
      </MobileMenu>
    </HeaderContainer>
  );
};

export default Header;