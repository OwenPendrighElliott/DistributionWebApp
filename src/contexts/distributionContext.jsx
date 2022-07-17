import React, { useState } from 'react'


const DistributionContext = React.createContext({

    xMin: 0,
    setXMin: () => {},
    xMax: 100,
    setXMax: () => {},

    distributionStats: {},
    setDistributionStats: () => {},

    xCoordinates: [],
    storeXCoordinates: () => {},

    yCoordinates: [],
    storeYCoordinates: () => {},

    nSamples: 100,
    setNSamples: () => {},

    samplePoints: [],
    setSamplePoints: () => {},
})

const DistributionContextProvider = ({ children }) => {
    const [xMin, setXMin] = useState(0);
    const [xMax, setXMax] = useState(100);

    const [distributionStats, setDistributionStats] = useState({mean: "0", median: "0", std: "0"});

    const [xCoordinates, storeXCoordinates] = useState([]);
    const [yCoordinates, storeYCoordinates] = useState([]);

    const [nSamples, setNSamples] = useState(200);

    const [samplePoints, setSamplePoints] = useState([])

    return (
        <DistributionContext.Provider value={{
            xMin, xMax, distributionStats, xCoordinates, yCoordinates, nSamples, samplePoints,
            setXMin, setXMax, setDistributionStats, storeXCoordinates, storeYCoordinates, setNSamples, setSamplePoints
        }}>
            {children}
        </DistributionContext.Provider>
    )
}


export default DistributionContext;
export { DistributionContextProvider };