/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leadApi } from '../services/api';
import { LeadRequest, LeadStatus } from '../types';
import { Button, Card, Container, FormGroup, Input, Select, TextArea, colors } from '../styles/shared';
import Spinner from '../components/Spinner';
import {css} from "@emotion/css";

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

const FieldError = styled.span`
  color: ${colors.danger};
  font-size: 12px;
  margin-top: 4px;
  display: block;
`;

const LeadFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState<LeadRequest>({
    name: '',
    company: '',
    email: '',
    phone: '',
    source: '',
    status: LeadStatus.NEW,
    notes: '',
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; phone?: string }>({});

  const { data: leadData, isLoading: isLoadingLead } = useQuery({
    queryKey: ['lead', id],
    queryFn: () => leadApi.getById(Number(id)).then((res) => res.data),
    enabled: isEdit,
  });

  useEffect(() => {
    if (leadData) {
      setForm({
        name: leadData.name,
        company: leadData.company || '',
        email: leadData.email || '',
        phone: leadData.phone || '',
        source: leadData.source || '',
        status: leadData.status,
        notes: leadData.notes || '',
      });
    }
  }, [leadData]);

  const createMutation = useMutation({
    mutationFn: (data: LeadRequest) => leadApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      navigate('/leads');
    },
    onError: (err: any) => {
      const data = err.response?.data;
      if (data?.errors) {
        setError(Object.values(data.errors).join(', '));
      } else {
        setError(data?.message || 'Something went wrong');
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: LeadRequest) => leadApi.update(Number(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['lead', id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      navigate('/leads');
    },
    onError: (err: any) => {
      const data = err.response?.data;
      if (data?.errors) {
        setError(Object.values(data.errors).join(', '));
      } else {
        setError(data?.message || 'Something went wrong');
      }
    },
  });

  const validate = (): boolean => {
    const errors: { email?: string; phone?: string } = {};

    if (form.email) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(form.email)) {
        errors.email = 'Please enter a valid email (e.g., user@example.com)';
      }
    }

    if (form.phone) {
      if (/[^0-9+\-().\s]/.test(form.phone)) {
        errors.phone = 'Phone can only contain digits, +, -, (), and spaces';
      } else {
        const digitsOnly = form.phone.replace(/[^0-9]/g, '');
        if (digitsOnly.length < 7 || digitsOnly.length > 15) {
          errors.phone = 'Phone number must have between 7 and 15 digits';
        }
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;
    if (isEdit) {
      updateMutation.mutate(form);
    } else {
      createMutation.mutate(form);
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const handleChange = (field: keyof LeadRequest, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  if (isEdit && isLoadingLead) {
    return <Spinner text="Loading lead..." />;
  }

  return (
    <Container>
      <PageTitle>{isEdit ? 'Edit Lead' : 'Create New Lead'}</PageTitle>
      <FormCard>
        {error && <ErrorMsg>{error}</ErrorMsg>}
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <label>Name <span className={css({ color: 'red' })}>*</span></label>
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
              type="text"
              value={form.email}
              onChange={(e) => { handleChange('email', e.target.value); setFieldErrors((f) => ({ ...f, email: undefined })); }}
              placeholder="email@example.com"
            />
            {fieldErrors.email && <FieldError>{fieldErrors.email}</FieldError>}
          </FormGroup>
          <FormGroup>
            <label>Phone</label>
            <Input
              value={form.phone}
              onChange={(e) => { handleChange('phone', e.target.value); setFieldErrors((f) => ({ ...f, phone: undefined })); }}
              placeholder="Phone number"
            />
            {fieldErrors.phone && <FieldError>{fieldErrors.phone}</FieldError>}
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
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : isEdit ? 'Update Lead' : 'Create Lead'}
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
