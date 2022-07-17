import { prepInputVectors, roundValueFixed } from "./utils"

var nj = require("jsnumpy")
var linterp = require("everpolate").linear

// https://gist.github.com/janosh/099bd8061f15e3fbfcc19be0e6b670b9
const argFact = (compareFn) => (array) => array.map((el, idx) => [el, idx]).reduce(compareFn)[1];
const argMin = argFact((max, el) => (el[0] < max[0] ? el : max));

function getCDF(yVector) {
    let countY = yVector.length;
    let listArea = nj.fillWithNumber([countY]);
    listArea[0] = 0;
    let cumArea = 0;
    for (let i = 0; i < countY-1; i++) {
        cumArea = cumArea + (yVector[i+1] + yVector[i]) / 2 / (countY - 1);
        listArea[i+1] = cumArea;
    }
    return nj.divide([listArea], cumArea)[0];
}

function getMean(xVector, yVector) {
    let mean = 0;
    let countY = yVector.length;
    for (let i = 0; i < countY-1; i++) { 
        mean = mean + (xVector[i+1] + xVector[i]) / 2 * (yVector[i+1] + yVector[i]) / 2 / (countY - 1);
    }
    return mean; 
}

function getMedian(xVector, cdf) {
    return xVector[argMin(nj.abs(nj.subtract([cdf], 0.5))[0])];
}

function getStdDev(xVector, yVector) {
    return (getMean(nj.power(xVector, 2), yVector) - getMean(xVector, yVector) ** 2) ** 0.5;
}

function getStats(xCoords, yCoords, xMin, xMax) {
    let xVector = prepInputVectors(xCoords, yCoords, xMin, xMax).x;
    let yVector = prepInputVectors(xCoords, yCoords, xMin, xMax).y;

    let cdf    = getCDF(yVector);
    
    let mean   = getMean(xVector, yVector);
    let median = getMedian(xVector, cdf);
    let std    = getStdDev(xVector, yVector);

    return {
            mean   : roundValueFixed(mean, xMin, xMax, 5),
            median : roundValueFixed(median, xMin, xMax, 5),
            std    : roundValueFixed(std, xMin, xMax, 5)
           };
}

function getSamples(xCoords, yCoords, xMin, xMax, nSamples) {
    if (xCoords.length <=1 ) {
        return [];
    }
    let xVector = prepInputVectors(xCoords, yCoords, xMin, xMax).x;
    let yVector = prepInputVectors(xCoords, yCoords, xMin, xMax).y;
    let cdf = getCDF(yVector);
    let unifSamples = Array.from({length: nSamples}, () => Math.random());

    let samples = linterp(unifSamples, cdf, xVector);
    for (let i = 0; i < samples.length; i++) {
        samples[i] = roundValueFixed(samples[i], xMin, xMax, 5);
    }
    return samples;
}

export { getStats, getSamples }