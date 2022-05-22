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
}

type Coordinate = {
    x: number;
    y: number;
};

const DistributionComponent = ({ width, height }: CanvasProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isPainting, setIsPainting] = useState(false);
    const [mousePosition, setMousePosition] = useState<Coordinate | undefined>(undefined);

    const [xCoordinates, storeXCoordinates] = useState([]);
    const [yCoordinates, storeYCoordinates] = useState([]);

    const [mean, setMean] = useState(0);
    const [median, setMedian] = useState(0);
    const [std, setStd] = useState(0);

    const [xMin, setXMin] = useState(0);
    const [xMax, setXMax] = useState(100);

    const [nSamples, setNSamples] = useState(10);

    function resetCanvas() {
        const canvas: HTMLCanvasElement = canvasRef.current;
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, width, height);
        context.beginPath();
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
                const newMousePosition = getCoordinates(event);
                storeYCoordinates([...yCoordinates, newMousePosition.x]);
                storeXCoordinates([...xCoordinates, newMousePosition.y]);
                // console.log(yCoordinates);
                
                if (mousePosition && newMousePosition) {
                    drawLine(mousePosition, newMousePosition);
                    setMousePosition(newMousePosition);
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

    const exitPaint = useCallback(() => {
        setIsPainting(false);
        setMousePosition(undefined);

        // do the api call here to get the distribution stats
        // update the distribution stats using the result 
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
                    <Grid item xs={true} style={{ display: "flex", justifyContent: "left" }}>
                        <TextField id="outlined-basic" label="Lower Bound" variant="outlined" defaultValue={xMin}/>
                    </Grid>
                    <Grid item xs={true} style={{ display: "flex", justifyContent: "right" }}>
                        <TextField id="outlined-basic" label="Upper Bound" variant="outlined" defaultValue={xMax}/>
                    </Grid>
                </Grid>
            </div>
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
            <div>
                <br/> 
                <Typography variant='h4'>Sampler</Typography>
                <br/> 
            </div>
            <div>
                <Grid container columnSpacing={1} justifyContent="center">
                    <Grid item>
                        <TextField id="outlined-basic" label="Samples" variant="outlined" defaultValue={nSamples}/>
                    </Grid>
                    <Grid item alignItems="stretch" style={{ display: "flex" }}>
                        <Button variant="outlined" color="primary">Sample</Button>
                    </Grid>
                </Grid>
            </div>
        </div> 
    );
};

DistributionComponent.defaultProps = {
    width: window.innerWidth,
    height: window.innerHeight,
};

export default DistributionComponent;