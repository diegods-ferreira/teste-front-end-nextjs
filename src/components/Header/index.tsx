import { useSession, signOut } from 'next-auth/react';
import { Typography } from '@mui/material';
import { Logout } from '@mui/icons-material';

import * as S from './styles';

export function Header() {
  const { data: session } = useSession();

  return (
    <S.Container>
      <S.ContentContainer>
        <section>
          <Typography variant="h5">{session.user.name}</Typography>
          <Typography variant="h6">{session.user.email}</Typography>
        </section>

        <S.LogOutButton startIcon={<Logout />} onClick={() => signOut()}>
          LogOut
        </S.LogOutButton>
      </S.ContentContainer>
    </S.Container>
  );
}