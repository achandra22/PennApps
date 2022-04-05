import React from 'react'
import { render } from 'react-dom'
import { goTo, Router } from 'react-chrome-extension-router';
import Login from './login.jsx'
import Register from './register.jsx'
import { Button, Stack, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';


const theme = createTheme({
  palette: {
    primary: {
      main: '#38405f',
    },
  },
});

function Popup() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
          <Stack direction='column' spacing={4} sx={{marginTop: 5}}>
            <img src='assets/logo.png' alt='PassMan Logo' height='134px' width='360px' style={{margin:'auto', objectFit: 'cover'}}/>
            <Button variant="contained" onClick={() => goTo(Login)}>Login</Button>
            <Button variant="contained" onClick={() => goTo(Register)}>Register</Button>
          </Stack>
      </Router>
    </ThemeProvider>

  )
}

render(<Popup/>, document.getElementById('react-target'))