import React, { useEffect, useState } from 'react';
import { Chart } from "react-google-charts";
import Grid from '@mui/material/Grid'
import * as jstat from "jStat";
import { getCDF,prepInputVectors } from "../calcs/empirical";
import { Typography } from '@mui/material';

const MAX_POINTS = 200;

const SampleDashboard = ({samples, xMin, xMax, distributionStats, points}) => {

    const mainColour = "84c8f9";

    const histOptions = {
        titlePosition: 'none',
        legend: { position: 'none' },
        backgroundColor: { fill:'transparent' },
        animation: {
            duration: 200,
            easing: "out",
            startup: true,
        },
        hAxis: {
            title: "Bin",
            titleTextStyle: {
                italic: false, 
                bold: true, 
                color: "white"
            },
            textStyle: { color: "white" },
            slantedText: true,
        },
        vAxis: {
            title: "Count",
            titleTextStyle: {
                italic: false, 
                bold: true, 
                color: "white"
            },
            textStyle: { color: "white" },
            gridlines: { color: '40444b' },
            minorGridlines: { color: '40444b' }
        },
    };

    const scatterOptions = {
        titlePosition: 'none',
        legend: { position: 'none' },
        backgroundColor: { fill:'transparent' },
        animation: {
            duration: 200,
            easing: "out",
            startup: true,
        },
        
        hAxis: {
            title: "x",
            titleTextStyle: {
                italic: false, 
                bold: true, 
                color: "white"
            },
            textStyle: { color: "white" },
            slantedText: true,
            gridlines: { color: '40444b' },
            minorGridlines: { color: '40444b' }
        },
        vAxis: {
            title: "Φ",
            titleTextStyle: {
                italic: false, 
                bold: true, 
                color: "white"
            },
            textStyle: { color: "white" },
            gridlines: { color: '40444b' },
            minorGridlines: { color: '40444b' }
        },
    };

    // const mean = distributionStats.mean;
    // const std = distributionStats.std;
    // const median = distributionStats.median;

    function arrToBins(array) {
        let nBins = 10;
        if (array.length > 100) {
            nBins = 20;
        } else {
            nBins = 10;
        };

        let inc = (xMax-xMin) / nBins;
        let plotData = [["Range", "nSamples", {role: 'style',type: 'string'}]];
        let prev = xMin;
        for (let i = 0; i < nBins; i++) {
            let count = 0;
            for (let j = 0; j < array.length; j++){
                if (array[j] > prev && array[j] < prev+inc) {
                    count = count + 1;
                }
            }
            // let minBound = Math.round(prev);
            // let maxBound = Math.round(prev+inc);
            let minBound = prev;
            let maxBound = prev+inc;
           
            minBound = +minBound.toFixed(1);
            maxBound = +maxBound.toFixed(1);

            if (i==0) {
                minBound = xMin;
            }
            if (i==nBins-1){
                maxBound = xMax;
            }
            let bucket = minBound + " - " + maxBound;
            plotData.push([bucket, count, mainColour]);
            prev = prev + inc;
        }
        return plotData;
    };

    function makeCDFData(xCoordinates, yCoordinates) {

        let median = distributionStats.median/(xMax-xMin);
        let mean = distributionStats.mean/(xMax-xMin);
        let std = distributionStats.std/(xMax-xMin);
    
        if (xCoordinates.length <=1 ) {
            return [];
        }
        let yVector = prepInputVectors(xCoordinates, yCoordinates, xMin, xMax).y;
        let cdf = getCDF(yVector);
    
        let interval = Math.ceil(cdf.length/MAX_POINTS);
        console.log(interval);
        let data = [["", "", {role: 'style',type: 'string'}]];
        for (let i = 0; i < cdf.length; i++) {
            if (i%interval==0){
                let color = mainColour;
                
                // colour code within one std dev
                if (i/cdf.length > mean-std && i/cdf.length < mean+std) {
                    color = "green";
                }
    
                data.push([i/cdf.length*(xMax-xMin), cdf[i], color]);
            }
        }
    
        // median point
        data.push([median*(xMax-xMin), 0.5, 'red']);
    
        // mean point
        let meanY = 1;
        let min = 1;
        for (let i = 0; i < cdf.length; i++) {
            if (Math.abs(i/cdf.length-mean) < min) {
                meanY = cdf[i];
                min = Math.abs(i/cdf.length-mean);
            }
        }
        data.push([mean*(xMax-xMin), meanY, 'purple']);
        return data
    }

    return (
        <div>
            <Typography variant='h5'>Sample Histogram</Typography>
            <Chart
                chartType="ColumnChart"
                width="100%"
                height="400px"
                data={arrToBins(samples)}
                options={histOptions}
            />
            <Typography variant='h5'>Cumulative Distribution Function</Typography>
            <Chart
                chartType="ScatterChart"
                width="100%"
                height="400px"
                data={makeCDFData(points.x, points.y)}
                options={scatterOptions}
            />

        </div>
    );
}

SampleDashboard.defaultProps = {
    samples: [],
    xMin: 0, 
    xMax: 100, 
};

export default React.memo(SampleDashboard);
