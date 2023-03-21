import React from 'react';
import EditorLayout from './EditorLayout';


export default class TopicEditor extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <EditorLayout {...this.props} for_page={1}/>
    );
  }
}
