import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import categoriesHelper from '../../Helpers/Categories';
import Select from 'material-ui/Select';

const styles = {
  filterLabelWrapper: {
    padding: '10px 8px',
  },
  facesFilterButton: {
    margin: '0 10px',
    '&.selected': {
      backgroundColor: '#07f'
    }
  },

}

class SplashFilters extends React.Component {

  handleSetNumFacesFilter(numFaces) {
    this.props.handleNumFacesFilterUpdate(numFaces);
  }

  handleSetCategoryFilter(evt) {
    this.props.handleCategoryFilterUpdate(evt.target.value);
  }

  render() {
    const {
      maxFaces,
      classes,
      currentFilterNumFaces,
      availableCategories,
      currentFilterCategory,
    } = this.props;

    return (
      <Grid container spacing={16}>
        <Grid item xs={6}>
          <span className={classes.filterLabelWrapper}># Faces</span>
          {Array.from(Array(maxFaces).keys()).map(idx => {
            let buttonClass = classes.facesFilterButton;
            if (currentFilterNumFaces === (idx+1)) {
              buttonClass += ' selected';
            }
            return (
            <Button 
              fab 
              mini
              key={idx} 
              className={buttonClass} 
              onClick={this.handleSetNumFacesFilter.bind(this, idx+1)}
            >
              {idx+1}
            </Button>
            )
          })}
        </Grid>
        <Grid item xs={6}>
          <span className={this.props.classes.filterLabelWrapper}>
            Category
          </span>
          <Select 
          value={currentFilterCategory} 
          displayEmpty
          autoWidth={true}
          onChange={this.handleSetCategoryFilter.bind(this)}
          >
            <option value="">All</option>
            {availableCategories.map(categoryKey => {
              return <option key={categoryKey} value={categoryKey}>{categoriesHelper.getLabelByKey(categoryKey)}</option>
            })}
          </Select>
        </Grid>
      </Grid>
    )
  }
}

SplashFilters.propTypes = {
  handleNumFacesFilterUpdate: PropTypes.func.isRequired,
  handleCategoryFilterUpdate: PropTypes.func.isRequired,
  maxFaces: PropTypes.number.isRequired,
  currentFilterNumFaces: PropTypes.number,
  currentFilterCategory: PropTypes.string,
  availableCategories: PropTypes.array.isRequired,
}

export default withStyles(styles)(SplashFilters)
