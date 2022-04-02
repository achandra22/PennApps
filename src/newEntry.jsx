import React, { useState } from 'react';
import { TextField, Button, IconButton, InputAdornment } from '@mui/material';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { goTo } from 'react-chrome-extension-router';
import Vault from './vault.jsx';
import { generatePassword } from './helpers.js';
// import { encrypt } from './helpers.js';

function NewEntry({ vaultData, defaultName = '', defaultUsername = '', defaultPassword = '' }) {
  const [vault] = useState(vaultData);
  const [name, setName] = useState(defaultName);
  const [username, setUsername] = useState(defaultUsername);
  const [password, setPassword] = useState(defaultPassword);
  const [showPassword, setShowPassword] = useState(false);

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
        type={showPassword ? 'text' : 'password'}
        fullWidth
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton edge="end" color="primary" onClick={() => setPassword(generatePassword())}>
                <AutorenewIcon />
              </IconButton>
              <IconButton edge="end" color="primary" onClick={() => setShowPassword(prev => !prev)}>
                {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Button
        variant='contained'
        fullWidth
        disabled={!validCredentials()}
        onClick={() => {
          console.log(generatePassword())
          const newVault = { ...vault, [name]: { username, password } };
          goTo(Vault, { vault: newVault });
        }}
      >
        {defaultName ? 'Edit Credentials' : 'Add Credentials'}
      </Button>
      <Button variant='outlined' sx={{ marginTop: 2 }} fullWidth onClick={() => goTo(Vault, { vault: vaultData })}>
        Back
      </Button>
    </>
  );
}

export default NewEntry;
