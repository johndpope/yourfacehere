import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import Card, { CardActions, CardMedia, CardHeader } from 'material-ui/Card';
import Button from 'material-ui/Button';
import categoryHelper from '../../Helpers/Categories';

const styles = {
  thumbnail: {
    height: '150px',
    backgroundPosition: 'center 20%'
  },
  wrapper: {
    height: '275px',    
  },
  title: {
    fontSize: '1rem'
  }
};

class SplashItem extends React.Component {

  constructor(props) {
    super(props);
    this.selectItem = this.selectItem.bind(this)
  }
  selectItem(item) {
    this.props.onSelect(this.props.splash)
  }
  render() {
    const {classes, splash} = this.props;
    return (
      <Card className={classes.wrapper}>
        <CardHeader
          title={splash.label}
          subheader={categoryHelper.getLabelByKey(splash.category_key)}
          classes={
            {
              title: classes.title
            }
          }
        />
        <CardMedia
          image={splash.url}
          className={classes.thumbnail}
        />
        <CardActions>
          <Button dense color="primary" onClick={this.selectItem}>Select</Button>
        </CardActions>
      </Card>
    )
  }
}

SplashItem.propTypes = {
  splash: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired
}

export default withStyles(styles)(SplashItem);
