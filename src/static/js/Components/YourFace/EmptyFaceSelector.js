import React from 'react';
import PropTypes from 'prop-types';
import Select from 'material-ui/Select';


class EmptyFaceSelector extends React.Component {
  handleChange(evt) {
    if (typeof this.props.onChange === 'function') {
      let label = evt.target.value;
      let foundEmptyFace = false;
      this.props.emptyFaces.forEach(emptyFace => {
        if (label === emptyFace.label) {
          foundEmptyFace = emptyFace;
        }
      });
      this.props.onChange(this.props.userFace, foundEmptyFace)
    }
  }

  render() {
    const {selectedLabel, emptyFaces, emptyValue} = this.props
    return (
      <div>
        <Select 
        autoWidth={true}
        native 
        value={selectedLabel || emptyValue}
        onChange={this.handleChange.bind(this)}
        >
          <option value={emptyValue}>None</option>
          {emptyFaces.map(emptyFace => {
            return <option key={emptyFace.label} value={emptyFace.label}>{emptyFace.label}</option>
          })}
        </Select>
      </div>
    );
  }
}

EmptyFaceSelector.propTypes = {
  onChange: PropTypes.func,
  selectedLabel: PropTypes.string.isRequired,
  emptyFaces: PropTypes.array.isRequired,
  emptyValue: PropTypes.string.isRequired,
}
export default EmptyFaceSelector
