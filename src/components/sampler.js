import React, { useState } from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { FixedSizeList } from 'react-window';

import { useContext } from "react";
import DistributionContext from "../contexts/distributionContext";

import Typography from '@mui/material/Typography';

import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

import Tooltip from '@mui/material/Tooltip';

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import Fade from '@mui/material/Fade';

import { Chart } from "react-google-charts";

import { getSamples } from "../calcs/empirical"

function copyArrayToClipboard(array) {
    navigator.clipboard.writeText(array.join('\n'));
}

const Sampler = () => {

    const [isSampled, setIsSampled] = useState(false)

    const [samplePoints, setSamplePoints] = useState([])
    const [open, setOpen] = React.useState(false);

    const options = {
        chart: {
            title: "Sample Histogram",
        },
        legend: { position: 'none' },
        backgroundColor: { fill:'transparent' },
        hAxis: {
            title: "Bin",
            titleTextStyle: {
                italic: false, 
                bold: true, 
                color: "white"
            },
            textStyle: {color: "white"},
            slantedText: true,
        },

        vAxis: {
            title: "Count",
            titleTextStyle: {
                italic: false, 
                bold: true, 
                color: "white"
            },
            textStyle: {color: "white"},

            gridlines: {
                color: '40444b',
            },
            minorGridlines: {
                color: '40444b',
            }
        },
        
    };

    const { xCoordinates, yCoordinates, xMin, xMax, nSamples, setNSamples } = useContext(DistributionContext)

    function arrToBins(array) {
    
        let nBins = 10;

        if (array.length > 100) {
            nBins = 20;
        } else {
            nBins = 10;
        };


        let min = Math.min(...array);
        let max = Math.max(...array);
        let inc = (max-min) / nBins;
    
        let plotData = [["Range", "nSamples"]];
    
        let prev = min;
    
        for (let i = 0; i < nBins; i++) {
            let count = 0;
            for (let j = 0; j < array.length; j++){
                if (array[j] > prev && array[j] < prev+inc) {
                    count = count + 1;
                }
            }
            let minBound = Math.round(prev);
            let maxBound = Math.round(prev+inc);
            if (i==0) {
                minBound = xMin;
            }
            if (i==nBins-1){
                maxBound = xMax;
            }
            let bucket = minBound + " - " + maxBound;
            plotData.push([bucket, count]);
            prev = prev + inc;
        }
    
        return plotData;
    }

    function callSampleAPI() {
        let result = getSamples(xCoordinates, yCoordinates, Number(xMin), Number(xMax), Number(nSamples));
        setSamplePoints(result);
        copyArrayToClipboard(result);
    }

    const handleTooltipClose = () => {
        setOpen(false);
    };

    const handleTooltipOpen = () => {
        setOpen(true);
    };

    const handleErrorMsgClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpen(false);
      };

    return (<div> 
                <div>
                    <Typography variant='h4'>Sampler</Typography>
                </div>
                <div class="SamplerInput">
                    <Grid container columnSpacing={1} justifyContent="center">
                        <Grid item>
                            <TextField id="outlined-basic" 
                            label="Samples" 
                            variant="outlined" 
                            type={'number'}
                            defaultValue={nSamples}
                            onChange={(event) =>
                                setNSamples(parseInt(event.target.value))
                            }
                        />
                        </Grid>
                        <Grid item alignItems="stretch" style={{ display: "flex" }}>
                            <Tooltip
                                PopperProps={{
                                disablePortal: true,
                                }}
                                onClose={handleTooltipClose}
                                open={open}
                                disableFocusListener
                                disableHoverListener
                                disableTouchListener
                                title="Copied to clipboard!"
                                onMouseLeave={() => handleTooltipClose()}
                            >
                                <Button variant="outlined" 
                                        color="primary"
                                        onClick={() => {callSampleAPI(); handleTooltipOpen(); setIsSampled(true);}}>
                                    Sample
                                </Button>
                            </Tooltip>
                        </Grid>
                    </Grid>
                
                <div className='SamplerErrorMsg'>
                <Fade in={isSampled && samplePoints.length == 0} out={samplePoints.length > 0}>
                    <Alert severity="error" sx={{ width: '100%' }}>
                        Please draw a distribution first!
                    </Alert>
                </Fade>
                </div>

                </div>
                {(samplePoints.length > 0 && xCoordinates.length > 0) &&
                    <Chart
                    chartType="ColumnChart"
                    width="100%"
                    height="400px"
                    data={arrToBins(samplePoints)}
                    options={options}
                    />
                }
            </div> 
            )
}

Sampler.defaultProps = {
    yCoordinates: [], 
    xCoordinates: [], 
    xMin: 0, 
    xMax: 100, 
    nSamples: 1000
};

export default Sampler;