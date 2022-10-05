import { useContext } from "react";

import Typography from '@mui/material/Typography';

import DistributionContext from "../contexts/distributionContext";

const StatsTable = ({width}) => {

    const { distributionStats } = useContext(DistributionContext)
    const mean = distributionStats.mean
    const median = distributionStats.median
    const std = distributionStats.std
    
    return (
        <div>
            <div>
                <Typography variant='h4' style={{'fontFamily': 'Comfortaa'}}>Distribution Statistics</Typography>
            </div>
            <div className="tablediv">
                <table>
                    <tbody>
                        <tr>
                            <th align="center"><Typography>Mean</Typography></th>
                            <th align="center"><Typography>Median</Typography></th>
                            <th align="center"><Typography>Std.</Typography></th> 
                        </tr>
                        <tr>
                            <td align="center"><Typography>{mean}</Typography></td>
                            <td align="center"><Typography>{median}</Typography></td>
                            <td align="center"><Typography>{std}</Typography></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

StatsTable.defaultProps = {
    width: window.innerWidth,
    mean: 0, 
    median: 0, 
    std: 0
};

export default StatsTable;