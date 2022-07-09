import React, { useState } from 'react';
import { useContext } from "react";
import DistributionContext from "../contexts/distributionContext";

import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';

import { MinValidationTextField, MaxValidationTextField } from './validIntTextFields';

const RangeSelector = (width) => {
    const {xMin, xMax} = useContext(DistributionContext)

    return (
        <Grid container sx={{ maxWidth: width }}>
            <Grid item xs={true} style={{ display: "flex", justifyContent: "left" }}>
                <MaxValidationTextField  label={"Lower Bound"} defaultValue={xMin} maxInt={xMax}></MaxValidationTextField>
            </Grid>
            <Grid item xs={true} style={{ display: "flex", justifyContent: "right"}}>
                <MinValidationTextField  label={"Upper Bound"} defaultValue={xMax} minInt={xMin}></MinValidationTextField>
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