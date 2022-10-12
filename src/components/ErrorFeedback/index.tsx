import { Button } from '@mui/material';
import { useRouter } from 'next/router';

import * as S from './styles';

interface ErrorFeedbackProps {
  title: string;
  message: string;
  retryCallback?: () => void | Promise<void>;
  showGoBackButton?: boolean;
}

export function ErrorFeedback({ title, message, retryCallback, showGoBackButton = false }: ErrorFeedbackProps) {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <S.Container>
      <img src="/images/not-found.png" alt="Not found" />

      <strong>{title}</strong>

      <span>{message}</span>
      
      {!!retryCallback && (
        <Button
          variant="contained"
          color="primary"
          onClick={retryCallback}
        >
          Tentar novamente
        </Button>
      )}

      {!!showGoBackButton && (
        <Button variant="text" onClick={handleGoBack}>
          Voltar
        </Button>
      )}
    </S.Container>
  );
}