
import { useState } from 'react';
import { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import { CircularProgress } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';

import { authOptions } from '../../api/auth/[...nextauth]';

import { EMAIL_REGEX } from '../../../data/contants/email-regex';

import { useVideosList } from '../../../contexts/VideoListContext';

import { ControlledTextField } from '../../../components/ControlledTextField';

import * as S from './styles';

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
      toast(result.error, { type: 'error' });
    } else {
      resetVideoSearch();
      router.push(result.url);
    }

    setIsSubmiting(false);
  };

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>

      <S.Container>
        <S.SignInForm>
          <form onSubmit={signInForm.handleSubmit(handleSignInFormSubmit)} noValidate>
            <header>
              <S.SignInForm__Logo />

              <S.SignInForm__Title>Faça login</S.SignInForm__Title>
            </header>

            <main>
              <ControlledTextField
                name="username"
                control={signInForm.control}
                label="Nome de usuário"
              />

              <ControlledTextField
                name="email"
                control={signInForm.control}
                type="email"
                label="E-mail"
              />
            </main>

            <footer>
              <S.SignInForm__Button
                disabled={isSubmiting}
                startIcon={isSubmiting && <CircularProgress color="inherit" size={16} />}
              >
                {isSubmiting ? 'Entrando...' : 'Entrar'}
              </S.SignInForm__Button>
            </footer>
          </form>
        </S.SignInForm>
      </S.Container>
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
