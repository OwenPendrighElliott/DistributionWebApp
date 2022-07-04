import React, { useState } from 'react';

import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';

const RangeSelector = (width) => {
    const [xMin, setXMin] = useState(0);
    const [xMax, setXMax] = useState(100);

    return (
        //<div>
            <Grid container sx={{ maxWidth: width }}>
                {/* add listner to these text fields and update the xMin and xMax values on change */}
                <Grid item xs={true} style={{ display: "flex", justifyContent: "left" }}>
                    <TextField id="outlined-basic" 
                        label="Lower Bound" 
                        variant="outlined" 
                        type={'number'}
                        defaultValue={xMin} 
                        onChange={(event) =>
                            setXMin(parseInt(event.target.value))
                        }
                    />
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
        //</div>
    )
}

RangeSelector.defaultProps = {
    width: window.innerWidth,
    xMin: 0,
    xMax: 100
};

export default RangeSelector;