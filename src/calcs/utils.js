var nj = require("jsnumpy")
var linterp = require("everpolate").linear

function auc(yVector) {
    let area = 0;
    let countY = yVector.length;
    for (let i = 0; i < countY-1; i++) {
        area = area + (yVector[i+1] + yVector[i]) / 2 / (countY - 1);
    }
    return area;
}

function deduplicateVectors(xVector, yVector) {
    xVector.reverse();
    yVector.reverse();
    let i = 0;
    while (i < xVector.length - 1) {
        let j = i + 1;
        while (j < xVector.length && xVector[i] == xVector[j]) {
            xVector.splice(j, 1);
            yVector.splice(j, 1);
        }
        i = i + 1;
    }
    return {
            x : xVector.reverse(),
            y : yVector.reverse()
           };
}

function interpXYVectors(xVector, yVector) {
    let newXVector = nj.add([[...Array(nj.highestElement(xVector) - nj.lowestElement(xVector) + 1).keys()]], nj.lowestElement(xVector));
    let newYVector = linterp(newXVector[0], xVector, yVector);
    return {
            x : newXVector,
            y : newYVector
           };
}

function normaliseInputYVector(yVector) {
    let yVectorZero = nj.subtract([yVector], nj.lowestElement(yVector));
    let scaledYVector = nj.divide(yVectorZero, auc(yVectorZero[0]))[0];
    return scaledYVector;
}

function normaliseShiftXVector(xVector, xMin, xMax) {
    let xVectorMin = nj.lowestElement(xVector);
    let xVectorMax = nj.highestElement(xVector);
    return nj.add(nj.multiply(nj.divide(nj.subtract([xVector], xVectorMin), (xVectorMax - xVectorMin)), xMax - xMin), xMin)[0][0];
}

function prepInputVectors(xCoords, yCoords, xMin, xMax) {
    let xVector = xCoords;
    let yVector = yCoords;
    let dedupResult = deduplicateVectors(xVector, yVector);
    xVector = dedupResult.x;
    yVector = dedupResult.y;

    // interpolate
    if (xCoords.length>1) {
        let interpResult = interpXYVectors(xVector, yVector);
        xVector = interpResult.x;
        yVector = interpResult.y;
    }

    // normalise
    yVector = normaliseInputYVector(yVector);
    xVector = normaliseShiftXVector(xVector, xMin, xMax);
    
    return {
            x : xVector,
            y : yVector
           };
}

function roundValueFixed(value, xMin, xMax) {
    let digitsToDisplay = Math.round(-Math.log10(Math.abs(xMax - xMin)) + 4);
    return value.toFixed(Math.max(0, digitsToDisplay))
}

export { prepInputVectors, roundValueFixed };

