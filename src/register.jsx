import React, { useState } from 'react';
import { Alert, Container, TextField, Button, Typography, Stack } from '@mui/material';
import Vault from './vault.jsx';
import Login from './login.jsx';
import { goTo } from 'react-chrome-extension-router';
import { createAuthHash, createSalt, hashValue, setStorage, validatePasswordStrength } from './helpers.js';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const passwordValidation = () => {
    if (password === password2 || password === '' || password2 === '') {
      if (validatePasswordStrength(password).passed) {
        setPasswordError('');
      } else {
        setPasswordError('Password is not strong enough');
      }
    } else {
      setPasswordError('Passwords do not match');
    }
  };

  const validRegistration = () => {
    return passwordError === '' && email && password && password2;
  };

  const registerUser = () => {
    const salt = createSalt();
    const authHash = createAuthHash(password, email, salt);
    chrome.storage.sync.get(['userDetails'], function (userDetails) {
      let userList = userDetails.userDetails;
      if (userList) {
        if (email in userList) {
          alert('User already exists');
          goTo(Login);
          return;
        } else {
          userList[email] = { authHash, salt };
        }
      } else {
        userList = {
          [email]: {
            salt,
            authHash,
          },
        };
      }
      setStorage('userDetails', userList);
      setStorage(`${hashValue(email)}-vault`, {});
      setStorage('session', { current: email });
      goTo(Vault);
    });
  };

  return (
    <Container>
      <Stack direction='row'>
        <img src='assets/icon48.png' alt='logo' height='48px' width='48px' style={{marginTop:'10px'}}/>
        <Typography variant='h4' sx={{ margin: 2, fontWeight: 600  }}>Register</Typography>
      </Stack>
      <TextField
        margin='dense'
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
        margin='dense'
        fullWidth
        name='password'
        label='Master Password'
        type='password'
        id='password'
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
        onBlur={passwordValidation}
      />
      <TextField
        margin='dense'
        fullWidth
        name='password'
        label='Confirm Master Password'
        type='password'
        id='confirm-password'
        value={password2}
        onChange={(e) => {
          setPassword2(e.target.value);
        }}
        onBlur={passwordValidation}
      />
      {passwordError != '' && <Alert severity='error'>{passwordError}</Alert>}
      <Button
        id='login-user-btn'
        variant='contained'
        sx={{marginTop: 1}}
        type='submit'
        fullWidth
        disabled={!validRegistration()}
        onClick={() => registerUser()}
      >
        Register
      </Button>
      <Button id='nav-login-btn' sx={{marginTop: 1}} fullWidth onClick={() => goTo(Login)}>
        Login Instead?
      </Button>
    </Container>
  );
}

export default Register;

