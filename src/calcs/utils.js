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

// TODO
function deduplicateVectors(xVector, yVector) {
    x_vector, y_vector = x_vector[::-1], y_vector[::-1]
    i = 0
    while i < len(x_vector) - 1:
        j = i + 1
        while j < len(x_vector) and x_vector[i] == x_vector[j]:
            x_vector = np.delete(x_vector, j)
            y_vector = np.delete(y_vector, j)
        i += 1
    return x_vector[::-1], y_vector[::-1]
}

function interpXYVectors(xVector, yVector) {
    newXVector = nj.add([[...Array(nj.highestElement(xVector) - nj.lowestElement(xVector) + 1).keys()]], nj.lowestElement(xVector));
    newYVector = linterp(newXVector, xVector, yVector)
    return {
            x : new_x_vector,
            y : new_y_vector
           };
}

function normaliseInputYVector(yVector) {
    yVectorZero = nj.subtract([yVector], nj.lowestElement(yVector));
    scaledYVector = nj.divide(yVectorZero, auc(yVectorZero))[0];
    return scaledYVector;
}

function normaliseShiftXVector(xVector, xMin, xMax) {
    let xVectorMin = nj.lowestElement(xVector);
    let xVectorMax = nj.highestElement(xVector);
    return nj.add(nj.multiply(nj.divide(nj.subtract([xVector], xVectorMin), (xVectorMax - xVectorMin)), xMax - xMin), xMin)[0];
}

function prepInputVectors(xCoords, yCoords, xMin, xMax) {
    let xVector = [x_coords]
    let yVector = [y_coords]
    xVector = deduplicateVectors(xVector, yVector).x
    yVector = deduplicateVectors(xVector, yVector).y
    // interpolate
    xVector = interpXYVectors(xVector, yVector).x
    yVector = interpXYVectors(xVector, yVector).y
    // normalise
    yVector = normaliseInputYVector(yVector)
    xVector = normaliseShiftXVector(xVector, xMin, xMax)
    return {
            x: xVector,
            y: yVector
           };
}