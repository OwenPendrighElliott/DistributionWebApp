import './App.css';
import DistributionComponent from './canvas.tsx';
import { ThemeProvider, createTheme, responsiveFontSizes} from '@mui/material/styles';
import { Typography } from '@mui/material';

function getCanvasSize(scale) {
    const { innerWidth: width, innerHeight: height } = window;
    const scaledWidth = width-(scale*width);
    return {
      width:scaledWidth,
      height: scaledWidth*(9/16)
    };
  }


// theme for the app - dark of course
const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
    h2: {
        fontStyle: 'bold',
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
                <Typography variant='h2' align='center'>
                    Draw Your Distribution 
                </Typography>
                <br/>
                <div className="CanvasArea">
                    <DistributionComponent width={windowDimensions.width} height={windowDimensions.height}></DistributionComponent>
                </div>
            </header>
        </ThemeProvider >
        </div> 
    );
}

export default App;
