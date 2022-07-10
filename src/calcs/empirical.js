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
    // TODO: James check this - I think it was just an off by 1 error (I made it countY-1 because you access [i+1])
    // JS does not throw an error when you go out of bounds (how good) and instead returns undefined
    for (let i = 0; i < countY-1; i++) { 
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

let x = [0,1,2,3,4,5,6,7,8,9,10,11,12]
let y = [0,1,1,2,2,4,6.7,4,2,2,1,1,0]
console.log(getMean(x, y))