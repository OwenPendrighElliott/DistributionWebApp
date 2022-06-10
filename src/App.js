import './App.css';
import DistributionCanvas from './distributionCanvas.tsx';
import Header from './Header.js';
import { ThemeProvider, createTheme, responsiveFontSizes} from '@mui/material/styles';
import { Typography } from '@mui/material';


import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { VariableSizeList } from 'react-window';


function getCanvasSize(scale) {
    const { innerWidth: width, innerHeight: height } = window;
    const scaledWidth = width-(scale*width);
    return {
        width: Math.round(scaledWidth),
        height: Math.round(scaledWidth*(9/16))
    };
}

// theme for the app - dark of course
const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
    typography: {
        fontFamily: [
          'Source Code Pro',
        ].join(','),
      },
  });


// TESTING IDEA
// function renderRow(props) {
//   const { index, style, values} = props;

//   console.log(style)
//   return (
//     <ListItem style={style} key={index} component="div" disablePadding>
//       <ListItemText primary={`Item ${index + 1}`} />
//     </ListItem>
//   );
// }

// function VirtualizedList() {
//   const values = [1,2,3,4,5,4,3,2,1];
//   return (
//     <Box
//       sx={{ width: '100%', height: 400, maxWidth: 360, bgcolor: 'background.paper' }}
//     >
//       <VariableSizeList
//         height={400}
//         width={360}
//         itemSize={46}
//         itemCount={200}
//         overscanCount={5}
//       >
//         {renderRow}
//       </VariableSizeList>
//     </Box>
//   );
// }

function App() {
    // TODO: add dynamic resizing

    // add padding to the window for the canvas
    const windowDimensions= getCanvasSize(0.3);

    // add responsive font sizes
    const theme = responsiveFontSizes(darkTheme);

    return (
        <div className="App">
        <ThemeProvider  theme={theme}>
            <header className="App-header">
                {/* <VirtualizedList></VirtualizedList> */}
                <Header>
                    pdf.sad
                </Header>
                <br/>
                <div className="CanvasArea">
                    <DistributionCanvas width={windowDimensions.width} 
                                        height={windowDimensions.height}>
                    </DistributionCanvas>
                </div>
            </header>
        </ThemeProvider >
        </div> 
    );
}

export default App;
