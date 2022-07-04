import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import MoreIcon from '@mui/icons-material/MoreVert';
import { Typography } from '@mui/material';

const pages = [];
const settings = [["Owen's Github", 'https://github.com/OwenPendrighElliott'], 
                  ["James' Github", 'https://github.com/jameslindesay'], 
                //   ['Thing3', 'https://www.google.com']
                ];

const ResponsiveAppBar = () => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static">
        <Container maxWidth="xl">
            <Toolbar>
                <div>d r a w d i s t . a p p</div>
                <Box sx={{ flexGrow: 0, marginLeft: "auto"}}>
                    <Tooltip title="Other Interesting Things">
                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                            <MoreIcon/>
                        </IconButton>
                    </Tooltip>
                    <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                    >
                    {settings.map((setting) => (
                        <MenuItem key={setting[0]} onClick={handleCloseUserMenu}>
                            <Link rel="noopener noreferrer" href={setting[1]} target="_blank" underline="none">
                                {setting[0]}
                            </Link>
                        </MenuItem>
                    ))}
                    </Menu>
                </Box>
            </Toolbar>
        </Container>
    </AppBar>
  );
};
export default ResponsiveAppBar;
