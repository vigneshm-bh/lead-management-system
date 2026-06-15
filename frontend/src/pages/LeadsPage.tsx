/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leadApi } from '../services/api';
import { LeadStatus } from '../types';
import { Badge, Button, Card, Container, Input, Select, Table, colors } from '../styles/shared';
import Spinner from '../components/Spinner';
import ConfirmModal from '../components/ConfirmModal';

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
`;

const Filters = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 16px;
`;

const FilterInput = styled(Input)`
  max-width: 300px;
`;

const FilterSelect = styled(Select)`
  max-width: 180px;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
`;

const PageTitle = styled.h1`
  color: ${colors.text};
  margin: 0;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${colors.textSecondary};
`;

const statusColors: Record<string, string> = {
  NEW: colors.info,
  CONTACTED: colors.warning,
  QUALIFIED: colors.primary,
  WON: colors.success,
  LOST: colors.danger,
};

const LeadsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: leads = [], isLoading, isFetching } = useQuery({
    queryKey: ['leads', search, statusFilter],
    queryFn: () =>
      leadApi.getAll(search || undefined, (statusFilter as LeadStatus) || undefined).then((res) => res.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => leadApi.delete(id),
    onSuccess: () => {
      setDeleteId(null);
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  const handleDelete = () => {
    if (deleteId !== null) {
      deleteMutation.mutate(deleteId);
    }
  };

  return (
    <Container>
      <Header>
        <PageTitle>Leads</PageTitle>
        <Button onClick={() => navigate('/leads/new')}>+ New Lead</Button>
      </Header>

      <Filters>
        <FilterInput
          placeholder="Search by name, company, or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <FilterSelect value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          {Object.values(LeadStatus).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </FilterSelect>
      </Filters>

      <Card style={{ padding: 0, overflow: 'auto' }}>
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Company</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Source</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            {isFetching || isLoading ? (
              <tbody><tr><td colSpan={7}><Spinner/></td></tr></tbody>
            ) : leads.length === 0 ? (
              <tbody><tr><td colSpan={7}><EmptyState>No leads found. Create your first lead!</EmptyState></td></tr></tbody>
            ) : (
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td>{lead.name}</td>
                  <td>{lead.company || '-'}</td>
                  <td>{lead.email || '-'}</td>
                  <td>{lead.phone || '-'}</td>
                  <td>{lead.source || '-'}</td>
                  <td>
                    <Badge color={statusColors[lead.status]}>{lead.status}</Badge>
                  </td>
                  <td>
                    <Actions>
                      <Button variant="secondary" onClick={() => navigate(`/leads/${lead.id}/edit`)}>
                        Edit
                      </Button>
                      <Button variant="danger" onClick={() => setDeleteId(lead.id)} disabled={deleteMutation.isPending}>
                        Delete
                      </Button>
                    </Actions>
                  </td>
                </tr>
              ))}
            </tbody>
            )}
          </Table>
      </Card>

      <ConfirmModal
        isOpen={deleteId !== null}
        title="Delete Lead"
        message="Are you sure you want to delete this lead? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleteMutation.isPending}
      />
    </Container>
  );
};

export default LeadsPage;
