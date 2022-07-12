import { Chart } from "react-google-charts";



const SampleDashboard = ({samples, xMin, xMax}) => {
    const options = {
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


    function arrToBins(array) {
        let nBins = 10;
        if (array.length > 100) {
            nBins = 20;
        } else {
            nBins = 10;
        };
        // let min = Math.min(...array);
        // let max = Math.max(...array);

        let min = xMin;
        let max = xMax;

        let inc = (max-min) / nBins;
        let plotData = [["Range", "nSamples"]];
        let prev = min;
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
        <Chart
            chartType="ColumnChart"
            width="100%"
            height="400px"
            data={arrToBins(samples)}
            options={options}
        />
    );
}

SampleDashboard.defaultProps = {
    samples: [],
    xMin: 0, 
    xMax: 100, 
};

export default SampleDashboard;
