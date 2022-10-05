import { getSamples } from './empirical.js'

test('tests getSamples for correct number of samples', () => {
    let xCoords = [1,2,3,4,5,6];
    let yCoords = [1,2,3,3,2,1];
    let xMin = 0;
    let xMax = 100;
    let nSamples = 100;
    let r = getSamples(xCoords, yCoords, xMin, xMax, nSamples);
    expect(r.length).toBe(nSamples);
});