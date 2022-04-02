import React, { useState } from 'react';
import { Alert, Container, TextField, Button, Typography } from '@mui/material';
import Vault from './vault.jsx';
import Login from './login.jsx';
import { goTo } from 'react-chrome-extension-router';
import { createLoginHash, createSalt, setStorage } from './helpers.js';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [matchingPasswords, setMatchingPasswords] = useState(true);

  const passwordValidation = () => {
    if (password === password2 || password === '' || password2 === '') {
      setMatchingPasswords(true);
    } else {
      setMatchingPasswords(false);
    }
  };

  const validRegistration = () => {
    return matchingPasswords && email && password && password2;
  };

  return (
    <Container>
      <Typography variant='h4' sx={{ margin: 2 }}>
        PassMan
      </Typography>
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
        onBlur={passwordValidation}
      />
      <TextField
        margin='normal'
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
      {!matchingPasswords && <Alert severity='error'>Passwords Do Not Match</Alert>}
      <Button
        id='login-user-btn'
        type='submit'
        fullWidth
        disabled={!validRegistration()}
        onClick={() => {
          const salt = createSalt();
          const loginHash = createLoginHash(password, email, salt);
          chrome.storage.sync.get(['userDetails'], function (userDetails) {
            let userList = userDetails.userDetails;
            console.log(userList);
            if (userList) {
              if (email in userList) {
                alert('User already exists');
                goTo(Login);
                return;
              }
              userList[email] = { loginHash, salt };
            } else {
              userList = {
                [email]: {
                  salt,
                  loginHash,
                },
              };
            }
            console.log(userList);
            setStorage('userDetails', userList);
          });

          setStorage(`${email}-vault`, {});
          setStorage('session', { current: email });
          goTo(Vault);
        }}
      >
        Register
      </Button>
      <Button id='nav-login-btn' fullWidth onClick={() => goTo(Login)}>
        Login Instead?
      </Button>
    </Container>
  );
}

export default Register;

// userDetails = [
//   {
//     email: {
//       loginHash: '',
//       salt: ''
//     }
//   }
// ]
