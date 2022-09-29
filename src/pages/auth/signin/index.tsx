
import { useState } from 'react';
import { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import { Button, CircularProgress, Paper } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';

import { authOptions } from '../../api/auth/[...nextauth]';

import { EMAIL_REGEX } from '../../../data/contants/email-regex';

import { useVideosList } from '../../../contexts/VideoListContext';

import { ControlledTextField } from '../../../components/ControlledTextField';

import styles from './styles.module.scss';

interface SignInFormData {
  username: string;
  email: string;
}

const signInFormValidationSchema = yup
  .object()
  .shape({
    username: yup.string().min(3, 'Mínimo de 3 caracteres'),
    email: yup.string().required('E-mail é obrigatório').test('email', function (value) {
      const { path, createError } = this;

      if (EMAIL_REGEX.test(value)) return true;

      return createError({ path, message: 'E-mail inválido' });
    }),
  });

export default function SignIn() {
  const router = useRouter();

  const { resetVideoSearch } = useVideosList();

  const [isSubmiting, setIsSubmiting] = useState(false);

  const signInForm = useForm<SignInFormData>({
    resolver: yupResolver(signInFormValidationSchema),
    defaultValues: {
      username: '',
      email: ''
    }
  });

  const handleSignInFormSubmit = async (formData: SignInFormData) => {
    setIsSubmiting(true);

    const result = await signIn('credentials', { ...formData, callbackUrl: '/', redirect: false });

    if (result.error !== null) {
      if (result.status === 401) {
        toast('Credenciais incorretas. Tente novamente, por favor.', { type: 'error' });
      } else {
        toast(result.error, { type: 'error' });
      }
    } else {
      resetVideoSearch();
      router.push(result.url);
    }
  };

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>

      <main className={styles.container}>
        <Paper elevation={3} className={styles.formContainer}>
          <form onSubmit={signInForm.handleSubmit(handleSignInFormSubmit)} noValidate>
            <img src="/images/logo.png" alt="iCasei" className={styles.logo} />

            <ControlledTextField
              name="username"
              control={signInForm.control}
              label="Nome de usuário"
              className={styles.input}
            />

            <ControlledTextField
              name="email"
              control={signInForm.control}
              type="email"
              label="E-mail"
              helperText="Incorrect entry."
              className={styles.input}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              className={styles.signInButton}
              disabled={isSubmiting}
              startIcon={isSubmiting && <CircularProgress color="inherit" size={16} />}
            >
              {isSubmiting ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </Paper>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {}
  };
}
