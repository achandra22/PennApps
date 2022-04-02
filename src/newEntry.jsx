import React, { useState } from 'react';
import { TextField, Button, Stack } from '@mui/material';
import { goTo } from 'react-chrome-extension-router';
import Vault from './vault.jsx';
// import { encrypt } from './helpers.js';

function NewEntry({ vaultData, defaultName = '', defaultUsername = '', defaultPassword = '' }) {
  const [vault] = useState(vaultData);
  const [name, setName] = useState(defaultName);
  const [username, setUsername] = useState(defaultUsername);
  const [password, setPassword] = useState(defaultPassword);

  const validCredentials = () => {
    return password.length > 0 && username.length > 0 && name.length > 0;
  };

  return (
    <>
      <TextField
        id='name'
        label='Website Name'
        name='name'
        margin='normal'
        fullWidth
        value={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
      <TextField
        id='username'
        label='Username'
        name='username'
        margin='normal'
        fullWidth
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
        }}
      />
      <TextField
        id='password'
        label='Password'
        name='password'
        margin='normal'
        type='password'
        fullWidth
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />

      <Button
        variant='contained'
        fullWidth
        disabled={!validCredentials()}
        onClick={() => {
          const newVault = { ...vault, [name]: { username, password } };
          // setVaultData(newVault);
          goTo(Vault, { vault: newVault });
        }}
      >
        Add Credentials
      </Button>
    </>
  );
}

export default NewEntry;
