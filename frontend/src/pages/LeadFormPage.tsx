/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { useNavigate, useParams } from 'react-router-dom';
import { leadApi } from '../services/api';
import { LeadRequest, LeadStatus } from '../types';
import { Button, Card, Container, FormGroup, Input, Select, TextArea, colors } from '../styles/shared';

const PageTitle = styled.h1`
  color: ${colors.text};
  margin-bottom: 24px;
`;

const FormCard = styled(Card)`
  max-width: 600px;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
`;

const ErrorMsg = styled.p`
  color: ${colors.danger};
  font-size: 14px;
  margin-bottom: 16px;
`;

const LeadFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [form, setForm] = useState<LeadRequest>({
    name: '',
    company: '',
    email: '',
    phone: '',
    source: '',
    status: LeadStatus.NEW,
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      loadLead();
    }
  }, [id]);

  const loadLead = async () => {
    try {
      const response = await leadApi.getById(Number(id));
      const lead = response.data;
      setForm({
        name: lead.name,
        company: lead.company || '',
        email: lead.email || '',
        phone: lead.phone || '',
        source: lead.source || '',
        status: lead.status,
        notes: lead.notes || '',
      });
    } catch {
      setError('Failed to load lead');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isEdit) {
        await leadApi.update(Number(id), form);
      } else {
        await leadApi.create(form);
      }
      navigate('/leads');
    } catch (err: any) {
      const data = err.response?.data;
      if (data?.errors) {
        setError(Object.values(data.errors).join(', '));
      } else {
        setError(data?.message || 'Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof LeadRequest, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Container>
      <PageTitle>{isEdit ? 'Edit Lead' : 'Create New Lead'}</PageTitle>
      <FormCard>
        {error && <ErrorMsg>{error}</ErrorMsg>}
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <label>Name *</label>
            <Input
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Lead name"
              required
            />
          </FormGroup>
          <FormGroup>
            <label>Company</label>
            <Input
              value={form.company}
              onChange={(e) => handleChange('company', e.target.value)}
              placeholder="Company name"
            />
          </FormGroup>
          <FormGroup>
            <label>Email</label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="email@example.com"
            />
          </FormGroup>
          <FormGroup>
            <label>Phone</label>
            <Input
              value={form.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="Phone number"
            />
          </FormGroup>
          <FormGroup>
            <label>Source</label>
            <Input
              value={form.source}
              onChange={(e) => handleChange('source', e.target.value)}
              placeholder="e.g., Website, Referral, LinkedIn"
            />
          </FormGroup>
          <FormGroup>
            <label>Status</label>
            <Select
              value={form.status}
              onChange={(e) => handleChange('status', e.target.value)}
            >
              {Object.values(LeadStatus).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Select>
          </FormGroup>
          <FormGroup>
            <label>Notes</label>
            <TextArea
              value={form.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Additional notes..."
            />
          </FormGroup>
          <ButtonRow>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : isEdit ? 'Update Lead' : 'Create Lead'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/leads')}>
              Cancel
            </Button>
          </ButtonRow>
        </form>
      </FormCard>
    </Container>
  );
};

export default LeadFormPage;

