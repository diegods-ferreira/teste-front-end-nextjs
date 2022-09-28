import { useSession, signOut } from 'next-auth/react';
import { AppBar, Button, Toolbar, Typography } from '@mui/material';
import { Logout } from '@mui/icons-material';

import styles from './styles.module.scss';

export function Header() {
  const { data: session } = useSession();

  return (
    <AppBar component="header" position="static" className={styles.headerContainer}>
      <Toolbar className={styles.headerContentContainer}>
        <div className={styles.userInfoContainer}>
          <Typography variant="h5">{session.user.name}</Typography>
          <Typography variant="h6">{session.user.email}</Typography>
        </div>

        <Button
          size="small"
          className={styles.logoutButton}
          startIcon={<Logout />}
          onClick={() => signOut()}
        >
          logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}