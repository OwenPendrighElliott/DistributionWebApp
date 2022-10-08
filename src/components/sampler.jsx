import React, { useEffect, useState } from 'react';

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


import { getSamples,getStats } from "../calcs/empirical";

import SampleDashboard from "./sampleDashboard";

import SampleScroller from './sampleScroller';

// const MaxValidationTextField = ( {label, defaultValue, maxInt} ) => {
//     // const [value, setValue] = useState(defaultValue);

//     const { xMin, setXMin } = useContext(DistributionContext);
//     const [errorMessage, setErrorMessage] = useState("");

//     useEffect(() => {
//         setXMin(defaultValue);
//     }, []);

//     useEffect(() => {
//         // Set errorMessage only if the number is greater than the allowable max number
//         if (Number(xMin) >= Number(maxInt)) {
//             setErrorMessage(
//                 "Must be less than " + (maxInt-1)
//             );
//         }
//     }, [xMin]);

//     useEffect(() => {
//         // Set empty erroMessage only if number is less than max number
//         // and errorMessage is not empty.
//         // avoids setting empty errorMessage if the errorMessage is already empty
//         if (Number(xMin) < Number(maxInt) && errorMessage) {
//             setErrorMessage("");
//         }
//     }, [xMin, errorMessage]);

//     return (
//         <TextField
//         error={Number(xMin) >= Number(maxInt)}
//         id="outlined-error"
//         label={label}
//         type={'number'}
//         helperText={errorMessage}
//         onChange={(event) =>
//             setNSamples(parseInt(event.target.value))
//         }
//         value={xMin}
//         />
//     );
// }

function copyArrayToClipboard(array) {
    navigator.clipboard.writeText(array.join('\n'));
}

const DownloadSamples = (samples) => {
    const sampleStr = "Samples,\n" + samples['samples'].join(',\n');
    const fileType = "csv";

    function download() {
        // make the samples available for download as a csv file
        var blob = new Blob([sampleStr], { type: fileType });
        var a = document.createElement('a');
        a.download = "samples.csv";
        a.href = URL.createObjectURL(blob);
        a.dataset.downloadurl = [fileType, a.download, a.href].join(':');
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(function() { URL.revokeObjectURL(a.href); }, 1500);
    }

    return (
        <div className='sampledownloader'>
            <Button variant="outlined" 
                    color="primary"
                    onClick={() => {download();}}>
                Download Samples
            </Button>
        </div>
    )
}

const Sampler = () => {

    const [open, setOpen] = React.useState(false);

    const { xCoordinates, yCoordinates, xMin, xMax, nSamples, setNSamples, samplePoints, setSamplePoints, isSampled, setIsSampled } = useContext(DistributionContext)

    const [distStats, setDistributionStats] = useState({mean:0,median:0,std:0});

    const [points, setPoints] = useState({x: [], y: []});

    const maxSamples = 10000;

    function callSampleAPI() {

        if (Number(nSamples) > maxSamples) {
            return;
        }
        let result = getSamples(xCoordinates, yCoordinates, Number(xMin), Number(xMax), Number(nSamples));
        setSamplePoints(result);
        copyArrayToClipboard(result);
    };

    useEffect(() => {
        try {
            let result = getStats(xCoordinates, yCoordinates, Number(xMin), Number(xMax));
            setDistributionStats(result);
            setPoints({x: xCoordinates, y: yCoordinates});
        }
        catch (err) {
            console.log(err);
            setDistributionStats({mean: 0, median: 0, std: 0});
            setPoints({x: [], y: []});
        }
    }, [samplePoints]);

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

    useEffect(() => {
        if (samplePoints.length > 0) {
            callSampleAPI(); 
        }
    }, [xMin, xMax]);

    return (<div> 
                <div>
                    <Typography variant='h4' style={{'fontFamily': 'Comfortaa'}}>Sampler</Typography>
                </div>
                <div className="SamplerInput">
                    <Grid container columnSpacing={1} justifyContent="center">
                        <Grid item>
                            <TextField id="outlined-basic" 
                                error={Number(nSamples) > maxSamples}
                                label="Samples" 
                                variant="outlined" 
                                type={'number'}
                                defaultValue={nSamples}
                                onChange={(event) =>
                                    setNSamples(parseInt(event.target.value))
                                } 
                            />
                            <Snackbar 
                                open={Number(nSamples) > maxSamples} 
                                autoHideDuration={6000} 
                                anchorOrigin={{vertical: 'bottom', horizontal : 'center' }}
                            >
                                <Alert severity="error" sx={{ width: '100%' }}>
                                    Samples must be less than or equal to 10,000!
                                </Alert>
                            </Snackbar>
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
                </div>
                
                
                {(samplePoints.length > 0 && Number(nSamples) <= maxSamples) &&
                    <div>
                        <DownloadSamples samples={samplePoints}></DownloadSamples>

                        <SampleScroller samples={samplePoints}></SampleScroller>
                        <SampleDashboard samples={samplePoints} 
                                        xMin={xMin} 
                                        xMax={xMax} 
                                        distributionStats={distStats}
                                        points={points}>
                        </SampleDashboard>
                    </div>
                }

                <div className='samplererrormsg'>
                    <Fade in={isSampled && samplePoints.length == 0}>
                        <Alert severity="error" sx={{ width: '100%' }}>
                            Please draw a distribution first!
                        </Alert>
                    </Fade>
                </div>
            </div> 
            )
}

Sampler.defaultProps = {
}

export default Sampler;