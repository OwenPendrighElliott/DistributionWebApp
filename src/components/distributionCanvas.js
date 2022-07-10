import React, { useCallback, useEffect, useRef, useState, useContext } from 'react';

import Button from '@mui/material/Button';

import DistributionContext from "../contexts/distributionContext";

const DistributionCanvas = ({ width, height }) => {

    const [isImage, setIsImage] = useState(false);
    const [refImage, setRefImage] = useState();

    const canvasRef = useRef(null);
    const [isPainting, setIsPainting] = useState(false);
    let [mousePosition, setMousePosition] = useState();

    const { xCoordinates, storeXCoordinates, 
            yCoordinates, storeYCoordinates,
            setDistributionStats,
            xMin, xMax} = useContext(DistributionContext)

    function resetCanvas() {  
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, width, height);
        context.beginPath();
        // reset x and y coordinates 
        storeYCoordinates([]);
        storeXCoordinates([]);
        // reset reference images
        setIsImage(false);
        setRefImage(null);
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
            storeYCoordinates([]);
            storeXCoordinates([]);
        }
    }, [isPainting]);

    const startPaint = useCallback((event) => {
        const coordinates = getCoordinates(event);
        if (coordinates) {
            // clear entire canvas for a new drawing (users can only draw one line at a time)
            // resetCanvas();
            setMousePosition(coordinates);
            setIsPainting(true);
        }
    }, []);

    useEffect(() => {
        if (!canvasRef.current) {
            return;
        }
        const canvas = canvasRef.current;
        canvas.addEventListener('mousedown', startPaint);
        return () => {
            canvas.removeEventListener('mousedown', startPaint);
        };
    }, [startPaint]);

    const paint = useCallback(
        (event) => {
            if (isPainting) {
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
        },
        [isPainting, mousePosition]
    );

    useEffect(() => {
        if (!canvasRef.current) {
            return;
        }
        const canvas = canvasRef.current;
        canvas.addEventListener('mousemove', paint);
        return () => {
            canvas.removeEventListener('mousemove', paint);
        };
    }, [paint]);

    function callStatsAPI() {
        // do the api call here to get the distribution stats
        // update the distribution stats using the result 
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
        const canvas = canvasRef.current;
        canvas.addEventListener('mouseup', exitPaint);
        canvas.addEventListener('mouseleave', exitPaint);
        return () => {
            canvas.removeEventListener('mouseup', exitPaint);
            canvas.removeEventListener('mouseleave', exitPaint);
        };
    }, [exitPaint]);

    const getCoordinates = (event) => {
        if (!canvasRef.current) {
            return;
        }
        const canvas = canvasRef.current;

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

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        var background = new Image();

        background.src = refImage;

        // Make sure the image is loaded first otherwise nothing will draw.
        background.onload = function() {
            context.drawImage(background, 0, 0, width, height);   
        }

        console.log("Rendering image");
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

    return (
        <div>
            <div class="canvasImageButton">
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
            </div> 

            <div class="resetButton">
                <Button variant="outlined" 
                        color="primary"
                        component="label"
                        onClick={() => {resetCanvas();}}
                        >
                        Reset
                </Button>
            </div> 

            {/* TODO: Add a second canvas that sits behind this one and has the image (background of canvas with line shall be transparent) */}
            <div class="CanvasArea">
                <canvas ref={canvasRef} height={height} width={width}/>
            </div> 
        </div>
    );
};

DistributionCanvas.defaultProps = {
    width: window.innerWidth,
    height: window.innerHeight,
};

export default DistributionCanvas;