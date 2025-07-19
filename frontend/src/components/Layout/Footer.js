import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background: ${({ theme }) => theme.colors.background.tertiary};
  border-top: 1px solid ${({ theme }) => theme.colors.border.light};
  padding: ${({ theme }) => theme.spacing[8]} 0;
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const Footer = () => {
  return (
    <FooterContainer>
      <div className="container">
        <p>© 2024 SkinWise. All rights reserved.</p>
      </div>
    </FooterContainer>
  );
};

export default Footer;