import React from 'react';
import PropTypes from 'prop-types';

import * as utils from '../lib/utils';

import JobForm from './JobForm';

export default class JobEditor extends React.Component {
    constructor(props) {
        console.log("In constructor for JobEditor");
        super(props);
        this.state = {
            job: {},
            unassigned_topics: []
        };
        this.publishJob = this.publishJob.bind(this);
    }

    componentDidMount() {
        const { match: { params }, job, unassigned_topics, setAppState, triggerAlert } = this.props;
//        console.log("On edit job page before checking if passed job_id. Params are:");
//        console.log(params);
        setAppState({ loading: true });
        if (params.job_id) {
            console.log("On edit job page with passing job_id " + params.job_id)
            setAppState({ loading: true });
            utils.getRequest(
                `deltastreamer_jobs/${params.job_id}`,
                (found_job) => {
                    console.log("Found job in getRequest " + JSON.stringify(found_job));
                    setAppState({ loading: false });
                    this.setState({ job: found_job });
                },
                (resp) => {
                    triggerAlert(`Could not get the requested job - ${resp.response.data.response.error}`);
                    console.log(`Could not get the requested job - ${resp.response.data.response.error}`);
                },
            );
        }
        utils.getRequest(
            'unassigned_topics',
            (u_topics) => {
                setAppState({ loading: false });
                this.setState({ unassigned_topics: u_topics });
            },
            (resp) => {
                triggerAlert(`Error loading topics - ${resp.response.data.response.error}`);
                console.log(`Could not load the topics - ${resp.response.data.response.error}`);
            },
        );
    }

    publishJob(job) {
        const {
            history,
            setAppState,
            triggerAlert,
        } = this.props;
        setAppState({ loading: true });
        // TODO change to 'deltastreamer_jobs' (for new) or 'deltastreamer_jobs/:job_id' (for edit)
        const route =  (params.job_id ? 'deltastreamer_jobs/${params.job_id}' : 'models')
        utils.postRequest(
            route,
            job,
            (new_job) => {
                setAppState({ loading: false });
                if (route === 'deltastreamer_jobs') history.push('/');
                history.push('/temp');
                history.goBack();
            },
            (resp) => {
                setAppState({ loading: false });
                console.log(`Error publishing job - ${resp.response.data.response.error}`);
                triggerAlert(`Error publishing job - ${resp.response.data.response.error}`);
            },
        );
    }

    render() {
        console.log("In JobEditor render(), Props are " + this.props);
        console.log("In JobEditor render(), State is " + this.state);
        const {
            triggerAlert,
        } = this.props;
        if (this.state.job != {}) {
            const { job, unassigned_topics } = this.state;
            console.log("Job is " + JSON.stringify(job));
            const selection = job;
            console.log("Selection is " + JSON.stringify(selection));
            console.log("unassigned_topics is " + unassigned_topics);
            return (
            <JobForm
                {...this.props}
                job={selection}
                unassigned_topics={unassigned_topics}
                onSubmit={this.publishJob}
                triggerAlert={triggerAlert}
            />
            )
        } else {
            return ( <p> loading </p> )
        }

    }
}

JobEditor.defaultProps = {
//    job: {},
    setAppState: () => {},
    triggerAlert: () => {},
};

JobEditor.propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
//    models: PropTypes.object,
    setAppState: PropTypes.func,
    triggerAlert: PropTypes.func,
};
