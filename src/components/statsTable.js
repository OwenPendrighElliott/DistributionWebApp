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
                <br/> 
                <Typography variant='h4'>Distribution Statistics</Typography>
            </div>
            <div className="tablediv">
                {/* <TableContainer sx={{maxWidth: width}} component={Paper}> */}
                <TableContainer sx={{minWidth: 300, maxWidth: width/2, alignItems: "left"}} component={Paper}>
                    <Table aria-label="results table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Mean</TableCell>
                                <TableCell align="center">Median</TableCell>
                                <TableCell align="center">Std.</TableCell> 
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell align="center">{mean}</TableCell>
                                <TableCell align="center">{median}</TableCell>
                                <TableCell align="center">{std}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
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