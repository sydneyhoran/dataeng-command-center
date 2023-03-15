import React from 'react';
import PropTypes from 'prop-types';

import '../../css/TabSelector.css';

export default class TabSelector extends React.Component {
  renderOptions(options, selected, onChange) {
    return options.map((option) => {
      let class_name = 'nav-link tab-button';
      let on_click = () => onChange(option);

      if (option === selected) {
        class_name += ' tab-button-selected';
        on_click = () => {};
      }

      return (
        <a
          key={option}
          className={class_name}
          onClick={on_click}
          href={`#${option}`}
        >
          {option}
        </a>
      );
    });
  }

  render() {
    const { options, selected, onChange } = this.props;

    return (
      <nav className="navbar navbar-expand tab-selector">
        { this.renderOptions(options, selected, onChange) }
      </nav>
    );
  }
}

TabSelector.defaultProps = {
  options: [],
  selected: '',
  onChange: () => {},
};

TabSelector.propTypes = {
  options: PropTypes.array,
  selected: PropTypes.string,
  onChange: PropTypes.func,
};
