import React, { useEffect, useState } from 'react';
import { Chart } from "react-google-charts";
import Grid from '@mui/material/Grid'
import * as jstat from "jStat";
import { getCDF,prepInputVectors } from "../calcs/empirical";
import { Typography } from '@mui/material';
import { fontFamily } from '@mui/system';

const SampleDashboard = ({samples, xMin, xMax, distributionStats, points}) => {

    const mainColour = "f7c101";

    const histOptions = {
        fontName: 'Source Sans Pro',
        titlePosition: 'none',
        legend: { position: 'none' },
        backgroundColor: { fill:'transparent' },
        animation: {
            duration: 200,
            easing: "out",
            startup: true,
        },
        hAxis: {
            title: "",
            titleTextStyle: {
                italic: false, 
                bold: true, 
                color: "white"
            },
            textStyle: { color: "white" },
            slantedText: true,
        },
        vAxis: {
            title: "Count of Samples",
            titleTextStyle: {
                italic: false, 
                bold: true, 
                color: "white"
            },
            textStyle: { color: "white" },
            gridlines: { color: '40444b' },
            minorGridlines: { color: '40444b' },
            format: "#",
        },
    };

    const areaOptions = {
        fontName: "Source Sans Pro",
        titlePosition: 'none',
        backgroundColor: { fill:'transparent' },
        animation: {
            duration: 200,
            easing: "out",
            startup: true,
        },
        hAxis: {
            title: "",
            titleTextStyle: {
                italic: false, 
                bold: true, 
                color: "white"
            },
            textStyle: { color: "white" },
            slantedText: false,
            gridlines: { color: '40444b' },
            minorGridlines: { color: '40444b' }
        },
        vAxis: {
            title: "Area Under Curve",
            titleTextStyle: {
                italic: false, 
                bold: true, 
                color: "white"
            },
            textStyle: { color: "white" },
            gridlines: { color: '40444b' },
            minorGridlines: { color: '40444b' }
        },
        legend: { 
            position: "bottom", 
            textStyle: { color: "white", fontFamily: "Comfortaa" },
        },
        focusTarget: "category",
    };

    // const mean = distributionStats.mean;
    // const std = distributionStats.std;
    // const median = distributionStats.median;
    
    function arrToBins(array) {
        let nBins = 10;
        if (array.length > 100) {
            nBins = 20;
        };

        if (xMax < xMin) {
            // reverse them and the array
        }

        let inc = (Number(xMax)-Number(xMin)) / nBins;
        let plotData = [["Range", "nSamples", {role: 'style',type: 'string'}]];
        let prev = Number(xMin);

        for (let i = 0; i < nBins; i++) {
            let count = 0;
            for (let j = 0; j < Math.min(array.length, 10000); j++){
                // do these comparisons the right way depending on bounds
                if (Number(xMax)>Number(xMin)){
                    if (array[j] > prev && array[j] < prev+inc) {
                        count = count + 1;
                    }
                } else {
                    if (array[j] < prev && array[j] > prev+inc) {
                        count = count + 1;
                    }
                }
            }
            
            // update bounds
            let minBound = Number(prev);
            let maxBound = Number(prev) + Number(inc);

            // convert to one dp
            minBound = +minBound.toFixed(1);
            maxBound = +maxBound.toFixed(1);

            if (i==0) {
                minBound = Math.min(Number(xMin), Number(xMax));
            }
            if (i==nBins-1){
                maxBound = Math.max(Number(xMin), Number(xMax));
            }
            let bucket = minBound + " - " + maxBound;
            plotData.push([bucket, count, mainColour]);
            prev = prev + inc;
        }
        return plotData;
    };

    function makeCDFData(xCoordinates, yCoordinates) {

        let mean = distributionStats.mean/(xMax-xMin);
        let std = distributionStats.std/(xMax-xMin);
    
        if (xCoordinates.length <= 1) {
            return [];
        }
        let yVector = prepInputVectors(xCoordinates, yCoordinates, xMin, xMax).y;
        let cdf = getCDF(yVector);
    
        let data = [["Y", "Within 1 std", "±1 std-dev", "±2 std-dev", {role: 'style'}]];
        for (let i = 0; i < Math.min(cdf.length, 10000); i++) {
            let color = "white";
            if (i / cdf.length <= mean - 2 * std) {
                //let color = "ff2d29";
                data.push([i / cdf.length * (xMax - xMin), null, null, cdf[i], color]);
            } else if (i / cdf.length <= mean - std) {
                //let color = "fc7600";
                data.push([i / cdf.length * (xMax - xMin), null, cdf[i], null, color]);
            } else if (i / cdf.length <= mean + std) {
                //let color = "f7c101";
                data.push([i / cdf.length * (xMax - xMin), cdf[i], null, null, color]);
            } else if (i / cdf.length <= mean + 2 * std) {
                //let color = "fc7600";
                data.push([i / cdf.length * (xMax - xMin), null, cdf[i], null, color]);
            } else if (i / cdf.length <= 1) {
                //let color = "ff2d29";
                data.push([i / cdf.length * (xMax - xMin), null, null, cdf[i], color]);
            }
        }

        return data;
    }

    return (
        <div>
            <Typography variant='h5' style={{fontFamily: "Comfortaa"}}></Typography>
            <Chart
                chartType="ColumnChart"
                width="100%"
                height="400px"
                data={arrToBins(samples)}
                options={histOptions}
            />
            <Typography variant='h5' style={{fontFamily: "Comfortaa"}}></Typography>
            <Chart
                chartType="AreaChart"
                width="100%"
                height="400px"
                data={makeCDFData(points.x, points.y)}
                options={areaOptions}
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
