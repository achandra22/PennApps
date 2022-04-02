import React, { useState, useEffect } from 'react';
import { TextField, Button, Stack } from '@mui/material';
import NewEntry from './newEntry.jsx';
import { goTo } from 'react-chrome-extension-router';

function Vault() {
  const [email, setEmail] = useState('');
  const [vaultData, setVaultData] = useState({});

  useEffect(() => {
    chrome.storage.sync.get(['session'], function (session) {
      setEmail(session['session']['current']);
    });
  }, []);

  useEffect(() => {
    chrome.storage.sync.get([`${email}-vault`], function (vault) {
      console.log(`${email}-vault`);
      setVaultData(vault[`${email}-vault`]);
    });
  }, [email]);

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
        <Button variant='contained' fullWidth onClick={() => goTo(NewEntry)}>
          Add Password
        </Button>
      </Stack>
    </>
  );
}

export default Vault;
