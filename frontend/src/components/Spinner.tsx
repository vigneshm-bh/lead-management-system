/** @jsxImportSource @emotion/react */
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import React from 'react';
import { colors } from '../styles/shared';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerWrapper = styled.div<{ fullPage?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 40px;
  ${({ fullPage }) => fullPage && `
    min-height: 100vh;
  `}
`;

const SpinnerIcon = styled.div<{ size?: number }>`
  width: ${({ size }) => size || 36}px;
  height: ${({ size }) => size || 36}px;
  border: 3px solid ${colors.border};
  border-top-color: ${colors.primary};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

const SpinnerText = styled.span`
  font-size: 14px;
  color: ${colors.textSecondary};
`;

interface SpinnerProps {
  size?: number;
  text?: string;
  fullPage?: boolean;
}

const Spinner: React.FC<SpinnerProps> = ({ size, text, fullPage }) => (
  <SpinnerWrapper fullPage={fullPage}>
    <SpinnerIcon size={size} />
    {text && <SpinnerText>{text}</SpinnerText>}
  </SpinnerWrapper>
);

export default Spinner;

