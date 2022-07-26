import { useContext } from "react";

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
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
                <Typography variant='h4'>Distribution Statistics</Typography>
            </div>
            <div className="tablediv">
                {/* <TableContainer sx={{maxWidth: width}} component={Paper}> */}
                <table>
                    <tr>
                        {/* <th align="center">Mean</th>
                        <th align="center">Median</th>
                        <th align="center">Std.</th>  */}
                        <th align="center"><Typography>Mean</Typography></th>
                        <th align="center"><Typography>Median</Typography></th>
                        <th align="center"><Typography>Std.</Typography></th> 
                    </tr>
                    <tr>
                        {/* <td align="center">{mean}</td>
                        <td align="center">{median}</td>
                        <td align="center">{std}</td> */}
                        <td align="center"><Typography>{mean}</Typography></td>
                        <td align="center"><Typography>{median}</Typography></td>
                        <td align="center"><Typography>{std}</Typography></td>
                    </tr>
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