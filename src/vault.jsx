import React, { useState, useEffect } from 'react';
import { TextField, Button, Stack, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import NewEntry from './newEntry.jsx';
import Login from './login.jsx';
import { goTo } from 'react-chrome-extension-router';
import { encryptVault, setStorage, createAuthHash, hashValue } from './helpers.js';

function Vault({vault = {}}) {
  const [email, setEmail] = useState('');
  const [vaultData, setVaultData] = useState(vault);
  const [modalOpen, setModalOpen] = useState(false);
  const [encryptionKey, setEncryptionKey] = useState('');
  const [searchText, setSearchText] = useState('');
  const [filteredVault, setFilteredVault] = useState(Object.keys(vault));

  useEffect(() => {
    chrome.storage.sync.get(['session'], function (session) {
      setEmail(session['session']['current']);
    });
  }, []);


  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    chrome.storage.sync.get(['userDetails'], function(userDetails) {
      const userList = userDetails.userDetails;
      const hash = createAuthHash(encryptionKey, email, userList[email].salt);
      if (hash === userList[email]['authHash']) {
        setModalOpen(false);
        const encryptedVault = encryptVault(encryptionKey, vaultData, userList[email].salt);
        setStorage(`${hashValue(email)}-vault`, encryptedVault);
        setStorage('session', { current: null });
        goTo(Login);
      } else {
        alert('Invalid credentials');
      }
    });
  }

  const logoutUser = () => {
    handleModalOpen()
  }; 
  
  const searchVault = () => {
    const search = searchText.toLowerCase();
    const filteredVault = Object.keys(vaultData).filter(key => {
      return key.toLowerCase().includes(search);
    });
    setFilteredVault(filteredVault);
  };


  return (
    <>
      <TextField 
        id='search' 
        label='Search Vault...' 
        name='search' margin='normal' 
        fullWidth
        onKeyDown={(e) => {
            setSearchText(e.target.value);
            searchVault();
          }
        }/>
      <Button variant='contained' fullWidth sx={{ marginBottom: 2 }} onClick={() => goTo(NewEntry, {vaultData: vaultData})}>
        Add Password
      </Button>
      <Stack direction='column' spacing={2} sx={{ maxHeight: 235, overflow: 'auto' }}>
        {vaultData &&
          Object.keys(vaultData).map((key) => {
            if (filteredVault.includes(key)) {
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
            }
          })}
      </Stack>
      <Button color='error' variant='outlined' fullWidth sx={{ marginTop: 2 }} onClick={() => logoutUser()}>
        Logout &amp; Save
      </Button>
      <Dialog open={modalOpen} onClose={handleModalClose}>
        <DialogTitle>Save Vault</DialogTitle>
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
          <Button color='error' variant='outlined' onClick={handleModalClose}>Logout</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Vault;
