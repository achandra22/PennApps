import React, { useState, useEffect } from 'react';
import { TextField, Button, Stack, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import NewEntry from './newEntry.jsx';
import Login from './login.jsx';
import { goTo } from 'react-chrome-extension-router';
import { encryptVault, setStorage } from './helpers.js';

function Vault({vault = {}}) {

  console.log(vault);
  const [email, setEmail] = useState('');
  const [vaultData, setVaultData] = useState(vault);
  const [modalOpen, setModalOpen] = useState(false);
  const [encryptionKey, setEncryptionKey] = useState('');

  useEffect(() => {
    chrome.storage.sync.get(['session'], function (session) {
      setEmail(session['session']['current']);
    });
  }, []);


  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    console.log(vaultData)
    const encryptedVault = encryptVault(encryptionKey, vaultData);
    console.log(encryptedVault);
    console.log(email)
    setStorage(`${email}-vault`, encryptedVault);
    setStorage('session', { current: null });
    goTo(Login);
  };

  const logoutUser = () => {
    handleModalOpen()
  };  

  // useEffect(() => {
  //   chrome.storage.sync.get([`${email}-vault`], function (vault) {
  //     console.log(`${email}-vault`);
  //     setVaultData(vault[`${email}-vault`]);
  //   });
  // }, [email]);

  return (
    <>
      <TextField id='search' label='Search Vault...' name='search' margin='normal' fullWidth />
      <Stack direction='column' spacing={2}>
        {vaultData &&
          Object.keys(vaultData).map((key) => {
            return (
              <Button
                key={key}
                variant='outlined'
                fullWidth
                margin='normal'
                onClick={() => {
                  goTo(NewEntry, {
                    vaultData: vaultData,
                    defaultName: key,
                    defaultUsername: vaultData[key].username,
                    defaultPassword: vaultData[key].password,
                  });
                }}
              >
                {key}
              </Button>
            );
          })}
        <Button variant='contained' fullWidth onClick={() => goTo(NewEntry, {vaultData: vaultData})}>
          Add Password
        </Button>
        <Button variant='contained' fullWidth onClick={() => logoutUser()}>
          Logout
        </Button>
        <Dialog open={modalOpen} onClose={handleModalClose}>
          <DialogTitle>Logout From PassMan</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="master-password-logout"
              label="Master Password"
              type="password"
              fullWidth
              variant="standard"
              onChange={(e) => {
                setEncryptionKey(e.target.value);
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleModalClose}>Logout</Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </>
  );
}

export default Vault;
