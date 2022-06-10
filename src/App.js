import './App.css';
import DistributionCanvas from './distributionCanvas.tsx';
import Header from './Header.js';
import { ThemeProvider, createTheme, responsiveFontSizes} from '@mui/material/styles';
import React, { useEffect } from "react";

function getCanvasSize(scale) {
    const { innerWidth: width, innerHeight: height } = window;
    const scaledWidth = width-(scale*width);

    const aspectRatio = 9/20
    return {
        width: Math.round(scaledWidth),
        height: Math.round(scaledWidth*aspectRatio)
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
    // add padding to the window for the canvas
    // const windowDimensions = getCanvasSize(0.2);

    const [windowDimensions, setWindowDimensions] = React.useState(getCanvasSize(0.2));

    // add responsive font sizes
    const theme = responsiveFontSizes(darkTheme);


    const resizeHanlder = () => {
        setWindowDimensions(getCanvasSize(0.2));
      };
    
      useEffect(() => {
        window.onresize = resizeHanlder;    
      }, []);

    return (
        <div className="App">
        <ThemeProvider theme={theme}>
            <header className="App-header">
                {/* <VirtualizedList></VirtualizedList> */}
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
