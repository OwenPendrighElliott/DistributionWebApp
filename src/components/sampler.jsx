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

function copyArrayToClipboard(array) {
    navigator.clipboard.writeText(array.join('\n'));
}

const Sampler = () => {

    const [isSampled, setIsSampled] = useState(false)

    // const [samplePoints, setSamplePoints] = useState([])
    const [open, setOpen] = React.useState(false);

    const { xCoordinates, yCoordinates, xMin, xMax, nSamples, setNSamples, samplePoints, setSamplePoints} = useContext(DistributionContext)

    const [distStats, setDistributionStats] = useState({mean:0,median:0,std:0});

    function callSampleAPI() {
        let result = getSamples(xCoordinates, yCoordinates, Number(xMin), Number(xMax), Number(nSamples));
        setSamplePoints(result);
        copyArrayToClipboard(result);
    }


    useEffect(() => {
        try {
            let result = getStats(xCoordinates, yCoordinates, Number(xMin), Number(xMax));
            setDistributionStats(result);
        }
        catch (err) {
            console.log(err);
            setDistributionStats({mean: 0, median: 0, std: 0});
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

    // useEffect(() => {
    //     if (samplePoints.length > 0) {
    //         callSampleAPI(); 
    //     }
    // }, [xMin, xMax]);

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
                
                <div className='SamplerErrorMsg'>
                    <Fade in={isSampled && samplePoints.length == 0}>
                        <Alert severity="error" sx={{ width: '100%' }}>
                            Please draw a distribution first!
                        </Alert>
                    </Fade>
                </div>

                </div>
                    <SampleDashboard samples={samplePoints} 
                                     xMin={xMin} 
                                     xMax={xMax} 
                                     distributionStats={distStats}>
                    </SampleDashboard>
            </div> 
            )
}

Sampler.defaultProps = {
    yCoordinates: [], 
    xCoordinates: [], 
    xMin: 0, 
    xMax: 100, 
    nSamples: 200
};

export default React.memo(Sampler);