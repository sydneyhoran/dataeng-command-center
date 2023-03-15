import React from 'react';
import ListLayout from './ListLayout';


export default class DeltastreamerList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ListLayout {...this.props} for_tab={1}/>
    );
  }
}
