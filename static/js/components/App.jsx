// App.jsx
import React from 'react';

import { Route } from 'react-router-dom';

import AlertDialog from './AlertDialog';
import IndexTabs from './IndexTabs';
import JobEditor from './JobEditor';
import TopicEditor from './TopicEditor';
import LoadingModal from './LoadingModal';
import ModalContainer from './ModalContainer';

import * as utils from '../lib/utils';

export default class App extends React.Component {
  constructor() {
    super();

    this.state = {
        alerts: [],
        deltastreamerJobs: [],
//        unassigned_topics: [],
//        job: {},
        loading: false,
    };

    this.setAppState = this.setAppState.bind(this);
    this.triggerAlert = this.triggerAlert.bind(this);
    this.closeAlert = this.closeAlert.bind(this);
    this.renderAlerts = this.renderAlerts.bind(this);
  }

  setAppState(state) {
    console.log("in setAppState in App.jsx")
    this.setState(state);
  }

  renderAlerts(alerts) {
    return alerts.map(alert => (
      <AlertDialog
        errorText={alert.text}
        id={alert.id}
        onClose={this.closeAlert}
        key={alert.id}
      />
    ));
  }

  triggerAlert(msg = 'Error') {
    const { alerts } = this.state;

    const alert = {
      text: msg,
      id: utils.generateID(),
    };

    this.setState({ alerts: alerts.concat([alert]) });
  }

  closeAlert(id) {
    const { alerts } = this.state;
    const updated_alerts = [];

    alerts.forEach((alert) => {
      if (alert.id !== id) updated_alerts.push(alert);
    });

    this.setState({ alerts: updated_alerts });
  }

  render() {
    const {
      deltastreamerJobs,
//      unassigned_topics,
//      job,
      loading,
      alerts
    } = this.state;

    const app_defaults = {
      setAppState: this.setAppState,
      triggerAlert: this.triggerAlert,
      deltastreamerJobs,
//      unassigned_topics,
//      job
    };

    return (

        <div className="container py-3 px-0 my-3 mx-auto bg-metal rounded w-100">
                <div className="mx-4">
                    <p>
                        Welcome to the Streaming Command Center!
                    </p>
                </div>
                { loading ? <ModalContainer><LoadingModal /></ModalContainer> : null}
                { alerts ? this.renderAlerts(alerts) : null }
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
                  exact
                  path="/edit/deltastreamer_job"
                  render={props => <JobEditor {...props} {...app_defaults} />}
                />
                <Route
                  path="/edit/ingestion_topic/:topic_id"
                  render={props => <TopicEditor {...props} {...app_defaults} />}
                />
                <Route
                  path="/edit/deltastreamer_job/:job_id"
                  render={props => <JobEditor {...props} {...app_defaults} />}
                />
        </div>
    );
  }
}

