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

const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await login(username, password);
      } else {
        await register(username, password);
      }
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong');
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
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />
          </FormGroup>
          <FormGroup>
            <label>Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </FormGroup>
          <Button type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
            {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Sign Up'}
          </Button>
        </form>
        <ToggleText>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <span onClick={() => { setIsLogin(!isLogin); setError(''); }}>
            {isLogin ? 'Sign Up' : 'Sign In'}
          </span>
        </ToggleText>
      </LoginCard>
    </LoginWrapper>
  );
};

export default LoginPage;

