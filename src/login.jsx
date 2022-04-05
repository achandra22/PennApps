import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Stack } from '@mui/material';
import Vault from './vault.jsx'
import Register from './register.jsx'
import { goTo } from 'react-chrome-extension-router';
import { createAuthHash, decryptVault, setStorage } from './helpers.js';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const validLogin = () => {
    return password.length > 0 && email.length > 0;
  };

  const authenticateUser = (email, password) => {
    chrome.storage.sync.get(['userDetails'], function(userDetails) {
      const userList = userDetails.userDetails;
      if (userList) {  
        if (!(email in userList)) {
          alert('Invalid credentials');
        } else {
          const hash = createAuthHash(password, email, userList[email].salt);
          if (hash === userList[email]['authHash']) {
            setStorage('session', { current: email });
            chrome.storage.sync.get([`${email}-vault`], function (vault) {
              const decryptedVault = decryptVault(password, vault[`${email}-vault`]);
              goTo(Vault, { vault: decryptedVault });
            });
          } else {
            alert('Invalid credentials');
          }
        }
      }
    });
  };

  return (
    <Container>
      <Stack direction='row'>
        <img src='assets/icon48.png' alt='logo' height='48px' width='48px' style={{marginTop:'10px'}}/>
        <Typography variant='h4' sx={{ margin: 2, fontWeight: 600  }}>Login</Typography>
      </Stack>
      <TextField
        margin='normal'
        fullWidth
        id='email'
        label='Email Address'
        name='email'
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />
      <TextField
        margin='normal'
        fullWidth
        name='password'
        label='Master Password'
        type='password'
        id='password'
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />
      <Button
        id='login-user-btn'
        variant='contained'
        type='submit'
        fullWidth
        disabled={!validLogin()}
        onClick={() => {
          authenticateUser(email, password);
        }}
      >
        Login
      </Button>
      <Button
        id='nav-register-btn'
        fullWidth
        onClick={() => goTo(Register)}
        sx={{ marginTop: 1 }}
      >
        Register Instead?
      </Button>
    </Container>
  )
}

export default Login