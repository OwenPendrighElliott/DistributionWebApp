import React, { useEffect, useState } from 'react';
import { Chart } from "react-google-charts";
import Grid from '@mui/material/Grid'
import * as jstat from "jStat";

const MAX_POINTS = 500;

function generateNormalSamples(nSamples, mean, std) {
    let samples = [];
    for (let i = 0; i < nSamples; i++) {
        samples.push(jstat.normal.sample(mean, std));
    }
    return samples;
}

function generateUniformSamples(nSamples, xMin, xMax) {
    let samples = [];
    for (let i = 0; i < nSamples; i++) {
        samples.push(jstat.uniform.sample(xMin, xMax));
    }
    return samples;
}

function generateLognormalSamples(nSamples, mean, std, xMin, xMax) {
    let samples = [];

    let range = xMax-xMin;

    let scaledMean = mean/range;
    let scaledStd = std/range;

    console.log(scaledMean, scaledStd);
    for (let i = 0; i < nSamples; i++) {
        samples.push(jstat.lognormal.sample(scaledMean, scaledStd)*range);
    }
    return samples;
}

function generateTriangularSamples(nSamples, xMin, xMax, yMax) {
    let samples = [];
    for (let i = 0; i < nSamples; i++) {
        samples.push(jstat.triangular.sample(xMin, xMax, yMax));
    }
    return samples;
}

function generateArcsineSamples(nSamples, xMin, xMax) {
    let samples = [];
    let range = xMax-xMin;
    for (let i = 0; i < nSamples; i++) {
        samples.push(jstat.arcsine.sample(0, 1)*range);
    }
    return samples;
}

function makeQQData(samples, theoreticalSamples) {
    // if (!samples) {
    //     return [["Samples", "Theoretical Samples"], [0,0]];
    // }
    // if (!theoreticalSamples) {
    //     return [["Samples", "Theoretical Samples"], [0,0]];
    // }

    if (samples.length==0) {
        return [["Samples", "Theoretical Samples"], [0,0]];
    }
    if (theoreticalSamples.length==0) {
        return [["Samples", "Theoretical Samples"], [0,0]];
    }

    if (samples.length > MAX_POINTS) {
        samples = samples.slice(0, MAX_POINTS);
    }
    if (theoreticalSamples.length > MAX_POINTS) {
        theoreticalSamples = theoreticalSamples.slice(0, MAX_POINTS);
    }

    samples.sort(function(a, b){return a-b});
    theoreticalSamples.sort(function(a, b){return a-b});

    console.log(samples);
    console.log(theoreticalSamples);

    let data = [["Samples", "Theoretical Samples"]]

    for (let i = 0; i < samples.length; i++){
        data.push([samples[i], theoreticalSamples[i]]);
    }

    console.log(data)
    return data
}


const SampleDashboard = ({samples, xMin, xMax, distributionStats}) => {
    const histOptions = {
        chart: { title: "Sample Histogram" },
        legend: { position: 'none' },
        backgroundColor: { fill:'transparent' },
        animation: {
            duration: 500,
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
        legend: { position: 'none' },
        backgroundColor: { fill:'transparent' },
        animation: {
            duration: 500,
            easing: "out",
            startup: true,
        },
        
        hAxis: {
            title: "Theoretical Quantiles",
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
            title: "Sampled Quantiles",
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


    const titleStyle = {italic: false, bold: true, color: "white"};
    const normScatterOptions = structuredClone(scatterOptions);
    normScatterOptions.title = "Normal Distribution Q-Q Plot";
    normScatterOptions.titleTextStyle = titleStyle;
    const uniformScatterOptions = structuredClone(scatterOptions);
    uniformScatterOptions.title = "Uniform Distribution Q-Q Plot";
    uniformScatterOptions.titleTextStyle = titleStyle;
    const lognormScatterOptions = structuredClone(scatterOptions);
    lognormScatterOptions.title = "Lognormal Distribution Q-Q Plot";
    lognormScatterOptions.titleTextStyle = titleStyle;
    const arcsineScatterOptions = structuredClone(scatterOptions);
    arcsineScatterOptions.title = "Arcsine Distribution Q-Q Plot";
    arcsineScatterOptions.titleTextStyle = titleStyle;
    const mean = distributionStats.mean;
    const std = distributionStats.std;
    const median = distributionStats.median;

    function arrToBins(array) {
        let nBins = 10;
        if (array.length > 100) {
            nBins = 20;
        } else {
            nBins = 10;
        };
        // let min = Math.min(...array);
        // let max = Math.max(...array);
        let max = xMax;

        let inc = (xMax-xMin) / nBins;
        let plotData = [["Range", "nSamples"]];
        let prev = xMin;
        for (let i = 0; i < nBins; i++) {
            let count = 0;
            for (let j = 0; j < array.length; j++){
                if (array[j] > prev && array[j] < prev+inc) {
                    count = count + 1;
                }
            }
            let minBound = Math.round(prev);
            let maxBound = Math.round(prev+inc);
            if (i==0) {
                minBound = xMin;
            }
            if (i==nBins-1){
                maxBound = xMax;
            }
            let bucket = minBound + " - " + maxBound;
            plotData.push([bucket, count]);
            prev = prev + inc;
        }
        return plotData;
    };

    return (
        <div>
            <Chart
                chartType="ColumnChart"
                width="100%"
                height="400px"
                data={arrToBins(samples)}
                options={histOptions}
            />
            <Grid container sx={{ maxWidth: "100%" }}>
                <Grid item xs={true} style={{ height: "400px", display: "flex", justifyContent: "left" }}>
                    <Chart
                        chartType="ScatterChart"
                        width="100%"
                        height="100%"
                        data={makeQQData(samples, generateNormalSamples(samples.length, mean, std))}
                        options={normScatterOptions}
                    />
                </Grid>
                <Grid item xs={true} style={{ height: "400px", display: "flex", justifyContent: "right"}}>
                    <Chart
                        chartType="ScatterChart"
                        width="100%"
                        height="100%"
                        data={makeQQData(samples, generateUniformSamples(samples.length, xMin, xMax))}
                        options={uniformScatterOptions}
                    />
                </Grid>
            </Grid>

            <Grid container sx={{ maxWidth: "100%" }}>
                <Grid item xs={true} style={{ height: "400px", display: "flex", justifyContent: "left" }}>
                    <Chart
                        chartType="ScatterChart"
                        width="100%"
                        height="100%"
                        data={makeQQData(samples, generateLognormalSamples(samples.length, mean, std, xMin, xMax))}
                        options={lognormScatterOptions}
                    />
                </Grid>
                <Grid item xs={true} style={{ height: "400px", display: "flex", justifyContent: "right"}}>
                    <Chart
                        chartType="ScatterChart"
                        width="100%"
                        height="100%"
                        data={makeQQData(samples, generateArcsineSamples(samples.length, xMin, xMax))}
                        options={arcsineScatterOptions}
                    />
                </Grid>
            </Grid>
            
        </div>
    );
}

SampleDashboard.defaultProps = {
    samples: [],
    xMin: 0, 
    xMax: 100, 
};

export default React.memo(SampleDashboard);
