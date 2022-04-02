import React from 'react'
import { render } from 'react-dom'
import { goTo, Router } from 'react-chrome-extension-router';
import Login from './login.jsx'
import Register from './register.jsx'
import { Button, Stack, Typography } from '@mui/material';

function Popup() {
  return (
    <Router>
      <Stack direction='column' spacing={4}>
        <Typography variant='h4'>PassMan</Typography>
        <Button variant="contained" onClick={() => goTo(Login)}>Login</Button>
        <Button variant="contained" onClick={() => goTo(Register)}>Register</Button>
      </Stack>
    </Router>
  )
}

render(<Popup/>, document.getElementById('react-target'))