var nj = require("jsnumpy")
var ev = require("everpolate").linear

const argFact = (compareFn) => (array) => array.map((el, idx) => [el, idx]).reduce(compareFn)[1];

const argMax = argFact((min, el) => (el[0] > min[0] ? el : min));
const argMin = argFact((max, el) => (el[0] < max[0] ? el : max));

function getCDF(yVector) {
    let countY = yVector.length;
    let listArea = nj.fillWithNumber([countY]);
    let cumArea = 0;
    for (let i = 0; i < countY; i++) {
        cumArea = cumArea + (yVector[i+1] + yVector[i]) / 2 / (countY - 1);
        listArea[i+1] = cumArea;
    }
    return nj.divide(listArea, nj.fillWithNumber([countY], cumArea));
}

function getMean(xVector, yVector) {
    let mean = 0;
    let countY = yVector.length;
    for (let i = 0; i < countY; i++) {
        mean = mean + (xVector[i+1] + xVector[i]) / 2 * (yVector[i+1] + yVector[i]) / 2 / (countY - 1);
    }
    return mean; 
}

function getMedian(xVector, cdf) {
    return xVector[argMin(nj.abs(nj.subtract(cdf, nj.fillWithNumber([cdf.length], 0.5))))];
}

function getStdDev(xVector, yVector) {
    return nj.power(0.5, (getMean(nj.power(2, xVector), yVector) - nj.power(2, getMean(xVector, yVector))));
}

function getStats(xVector, yVector) {
    cdf     = getCDF(yVector);
    mean    = getMean(xVector, yVector);
    median  = getMedian(xVector, cdf);
    std     = getStdDev(xVector, yVector);
    return {
            mean    : mean,
            median  : median,
            std     : std
           };
}

function getSamples(xCoords, yCoords, xMin, xMax, nSamples) {
    xVector, yVector = prep_input_vectors(xCoords, yCoords, xMin, xMax);
    cdf = getCDF(yVector);
    unifSamples = Array.from({length: nSamples}, () => Math.random());
    samples = ev.linear(unifSamples, cdf, xVector);
    return samples;
}