// App.jsx
import React from 'react';

import { Route } from 'react-router-dom';

import IndexTabs from './IndexTabs';

export default class App extends React.Component {
  constructor() {
    console.log("in constructor")
    super();

    this.state = {
        deltastreamerJobs: [],
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
      deltastreamerJobs
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
                <Route
                  exact
                  path="/"
                  render={props => <IndexTabs {...props} {...app_defaults} />}
                />
        </div>
    );
  }
}