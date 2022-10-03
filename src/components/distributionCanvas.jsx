import React, { useCallback, useEffect, useRef, useState, useContext } from 'react';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid'

import DistributionContext from "../contexts/distributionContext";

import { getStats } from "../calcs/empirical"

const DistributionCanvas = ({ width, height }) => {

    const [isImage, setIsImage] = useState(false);
    const [refImage, setRefImage] = useState();

    const canvasRef = useRef(null);
    const [isPainting, setIsPainting] = useState(false);
    let [mousePosition, setMousePosition] = useState();

    const { xCoordinates, storeXCoordinates, 
            yCoordinates, storeYCoordinates,
            setDistributionStats,
            setSamplePoints,
            setIsSampled,
            xMin, xMax} = useContext(DistributionContext)

    function resetCanvas() {  
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.canvas.height = height;
        context.clearRect(0, 0, width, height);
        context.beginPath();
        // reset x and y coordinates 
        storeYCoordinates([]);
        storeXCoordinates([]);
        // reset reference images
        setIsImage(false);
        setRefImage(null);

        setDistributionStats({mean:0,median:0,std:0});

        setSamplePoints([]);
    }

    useEffect(() => {
        if (isPainting) {
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            context.clearRect(0, 0, width, height);
            context.beginPath();
            // set the background
            setBackground();

            // reset x and y coordinates 
            // storeYCoordinates([]);
            // storeXCoordinates([]);
        }
    }, [isPainting]);

    const startPaint = useCallback((event) => {
        const coordinates = getCoordinates(event);
        if (coordinates) {
            // clear entire canvas for a new drawing (users can only draw one line at a time)
            // resetCanvas();
            setMousePosition(coordinates);
            setIsPainting(true);
            storeYCoordinates([]);
            storeXCoordinates([]);
        }
        event.preventDefault();
    }, []);

    useEffect(() => {
        if (!canvasRef.current) {
            return;
        }
        const canvas = canvasRef.current;
        canvas.addEventListener('mousedown', startPaint);
        canvas.addEventListener('touchstart', startPaint);
        return () => {
            canvas.removeEventListener('mousestart', startPaint);
            canvas.removeEventListener('touchstart', startPaint);
        };
    }, [startPaint]);

    const paint = useCallback(
      (event) => {
        if (isPainting) {
          // android bad
          if ( navigator.userAgent.match(/Android/i) ) { 
            event.preventDefault();
          }

          let newMousePosition = getCoordinates(event);
          
          // going backwards is illegal 
          if (newMousePosition.x < mousePosition.x) {
            newMousePosition.x = mousePosition.x;
          }
          
          // invert height
          yCoordinates.push(height - newMousePosition.y)
          xCoordinates.push(newMousePosition.x)
          
          callStatsAPI();
          if (mousePosition && newMousePosition) {
            drawLine(mousePosition, newMousePosition);
            mousePosition = newMousePosition
          }
        }
        event.preventDefault();
      },
      [isPainting, mousePosition]
    );

    useEffect(() => {
        if (!canvasRef.current) {
            return;
        }
        const canvas = canvasRef.current;
        canvas.addEventListener('mousemove', paint)
        canvas.addEventListener('touchmove', paint);
        return () => {
            canvas.removeEventListener('mousemove', paint);
            canvas.removeEventListener('touchmove', paint);
        };
    }, [paint]);

    function callStatsAPI() {

        try {
            let result = getStats(xCoordinates, yCoordinates, Number(xMin), Number(xMax));
            setDistributionStats(result);
        }
        catch (err) {
            console.log(err);
        }
    }
    const exitPaint = useCallback(() => {
        setIsPainting(false);
        setMousePosition(undefined);
    }, []);

    useEffect(() => {
        if (!canvasRef.current) {
            return;
        }
        const canvas = canvasRef.current;
        canvas.addEventListener('mouseup', exitPaint);
        canvas.addEventListener('mouseleave', exitPaint);
        canvas.addEventListener('touchend', exitPaint);
        return () => {
            canvas.removeEventListener('mouseup', exitPaint);
            canvas.removeEventListener('mouseleave', exitPaint);
            canvas.removeEventListener('touchend', exitPaint);
        };
    }, [exitPaint]);

    const getCoordinates = (event) => {
        if (!canvasRef.current) {
            return;
        }
        const canvas = canvasRef.current;
        event.preventDefault();
        // get coordinates
        return { x: event.pageX - canvas.offsetLeft, y: event.pageY - canvas.offsetTop };
    };

    const drawLine = (originalMousePosition, newMousePosition) => {
        if (!canvasRef.current) {
            return;
        }
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (context) {
            context.strokeStyle = '#f7c101';
            context.lineJoin = 'round';
            context.lineWidth = 5;

            context.beginPath();
            context.moveTo(originalMousePosition.x, originalMousePosition.y);
            context.lineTo(newMousePosition.x, newMousePosition.y);
            context.closePath();

            context.stroke();
        }
    };

    const getFname = (event) => {
        // get the file name from an input field and turn it into a blob that can be loaded into a canvas
        var pathComponents = event.target.value.split('\\'),
            fileName = pathComponents[pathComponents.length - 1];

        var URL = window.webkitURL || window.URL;
        var url = URL.createObjectURL(event.target.files[0]);
        
        setRefImage(url);
        setIsImage(true);
    };

    const setBackground = () => {

        // set the background image
        if (!refImage) {
            return;
        }

        // update so that the width always stays the same but the height adjusts to preserve aspect ratio
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        context.canvas.width = width;
        context.canvas.height = height;

        var background = new Image();
        
        background.src = refImage;

        // Make sure the image is loaded first otherwise nothing will draw.
        background.onload = function() {

            // calculate the sizing for the image to fit within canvas
            const imWidth = background.width;
            const imHeight = background.height;

            var newWidth = context.canvas.width;
            var startx = 0;
            var starty = 0
               
            var ratio = (imHeight/imWidth);

            if (ratio > 1) {
              ratio--;
            }

            newWidth = Math.round(width * ratio);
            startx = Math.round((width-newWidth)*0.5);

            context.drawImage(background, startx, starty, newWidth, height);   
        }
        
    };
    
    useEffect(() => {
        // set background if image is updated
        if (!isImage) {
            setRefImage(null);
            return;
        }

        if (!canvasRef.current) {
            return;
        }
        setBackground();
    }, [refImage, isImage])


    useEffect(() => {
        callStatsAPI();
    }, [xMin, xMax])

    return (
        <div>
            <div className='canvasbuttons'>
                <Grid container sx={{ maxWidth: width }}>
                    <Grid item xs={true} style={{ display: "flex", justifyContent: "left" }}>
                        <Button variant="outlined" 
                                color="primary"
                                component="label"
                                >
                                Upload Image
                                <input
                                    type="file"
                                    hidden
                                    onChange={(event) => getFname(event)}
                                />
                        </Button>
                    </Grid>
                    <Grid item xs={true} style={{ display: "flex", justifyContent: "right"}}>
                        <Button variant="outlined" 
                                color="primary"
                                component="label"
                                onClick={() => {resetCanvas(); setIsSampled(false);}}
                                >
                                Reset
                        </Button>
                    </Grid>
                </Grid>
            </div>

            {/* TODO: Add a second canvas that sits behind this one and has the image (background of canvas with line shall be transparent) */}
            <canvas id="dist-canvas" ref={canvasRef} height={height} width={width}/>
        </div>
    );
};

DistributionCanvas.defaultProps = {
    width: window.innerWidth,
    height: window.innerHeight,
};

export default DistributionCanvas;