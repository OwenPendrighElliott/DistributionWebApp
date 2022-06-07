import './App.css';
import DistributionCanvas from './distributionCanvas.tsx';
import Header from './Header.js';
import { ThemeProvider, createTheme, responsiveFontSizes} from '@mui/material/styles';
import { Typography } from '@mui/material';

function getCanvasSize(scale) {
    const { innerWidth: width, innerHeight: height } = window;
    const scaledWidth = width-(scale*width);
    return {
        width: Math.round(scaledWidth),
        height: Math.round(scaledWidth*(9/16))
    };
}

// theme for the app - dark of course
const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
    typography: {
        fontFamily: [
          'Source Code Pro',
        ].join(','),
      },
  });

function App() {
    // TODO: add dynamic resizing

    // add padding to the window for the canvas
    const windowDimensions= getCanvasSize(0.4);

    // add responsive font sizes
    const theme = responsiveFontSizes(darkTheme);

    return (
        <div className="App">
        <ThemeProvider  theme={theme}>
            <header className="App-header">
                {/* <Typography variant='h2' align='center'>
                    p d f . s a d
                </Typography> */}
                <Header>
                    pdf.sad
                </Header>
                <br/>
                <div className="CanvasArea">
                    <DistributionCanvas width={windowDimensions.width} 
                                        height={windowDimensions.height}>
                    </DistributionCanvas>
                </div>
            </header>
        </ThemeProvider >
        </div> 
    );
}

export default App;
