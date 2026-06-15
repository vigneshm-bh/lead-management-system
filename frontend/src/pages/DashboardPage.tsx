/** @jsxImportSource @emotion/react */
import React from 'react';
import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { leadApi } from '../services/api';
import { LeadStatus } from '../types';
import { Card, colors, Container } from '../styles/shared';
import Spinner from '../components/Spinner';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const StatCard = styled(Card)<{ accent?: string }>`
  text-align: center;
  border-top: 4px solid ${({ accent }) => accent || colors.primary};
`;

const StatNumber = styled.h2`
  font-size: 36px;
  margin: 8px 0;
  color: ${colors.text};
`;

const StatLabel = styled.p`
  color: ${colors.textSecondary};
  font-size: 14px;
  margin: 0;
`;

const PageTitle = styled.h1`
  color: ${colors.text};
  margin-bottom: 24px;
`;

const statusColors: Record<string, string> = {
  NEW: colors.info,
  CONTACTED: colors.warning,
  QUALIFIED: colors.primary,
  WON: colors.success,
  LOST: colors.danger,
};

const DashboardPage: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => leadApi.getDashboard().then((res) => res.data),
  });

  if (isLoading) return <Spinner text="Loading dashboard..." />;
  if (error) return <Container><p>Failed to load dashboard.</p></Container>;

  return (
    <Container>
      <PageTitle>Dashboard</PageTitle>
      <Grid>
        <StatCard accent={colors.primary}>
          <StatLabel>Total Leads</StatLabel>
          <StatNumber>{data?.totalLeads || 0}</StatNumber>
        </StatCard>
        {Object.values(LeadStatus).map((status) => (
          <StatCard key={status} accent={statusColors[status]}>
            <StatLabel>{status}</StatLabel>
            <StatNumber>{data?.leadsByStatus[status] || 0}</StatNumber>
          </StatCard>
        ))}
      </Grid>
    </Container>
  );
};

export default DashboardPage;
