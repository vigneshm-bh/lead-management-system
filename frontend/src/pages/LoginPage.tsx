/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button, Card, FormGroup, Input, colors } from '../styles/shared';

const LoginWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${colors.background};
`;

const LoginCard = styled(Card)`
  width: 100%;
  max-width: 400px;
  margin: 20px;
`;

const Title = styled.h1`
  text-align: center;
  color: ${colors.primary};
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  text-align: center;
  color: ${colors.textSecondary};
  margin-bottom: 32px;
`;

const ErrorMsg = styled.p`
  color: ${colors.danger};
  font-size: 14px;
  text-align: center;
  margin-bottom: 16px;
`;

const ToggleText = styled.p`
  text-align: center;
  margin-top: 16px;
  font-size: 14px;
  color: ${colors.textSecondary};

  span {
    color: ${colors.primary};
    cursor: pointer;
    font-weight: 500;
  }
`;

const FieldError = styled.span`
  color: ${colors.danger};
  font-size: 12px;
  margin-top: 4px;
  display: block;
`;

const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ username?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const validate = (): boolean => {
    const errors: { username?: string; password?: string } = {};

    if (!username.trim()) {
      errors.username = 'Username is required';
    } else if (username.length < 3 || username.length > 50) {
      errors.username = 'Username must be between 3 and 50 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      errors.username = 'Username can only contain letters, numbers, and underscores';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    } else if (password.length > 100) {
      errors.password = 'Password must not exceed 100 characters';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!isLogin && !validate()) return;
    setLoading(true);
    try {
      if (isLogin) {
        await login(username, password);
      } else {
        await register(username, password);
      }
      navigate('/');
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

  return (
    <LoginWrapper>
      <LoginCard>
        <Title>Lead Manager</Title>
        <Subtitle>{isLogin ? 'Sign in to your account' : 'Create a new account'}</Subtitle>
        {error && <ErrorMsg>{error}</ErrorMsg>}
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <label>Username</label>
            <Input
              type="text"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setFieldErrors((f) => ({ ...f, username: undefined })); }}
              placeholder="Enter username"
            />
            {fieldErrors.username && <FieldError>{fieldErrors.username}</FieldError>}
          </FormGroup>
          <FormGroup>
            <label>Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setFieldErrors((f) => ({ ...f, password: undefined })); }}
              placeholder="Enter password"
            />
            {fieldErrors.password && <FieldError>{fieldErrors.password}</FieldError>}
          </FormGroup>
          <Button type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
            {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Sign Up'}
          </Button>
        </form>
        <ToggleText>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <span onClick={() => { setIsLogin(!isLogin); setError(''); setFieldErrors({}); }}>
            {isLogin ? 'Sign Up' : 'Sign In'}
          </span>
        </ToggleText>
      </LoginCard>
    </LoginWrapper>
  );
};

export default LoginPage;

