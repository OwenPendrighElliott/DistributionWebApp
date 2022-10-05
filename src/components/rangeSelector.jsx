import React from 'react';
import { useContext } from "react";
import DistributionContext from "../contexts/distributionContext";

import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';

const RangeSelector = (width) => {
    const {xMin, xMax, setXMax, setXMin} = useContext(DistributionContext)


    function forcedXMax(e) {
      if (!e.target.value) {
        setXMax(null);
        return;
      }
      var numXMin = Number(xMin);
      var numXMax = Number(e.target.value);
      if (numXMin == numXMax) {
        numXMax = numXMin + 1;
      }
      setXMax(numXMax);
    }

    return (
        <Grid container sx={{ maxWidth: width }}>
            <Grid item xs={true} style={{ display: "flex", justifyContent: "left" }}>
                {/* <MaxValidationTextField  label={"Lower Bound"} defaultValue={xMin} maxInt={xMax}></MaxValidationTextField> */}
                <TextField
                    label='Left Bound'
                    type={'number'}
                    onChange={(e) => setXMin(e.target.value)}
                    value={xMin}
                />
            </Grid>
            <Grid item xs={true} style={{ display: "flex", justifyContent: "right"}}>
                {/* <MinValidationTextField  label={"Upper Bound"} defaultValue={xMax} minInt={xMin}></MinValidationTextField> */}
                <TextField
                    label='Right Bound'
                    type={'number'}
                    onChange={(e) => forcedXMax(e)}
                    value={xMax}
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