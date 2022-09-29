import { Button } from '@mui/material';
import { useRouter } from 'next/router';

import styles from './styles.module.scss';

interface ErrorFeedbackProps {
  title: string;
  message: string;
  retryCallback: () => void | Promise<void>;
  showGoBackButton?: boolean;
}

export function ErrorFeedback({ title, message, retryCallback, showGoBackButton = false }: ErrorFeedbackProps) {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className={styles.errorFeedbackContainer}>
      <img src="/images/not-found.png" alt="Not found" />

      <strong>{title}</strong>

      <span>{message}</span>
      
      <Button
        variant="contained"
        color="primary"
        onClick={retryCallback}
      >
        Tentar novamente
      </Button>

      {!!showGoBackButton && (
        <Button variant="text" onClick={handleGoBack}>
          Voltar
        </Button>
      )}
    </div>
  );
}