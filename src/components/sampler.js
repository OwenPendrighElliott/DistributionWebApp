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

import { getSamples } from "../calcs/empirical"

function copyArrayToClipboard(array) {
    navigator.clipboard.writeText(array.join('\n'));
}

const Sampler = () => {

    const [samplePoints, setSamplePoints] = useState([])
    const [open, setOpen] = React.useState(false);

    const { xCoordinates, yCoordinates, xMin, xMax, nSamples, setNSamples } = useContext(DistributionContext)

    function callSampleAPI() {
        // Sampling api call, generates n samples from
        // the distribution
        // let requestOptions = {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(
        //         {
        //         "yCoords": yCoordinates,
        //         "xCoords": xCoordinates,
        //         'xMin': xMin,
        //         'xMax': xMax,
        //         'nSamples': nSamples
        //         }
        //     )
        // };
    
        // // copy to clipboard using the json result directly 
        // // this is because setSamplePoints is asynchronous
        // // and the state may not be up to date if we access
        // // the samplePoints var in this function
        // fetch('/api/sample_distribution', requestOptions)
        // .then((res) => res.json())
        // .then((json) => {setSamplePoints(json.samples); copyArrayToClipboard(json.samples)});

        let result = getSamples(xCoordinates, yCoordinates, xMin, xMax, nSamples);
        setSamplePoints(result);
    }

    const handleTooltipClose = () => {
        setOpen(false);
    };

    const handleTooltipOpen = () => {
        setOpen(true);
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
                                        onClick={() => {callSampleAPI(); handleTooltipOpen()}}>
                                    Sample
                                </Button>
                            </Tooltip>
                        </Grid>
                    </Grid>
                </div>
                {samplePoints.length > 0 &&
                    <FixedSizeList 
                        itemData={samplePoints}
                        itemCount={samplePoints.length}
                        itemSize={20}
                        height={400}
                        width='100%'
                        overscanCount={25}          
                    >
                        {({data, index, style }) => {
                        return (
                            <ListItem style={style} key={index} component="div" disablePadding>
                                <ListItemText primary={data[index]} />
                            </ListItem>
                        );
                        }}
                    </FixedSizeList>
                }
            </div> 
            )
}

Sampler.defaultProps = {
    yCoordinates: [], 
    xCoordinates: [], 
    xMin: 0, 
    xMax: 100, 
    nSamples: 100
};

export default Sampler;