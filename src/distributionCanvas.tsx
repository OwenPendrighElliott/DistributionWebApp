import React, { useCallback, useEffect, useRef, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { FixedSizeList } from 'react-window';

import Typography from '@mui/material/Typography';

import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

import Tooltip from '@mui/material/Tooltip';

interface CanvasProps {
    width: number;
    height: number;

    xCoordinates: number[];
    yCoordinates: number[];

    mean: string;
    median: string;
    std: string;

    xMin: number;
    xMax: number;
}

interface TableProps {
    width: number;

    mean: string;
    median: string;
    std: string;
}

interface SamplerProps {
    width: number;

    xCoordinates: number[];
    yCoordinates: number[];
    xMin: number;
    xMax: number;
    mean: string;
    median: string;
    std: string;
}

type SampleListElement = {
    index: number;
    sample: number;
};

type Coordinate = {
    x: number;
    y: number;
};

function copyArrayToClipboard(array: number[]) {
    navigator.clipboard.writeText(array.join('\n'));
}

function DistributionResultsTable({mean, median, std, width}: TableProps) {
    return (
        <div>
            <div>
                <br/> 
                <Typography variant='h4'>Distribution Statistics</Typography>
            </div>
            <div className="tablediv">
                <TableContainer sx={{maxWidth: width}} component={Paper}>
                    <Table aria-label="results table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Mean</TableCell>
                                <TableCell align="center">Median</TableCell>
                                <TableCell align="center">Std.</TableCell> 
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell align="center">{mean}</TableCell>
                                <TableCell align="center">{median}</TableCell>
                                <TableCell align="center">{std}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    );
}

const DistributionCanvas = ({ width, height }: CanvasProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isPainting, setIsPainting] = useState(false);
    let [mousePosition, setMousePosition] = useState<Coordinate | undefined>(undefined);

    const [xCoordinates, storeXCoordinates] = useState([]);
    const [yCoordinates, storeYCoordinates] = useState([]);

    const [distributionStats, setDistributionStats] = useState({mean: "0", median: "0", std: "0"});

    const [xMin, setXMin] = useState(0);
    const [xMax, setXMax] = useState(100);

    const [nSamples, setNSamples] = useState(100);
    const [samplePoints, setSamplePoints] = useState([]);

    const [open, setOpen] = React.useState(false);

    function resetCanvas() {
        const canvas: HTMLCanvasElement = canvasRef.current;
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, width, height);
        context.beginPath();

        // reset x and y coordinates 
        storeYCoordinates([]);
        storeXCoordinates([]);
    }

    const startPaint = useCallback((event: MouseEvent) => {
        const coordinates = getCoordinates(event);
        if (coordinates) {
            // clear entire canvas for a new drawing (users can only draw one line at a time)
            resetCanvas();
            setMousePosition(coordinates);
            setIsPainting(true);
        }
    }, []);

    useEffect(() => {
        if (!canvasRef.current) {
            return;
        }
        const canvas: HTMLCanvasElement = canvasRef.current;
        canvas.addEventListener('mousedown', startPaint);
        return () => {
            canvas.removeEventListener('mousedown', startPaint);
        };
    }, [startPaint]);

    const paint = useCallback(
        (event: MouseEvent) => {
            if (isPainting) {
                let newMousePosition = getCoordinates(event);
                
                // going backwards is illegal 
                if (newMousePosition.x < mousePosition.x) {
                    newMousePosition.x = mousePosition.x;
                }
                
                // invert height
                yCoordinates.push(height - newMousePosition.y)
                xCoordinates.push(newMousePosition.x)
                
                // .push is synchronous so call the stats API 
                // which acceses the vars
                callStatsAPI();
                if (mousePosition && newMousePosition) {
                    drawLine(mousePosition, newMousePosition);
                    mousePosition = newMousePosition
                }
            }
        },
        [isPainting, mousePosition]
    );

    useEffect(() => {
        if (!canvasRef.current) {
            return;
        }
        const canvas: HTMLCanvasElement = canvasRef.current;
        canvas.addEventListener('mousemove', paint);
        return () => {
            canvas.removeEventListener('mousemove', paint);
        };
    }, [paint]);

    function callStatsAPI() {
        // do the api call here to get the distribution stats
        // update the distribution stats using the result 
        // console.log(xCoordinates)
        let requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(
                    {
                    "yCoords": yCoordinates,
                    "xCoords": xCoordinates,
                    'xMin': xMin,
                    'xMax': xMax
                }
            )
        };
        fetch('/api/calculate_statistics', requestOptions)
        .then((res) => res.json())
        .then((json) => {setDistributionStats({mean: json.mean, median: json.median, std: json.std})});        
    }

    function callSampleAPI() {
        // Sampling api call, generates n samples from
        // the distribution
        let requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(
                {
                "yCoords": yCoordinates,
                "xCoords": xCoordinates,
                'xMin': xMin,
                'xMax': xMax,
                'nSamples': nSamples
                }
            )
        };

        // copy to clipboard using the json result directly 
        // this is because setSamplePoints is asynchronous
        // and the state may not be up to date if we access
        // the samplePoints var in this function
        fetch('/api/sample_distribution', requestOptions)
        .then((res) => res.json())
        .then((json) => {setSamplePoints(json.samples); copyArrayToClipboard(json.samples)});
    }

    const exitPaint = useCallback(() => {
        setIsPainting(false);
        setMousePosition(undefined);
    }, []);

    useEffect(() => {
        if (!canvasRef.current) {
            return;
        }
        const canvas: HTMLCanvasElement = canvasRef.current;
        canvas.addEventListener('mouseup', exitPaint);
        canvas.addEventListener('mouseleave', exitPaint);
        return () => {
            canvas.removeEventListener('mouseup', exitPaint);
            canvas.removeEventListener('mouseleave', exitPaint);
        };
    }, [exitPaint]);

    const getCoordinates = (event: MouseEvent): Coordinate | undefined => {
        if (!canvasRef.current) {
            return;
        }

        const canvas: HTMLCanvasElement = canvasRef.current;
        return { x: event.pageX - canvas.offsetLeft, y: event.pageY - canvas.offsetTop };
    };

    const drawLine = (originalMousePosition: Coordinate, newMousePosition: Coordinate) => {
        if (!canvasRef.current) {
            return;
        }
        const canvas: HTMLCanvasElement = canvasRef.current;
        const context = canvas.getContext('2d');
        if (context) {
            context.strokeStyle = '#89cff0';
            context.lineJoin = 'round';
            context.lineWidth = 5;

            context.beginPath();
            context.moveTo(originalMousePosition.x, originalMousePosition.y);
            context.lineTo(newMousePosition.x, newMousePosition.y);
            context.closePath();

            context.stroke();
        }
    };

    const handleTooltipClose = () => {
        setOpen(false);
    };

    const handleTooltipOpen = () => {
        setOpen(true);
    };

    return (
        <div>
            <div>
                <canvas ref={canvasRef} height={height} width={width}/>
            </div>
            <div>
                <Grid container>
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
            </div>

            <DistributionResultsTable mean={distributionStats.mean} 
                                      median={distributionStats.median} 
                                      std={distributionStats.std} 
                                      width={width}/>
            <div>
                <br/> 
                <Typography variant='h4'>Sampler</Typography>
                <br/> 
            </div>
            <div>
                <Grid container columnSpacing={1} justifyContent="left">
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
            {/* <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justifyContent="center"
                sx={{ paddingLeft: "25%" }}
                width="50%"
                >
                <Grid item 
                      xs={1}
                      sx={{ width: '200%', 
                            height: 400, 
                            bgcolor: 'background.paper',
                        }}
                >
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
                </Grid>       
            </Grid> */}
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
        </div> 
    );
};

DistributionCanvas.defaultProps = {
    width: window.innerWidth,
    height: window.innerHeight,
};

export default DistributionCanvas;