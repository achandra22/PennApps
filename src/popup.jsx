import React from 'react';
import { render } from 'react-dom';
import { goTo, Router } from 'react-chrome-extension-router';
import { Divider, Slider, Stack, Typography, Button } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { capitalizeFirstLetter } from './helpers';

const theme = createTheme({
  palette: {
    primary: {
      main: '#000',
    },
  },
  typography: {
    fontFamily: 'Montserrat',
  },
});

function Popup() {
  const [pageName, setPageName] = React.useState('Home');
  React.useEffect(() => {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      setPageName(capitalizeFirstLetter(tabs[0].url.replace(/.+\/\/|www.|\..+/g, '')));
    });
    // getBrandData(tabs[0].url.replace(/.+\/\/|www.|\..+/g, ''));
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Typography variant='h4' component='h1' gutterBottom>
          {pageName}
        </Typography>
        <Divider />
        <Typography variant='h6' component='h2' gutterBottom>
          Sustainability Score: {'2 / 5'}
        </Typography>
        <Typography variant='body1' gutterBottom>
          Zara is not taking adequate steps to ensure payment of a living wage for its workers.
        </Typography>
        <Divider />
        <Typography variant='h6' component='h2' gutterBottom>
          The Breakdown...
        </Typography>
        <Typography id='input-slider' gutterBottom>
          Planet
        </Typography>
        <Slider min={0} max={5} defaultValue={2} disabled />
        <Typography id='input-slider' gutterBottom>
          People
        </Typography>
        <Slider min={0} max={5} defaultValue={2} disabled />
        <Typography id='input-slider' gutterBottom>
          Animals
        </Typography>
        <Slider min={0} max={5} defaultValue={2} disabled />
        <Button onClick={() => setPageName(scrapeSustainabilityData())}>About</Button>
      </Router>
    </ThemeProvider>
  );
}

render(<Popup />, document.getElementById('react-target'));
