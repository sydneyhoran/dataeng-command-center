// App.jsx
import React from 'react';

import { Route } from 'react-router-dom';

import IndexTabs from './IndexTabs';
import TopicEditor from './TopicEditor';
import LoadingModal from './LoadingModal';
import ModalContainer from './ModalContainer';

export default class App extends React.Component {
  constructor() {
    console.log("in constructor")
    super();

    this.state = {
        deltastreamerJobs: [],
        loading: false,
    };

    this.setAppState = this.setAppState.bind(this);
  }

  setAppState(state) {
    console.log("in setAppState applying state:")
    console.log(state)
    this.setState(state);
  }

  render() {
    const {
      deltastreamerJobs,
      loading
    } = this.state;

    const app_defaults = {
      setAppState: this.setAppState,
      deltastreamerJobs
    };

    return (

        <div class="container py-3 px-0 my-3 mx-auto bg-metal rounded w-100">
                <div class="mx-4">
                    <p>
                        Welcome to the Streaming Command Center!
                    </p>
                </div>
                { loading ? <ModalContainer><LoadingModal /></ModalContainer> : null}
                <Route
                  exact
                  path="/"
                  render={props => <IndexTabs {...props} {...app_defaults} />}
                />
                <Route
                  exact
                  path="/edit/ingestion_topic"
                  render={props => <TopicEditor {...props} {...app_defaults} />}
                />
                <Route
                  path="/edit/ingestion_topic/:db/:schema/:table_name"
                  render={props => <TopicEditor {...props} {...app_defaults} />}
                />
        </div>
    );
  }
}