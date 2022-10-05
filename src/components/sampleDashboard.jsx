import React from 'react';
import { Chart } from "react-google-charts";
import { getCDF,prepInputVectors } from "../calcs/empirical";
import { roundValueFixed } from '../calcs/utils';
var nj = require("jsnumpy")

const factors = number => [...Array(number + 1).keys()].filter(i=>number % i === 0);

const SampleDashboard = ({samples, xMin, xMax, distributionStats, points}) => {

    const mainColour = "f7c101";

    const histOptions = {
        fontName: 'Source Code Pro',
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
            minorGridlines: { color: '40444b', multiple: 1},
            format: "#"
        }
    };

    const areaOptions = {
        fontName: "Source Code Pro",
        titlePosition: 'none',
        lineWidth: 3,
        series: {
            0: {
                color: "f7c101"
            },
            1: {
                color: "fc7600"
            },
            2: {
                color: "ff2d29"
            }
        },
        backgroundColor: { fill: 'transparent' },
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
            minorGridlines: { color: '40444b' },
            minValue: xMin,
            maxValue: xMax
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
    
    function arrToBins(array, xMin, xMax) {
        // Set number of bins based on boundaries
        let dpSplit = Math.abs(xMax - xMin).toString().split(".");
        let tenPower = (dpSplit[1] != null) ? dpSplit[1].length : 2;
        tenPower = (tenPower > 4) ? 4 : tenPower;
        let nBinsCandidates = factors(Math.round(Math.abs(xMax - xMin) * (10 ** tenPower)));
        let limit = (array.length < 20) ? 10: 20;
        let nBins = parseInt(nj.highestElement(nBinsCandidates.filter(n=>n <= limit)));
        nBins = (nBins < 7) ? 10 : nBins;

        let inc = (Number(xMax)-Number(xMin)) / nBins;
        let plotData = [["Range", "nSamples", {role: 'style', type: 'string'}]];
        let prev = Number(xMin);

        for (let i = 0; i < nBins; i++) {
            let count = 0;
            for (let j = 0; j < array.length; j++){
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

            // round to fixed dp
            minBound = roundValueFixed(+minBound, xMin, xMax, 2);
            maxBound = roundValueFixed(+maxBound, xMin, xMax, 2);

            if (i===0) {
                minBound = Math.min(Number(xMin), Number(xMax));
            }
            if (i===nBins-1){
                maxBound = Math.max(Number(xMin), Number(xMax));
            }
            let bucket = minBound + " - " + maxBound;
            plotData.push([bucket, count, mainColour]);
            prev = prev + inc;
        }

        return plotData;
    };

    function makeCDFData(xCoordinates, yCoordinates) {

        // For some reason, these sometimes come in as text...
        let mean = Number(distributionStats.mean);
        let std = Number(distributionStats.std);

        if (xCoordinates.length <= 1) {
            return [];
        }

        let xVector = prepInputVectors(xCoordinates, yCoordinates, xMin, xMax).x.map(Number);
        xVector = nj.add([xVector], +xMin)[0];
        xVector[0] = Number(xMin);
        xVector[xVector.length-1] = Number(xMax);
        let yVector = prepInputVectors(xCoordinates, yCoordinates, xMin, xMax).y;
        let cdf = getCDF(yVector);

        let data = [["X", "Within 1 std-dev", "±1 std-dev", "±2 std-dev"]];
        let x = 0;
        for (let i = 0; i < cdf.length; i++) {
            x = Number(xVector[i]);
            if (x <= mean - 2 * std || x >= mean + 2 * std) {
                data.push([x, null, null, +cdf[i]]);
            } else if (x <= mean - std || x >= mean + std) {
                data.push([x, null, +cdf[i], null]);
            } else {
                data.push([x, +cdf[i], null, null]);
            };
        }
        return data;
    }

    return (
        <div>
            <Chart
                chartType="ColumnChart"
                width="100%"
                height="400px"
                data={arrToBins(samples, xMin, xMax)}
                options={histOptions}
            />
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
