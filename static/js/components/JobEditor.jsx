import React from 'react';
import PropTypes from 'prop-types';

import * as utils from '../lib/utils';

import JobForm from './JobForm';

export default class JobEditor extends React.Component {
    constructor(props) {
        super(props);
        this.publishJob = this.publishJob.bind(this);
    }

    componentDidMount() {
        const { setAppState, triggerAlert } = this.props;
    }

    publishJob(job) {
        const {
            history,
            setAppState,
            triggerAlert,
        } = this.props;
        setAppState({ loading: true });
        // TODO change to 'deltastreamer_jobs' (for new) or 'deltastreamer_jobs/:job_name' (for edit)
        const route = 'deltastreamer_jobs';
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
        const selection = ({} || {});
        const {
            triggerAlert,
        } = this.props;
        return (
            <JobForm
                {...this.props}
                job={selection || {}}
                onSubmit={this.publishJob}
                triggerAlert={triggerAlert}
            />
        )
    }
}

JobEditor.defaultProps = {
    setAppState: () => {},
    triggerAlert: () => {},
};

JobEditor.propTypes = {
    history: PropTypes.object.isRequired,
    setAppState: PropTypes.func,
    triggerAlert: PropTypes.func,
};
