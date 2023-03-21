import React from 'react';
import TableFormLayout from './TableFormLayout';


export default class TableForm extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TableFormLayout {...this.props} is_topic={true}/>
    );
  }
}
