import React, { Component } from 'react';

import { Fade, FormControl, IconButton, Menu, MenuItem } from '@mui/material';
import { withStyles } from '@mui/styles';

const styles = (theme) => ({
  menuItem: {
    
    paddingTop: '3px',
    
  },
  iconButton: {
    fontSize: '20px',
    '&:hover': {
      borderRadius: '5px',
    },
  }
});

class TableDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
    };
  }

  handleClick = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { menuItems, classes } = this.props;
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);

    return (
      <div>
        <FormControl >
          <IconButton className={classes.iconButton} onClick={this.handleClick}>
            <i className="las la-bars"></i>
            <i style={{ fontSize: '14px', padding: '4px' }} className="fa fa-caret-down fa-sm" aria-hidden="true"></i>
          </IconButton>
          <Menu
            className={classes.menusItem}
            anchorEl={anchorEl}
            open={open}
            onClose={this.handleClose}
            onBlur={this.handleClose}
            TransitionComponent={Fade}
            disableScrollLock={true}
          >
            {menuItems.map((menuItem, index) => (
              <MenuItem className={classes.menuItem} key={index}>{menuItem}</MenuItem>
            ))}
          </Menu>
        </FormControl>
      </div>
    );
  }
}

export default withStyles(styles)(TableDropdown);;