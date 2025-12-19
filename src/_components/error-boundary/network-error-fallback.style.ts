import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
`;

export const ErrorIcon = styled.div`
  font-size: 5rem;
  margin-bottom: 1.5rem;
  animation: bounce 2s infinite;

  @keyframes bounce {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-20px);
    }
  }
`;

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: white;
`;

export const Description = styled.p`
  font-size: 1.125rem;
  line-height: 1.6;
  margin-bottom: 1rem;
  opacity: 0.9;
  max-width: 500px;
`;

export const ErrorDetail = styled.div`
  background: rgba(255, 255, 255, 0.15);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
`;

export const Suggestion = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  max-width: 500px;
  backdrop-filter: blur(10px);
`;

export const SuggestionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  text-align: left;
`;

export const SuggestionList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0.75rem 0 0 0;
  text-align: left;

  li {
    padding: 0.5rem 0;
    font-size: 0.95rem;
    opacity: 0.9;

    &::before {
      content: "• ";
      margin-right: 0.5rem;
    }
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  /* flex-wrap: wrap; */
  justify-content: center;
`;

export const Button = styled.button`
  padding: 0.875rem 1.2rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const RetryButton = styled(Button)`
  background: white;
  color: #667eea;

  &:hover {
    background: #f8f9fa;
  }
`;

export const HomeButton = styled(Button)`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;
