import React, { useState } from 'react';
import { useContext } from "react";
import DistributionContext from "../contexts/distributionContext";

import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';

import ValidationTextField from './maxIntTextField';

const RangeSelector = (width) => {
    const {xMin, setXMin, xMax, setXMax} = useContext(DistributionContext)

    return (
        <Grid container sx={{ maxWidth: width }}>
            <Grid item xs={true} style={{ display: "flex", justifyContent: "left" }}>
                {/* <TextField id="outlined-basic" 
                           label="Lower Bound" 
                           variant="outlined" 
                           type={'number'}
                           defaultValue={xMin} 
                           onChange={(event) =>
                               setXMin(parseInt(event.target.value))
                           }
                /> */}
                <ValidationTextField  label={"Lower Bound"} defaultValue={xMin} maxInt={xMax}></ValidationTextField>
            </Grid>
            <Grid item xs={true} style={{ display: "flex", justifyContent: "right"}}>
                <TextField id="outlined-basic" 
                           label="Upper Bound" 
                           variant="outlined" 
                           type={'number'}
                           inputProps={{ style: {textAlign: 'right'} }} 
                           defaultValue={xMax} 
                           onChange={(event) =>
                               setXMax(parseInt(event.target.value))
                           }
                />
            </Grid>
        </Grid>
    )
}

RangeSelector.defaultProps = {
    width: window.innerWidth,
    xMin: 0,
    xMax: 100
};

export default RangeSelector;