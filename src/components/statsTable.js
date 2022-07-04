import Paper from '@mui/material/Paper';
import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

const StatsTable = ({width, mean, median, std}) => {
    return (
        <div>
            <div>
                <br/> 
                <Typography variant='h4'>Distribution Statistics</Typography>
            </div>
            <div className="tablediv">
                <TableContainer sx={{maxWidth: width}} component={Paper}>
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