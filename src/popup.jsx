import React from 'react';
import { render } from 'react-dom';
import { goTo, Router } from 'react-chrome-extension-router';
import { Box, Divider, Slider, Stack, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { capitalizeFirstLetter, getBrandData } from './helpers';
import plant from '../dist/assets/plant.gif';

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
  const [pageName, setPageName] = React.useState(null);
  const [brandData, setBrandData] = React.useState(null);

  const getIcon = (score) => {
    if (score == 1) {
      return '😭';
    } else if (score == 2) {
      return '😔';
    } else if (score == 3) {
      return '🤔';
    } else if (score == 4) {
      return '🙂';
    } else {
      return '😁';
    }
  };

  React.useEffect(() => {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      setPageName(capitalizeFirstLetter(tabs[0].url.replace(/.+\/\/|www.|\..+/g, '')));
      setBrandData(getBrandData(tabs[0].url.replace(/.+\/\/|www.|\..+/g, '')));
    });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        {brandData ? (
          <>
            <Typography variant='h4' component='h1' gutterBottom>
              {pageName}
            </Typography>
            <Divider />
            <Typography variant='h6' component='h2' gutterBottom mt={1}>
              {getIcon(brandData.rating)}{' '}
              {brandData.rating > 3 ? 'Sustainable Choice!' : 'Not Sustainable'}{' '}
            </Typography>
            <Typography variant='body1' gutterBottom>
              {brandData.description}
            </Typography>
            <Divider />
            <Typography variant='h6' component='h2' gutterBottom mt={1}>
              The Breakdown...
            </Typography>
            <Typography id='input-slider' gutterBottom>
              Planet Score: {`${brandData.planet} / 5`}
            </Typography>
            <Slider min={0} max={5} defaultValue={brandData.planet} disabled />
            <Typography id='input-slider' gutterBottom>
              People Score: {`${brandData.people} / 5`}
            </Typography>
            <Slider min={0} max={5} defaultValue={brandData.people} disabled />
            <Typography id='input-slider' gutterBottom>
              Animals Score: {`${brandData.animals} / 5`}
            </Typography>
            <Slider min={0} max={5} defaultValue={brandData.animals} disabled />
            <a href={brandData.url} target='_blank'>
              More Information
            </a>
          </>
        ) : (
          <Box height='100%' display='flex' alignItems='center' justifyContent={'center'}>
            <Stack alignItems={'center'}>
              <img src={plant} alt='plant' height='200px' width='200px' />
              <Typography align='center' variant='h6' component='h1' gutterBottom>
                Unfortunately we don't have any data on this brand yet.
              </Typography>
            </Stack>
          </Box>
        )}
      </Router>
    </ThemeProvider>
  );
}

render(<Popup />, document.getElementById('react-target'));
