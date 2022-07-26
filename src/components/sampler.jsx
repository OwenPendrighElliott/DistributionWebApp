import React, { useEffect, useState, useMemo } from 'react';
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


import { getSamples,getStats } from "../calcs/empirical";

import SampleDashboard from "./sampleDashboard";

import SampleScroller from './sampleScroller';

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

    function callSampleAPI() {
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
                    <Typography variant='h4'>Sampler</Typography>
                </div>
                <div className="SamplerInput">
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
                </div>
                
                
                {samplePoints.length > 0 &&
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