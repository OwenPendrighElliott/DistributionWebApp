import './App.css';
import Header from './components/Header.js';
import DistributionCanvas from './components/distributionCanvas.js';
import StatsTable from './components/statsTable.js';
import Sampler from './components/sampler.js';

import { ThemeProvider, createTheme, responsiveFontSizes} from '@mui/material/styles';
import React, { useEffect } from "react";
import RangeSelector from './components/rangeSelector';

import { DistributionContextProvider } from './contexts/distributionContext'

function getCanvasSize(scale) {
    const { innerWidth: width, innerHeight: height } = window;
    const scaledWidth = width-(scale*width);

    const aspectRatio = 9/24;
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

    const paddingProp = 0.1;
    // add padding to the window for the canvas
    // const windowDimensions = getCanvasSize(0.2);

    const [windowDimensions, setWindowDimensions] = React.useState(getCanvasSize(paddingProp));

    // add responsive font sizes
    const theme = responsiveFontSizes(darkTheme);


    const resizeHanlder = () => {
        setWindowDimensions(getCanvasSize(paddingProp));
      };
    
      useEffect(() => {
        window.onresize = resizeHanlder;    
      }, []);
    

    var canvas = document.getElementById("no-scroll-zone");
    // Prevent scrolling when touching the canvas
    document.body.addEventListener("touchstart", function (e) {
        if (e.target == canvas) {
            e.preventDefault();
        }
    }, {passive: false});
    document.body.addEventListener("touchend", function (e) {
        if (e.target == canvas) {
            e.preventDefault();
        }
    }, {passive: false});
    document.body.addEventListener("touchmove", function (e) {
        if (e.target == canvas) {
            e.preventDefault();
        }
    }, {passive: false});


    return (
        <div className="App">
        <ThemeProvider theme={theme}>
            
            <header className="App-header">
                <Header>drawdist.app</Header>

                <DistributionContextProvider>
                    <div id="no-scroll-zone">
                        <DistributionCanvas width={windowDimensions.width} 
                                            height={windowDimensions.height}>
                        </DistributionCanvas>
                        <div align="left">
                            <RangeSelector width={windowDimensions.width}></RangeSelector>

                            <StatsTable></StatsTable>
                        </div>
                    </div>
                    <div align="left">
                        <Sampler></Sampler>
                    </div>
                </DistributionContextProvider>

            </header>
        </ThemeProvider >
        </div> 
    );
}

export default App;
