import React, { useCallback, useEffect, useRef, useState, useContext } from 'react';
import DistributionContext from "../contexts/distributionContext";

const DistributionCanvas = ({ width, height }) => {
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
    }

    const startPaint = useCallback((event) => {
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
        const canvas = canvasRef.current;
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
    return (
        <div className="CanvasArea">
            <canvas ref={canvasRef} height={height} width={width}/>
        </div> 
    );
};

DistributionCanvas.defaultProps = {
    width: window.innerWidth,
    height: window.innerHeight,
};

export default DistributionCanvas;