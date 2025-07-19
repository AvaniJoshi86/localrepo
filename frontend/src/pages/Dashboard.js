import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[8]};
`;

const Card = styled.div`
  background: white;
  padding: ${({ theme }) => theme.spacing[8]};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  max-width: 600px;
  width: 100%;
  text-align: center;
`;

const Dashboard = () => {
  return (
    <Container>
      <Card>
        <h1>Dashboard</h1>
        <p>Personalized skincare dashboard with progress tracking coming soon...</p>
      </Card>
    </Container>
  );
};

export default Dashboard;