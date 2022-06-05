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
import { render } from '@testing-library/react';

class DistributionCanvas extends React.Component {
    constructor (props) {
        super(props);
        
        this.width = props.width;
        this.height = props.height;

        this.canvasRef = useRef<HTMLCanvasElement>(null);
        this.isPainting = false;
        this.mousePosition = { x: null, y: null };

        this.xCoordinates = [];
        this.yCoordinates = [];
    }

    resetCanvas() {
        const canvas = this.canvasRef.current;
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, this.width, this.height);
        context.beginPath();
        this.xCoordinates = [];
        this.yCoordinates = [];
    }

    getCoordinates = (event) => {
        if (!this.canvasRef.current) {
            return;
        }

        const canvas = this.canvasRef.current;
        return { x: event.pageX - canvas.offsetLeft, y: event.pageY - canvas.offsetTop };
    }

    startPaint = useCallback((event) => {
        const coordinates = this.getCoordinates(event);
        if (coordinates) {
            // clear entire canvas for a new drawing (users can only draw one line at a time)
            this.resetCanvas();
            this.mousePosition = coordinates;
            this.isPainting = true;
        }
    }, [])

    exitPaint = useCallback(() => {
        this.mousePosition = { x: null, y: null };
        this.isPainting = true;
        // do the api call here to get the distribution stats
        // update the distribution stats using the result 
    }, []);

    paint = useCallback(
        (event) => {
            if (this.isPainting) {
                let newMousePosition = this.getCoordinates(event);
                
                // going backwards is illegal 
                if (newMousePosition.x < this.mousePosition.x) {
                    newMousePosition.x = this.mousePosition.x;
                }
                
                // invert height
                this.yCoordinates.push(this.height - newMousePosition.y)
                this.xCoordinates.push(newMousePosition.x)

                if (this.mousePosition && newMousePosition) {
                    this.drawLine(this.mousePosition, newMousePosition);
                    this.mousePosition = newMousePosition
                }

            }
        },
        [this.isPainting, this.mousePosition]
    );
    
    drawLine = (originalMousePosition, newMousePosition) => {
        if (!this.canvasRef.current) {
            return;
        }
        const canvas = this.canvasRef.current;
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
    
    render() {
        return (
        <div>
            <canvas ref={this.canvasRef} height={this.height} width={this.width}/>
        </div> 
        )
    }
};


export default DistributionCanvas;