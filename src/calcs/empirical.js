const { median } = require("jsnumpy");
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

// TODO: FIX
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
    return (getMean(nj.power(2, xVector), yVector) - getMean(xVector, yVector) ** 2) ** 0.5;
}

function getStats(xVector, yVector) {
    let cdf    = getCDF(yVector);
    let mean   = getMean(xVector, yVector);
    let median = getMedian(xVector, cdf);
    let std    = getStdDev(xVector, yVector);
    return {
            mean   : mean,
            median : median,
            std    : std
           };
}

function getSamples(xCoords, yCoords, xMin, xMax, nSamples) {
    let xVector = prep_input_vectors(xCoords, yCoords, xMin, xMax).x
    let yVector = prep_input_vectors(xCoords, yCoords, xMin, xMax).y;
    let cdf = getCDF(yVector);
    let unifSamples = Array.from({length: nSamples}, () => Math.random());
    let samples = linterp(unifSamples, cdf, xVector);
    return samples;
}

export {getStats, getSamples}