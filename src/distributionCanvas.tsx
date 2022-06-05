import React, { useCallback, useEffect, useRef, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

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


type Coordinate = {
    x: number;
    y: number;
};

function DistributionResultsTable({mean, median, std, width}: TableProps) {

    return (
        <div>
            <div>
                <br/> 
                <Typography variant='h4'>Distribution Statistics</Typography>
            </div>
            <div className="tablediv">
                <TableContainer sx={{maxWidth: width}} component={Paper}>
                    <Table sx={{ minWidth: 650}} aria-label="results table">
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

function Sampler({xCoordinates, yCoordinates, width, xMin, xMax, mean, median, std}: SamplerProps) {
    const [nSamples, setNSamples] = useState(10);
    return (
        <div>
            <div>
                <br/> 
                <Typography variant='h4'>Sampler</Typography>
                <br/> 
            </div>
            <div>
                <Grid container columnSpacing={1} justifyContent="center">
                    {/* add listener for the textfield and button here to do a sample (probably leave this to the end) */}
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
                        <Button variant="outlined" color="primary">Sample</Button>
                    </Grid>
                </Grid>
            </div>
        </div>
    );
}

const DistributionCanvas = ({ width, height }: CanvasProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isPainting, setIsPainting] = useState(false);
    let [mousePosition, setMousePosition] = useState<Coordinate | undefined>(undefined);

    // const [xCoordinates, storeXCoordinates] = useState([]);
    // const [yCoordinates, storeYCoordinates] = useState([]);

    let xCoordinates = [];
    let yCoordinates = [];

    // const [mean, setMean] = useState(0);
    // const [median, setMedian] = useState(0);
    // const [std, setStd] = useState(0);

    const [distributionStats, setDistributionStats] = useState({mean: "0", median: "0", std: "0"});

    const [xMin, setXMin] = useState(0);
    const [xMax, setXMax] = useState(100);

    function resetCanvas() {
        const canvas: HTMLCanvasElement = canvasRef.current;
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, width, height);
        context.beginPath();
        // storeYCoordinates([]);
        // storeXCoordinates([]);

        xCoordinates = [];
        yCoordinates = [];
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
                // console.log(xCoordinates)
                if (xCoordinates.length % 10 === 0) {
                    callAPI();
                }
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

    function callAPI() {
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
            context.strokeStyle = '#a6e22e';
            context.lineJoin = 'round';
            context.lineWidth = 5;

            context.beginPath();
            context.moveTo(originalMousePosition.x, originalMousePosition.y);
            context.lineTo(newMousePosition.x, newMousePosition.y);
            context.closePath();

            context.stroke();
        }
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

            <Sampler xCoordinates={xCoordinates} 
                     yCoordinates={yCoordinates} 
                     xMin={xMin} 
                     xMax={xMax}
                     width={width}
                     mean={distributionStats.mean}
                     std={distributionStats.std}
                     median={distributionStats.median}/>
        </div> 
    );
};

DistributionCanvas.defaultProps = {
    width: window.innerWidth,
    height: window.innerHeight,
};

export default DistributionCanvas;