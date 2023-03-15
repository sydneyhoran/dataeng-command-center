import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';

import * as utils from '../lib/utils';

export default class ListLayout extends React.Component {
    constructor(props) {
        super(props);
        const { for_tab } = this.props;

        if (for_tab === 2) {
            this.state = {
                template_counts: {},
            };
        }

        this.onAddClicked = this.onAddClicked.bind(this);
    }

    componentDidMount() {
        const { setAppState, for_tab } = this.props;
        if (for_tab === 1) {
            const { deltastreamerJobs } = this.props;
            console.log("in ListLayout about to getRequest deltastreamerJobs")
            utils.getRequest(
                'deltastreamer_jobs',
                jobs => setAppState({deltastreamerJobs: jobs}),
                (resp) => {
                    console.log(`Could not load the jobs - ${resp.response.data.response.error}`);
                },
            );
            console.log("Got deltastreamerJobs")
            console.log(deltastreamerJobs)
       }
    }

    onAddClicked() {
        console.log("Add new button was pressed")
    }

    renderJobCard(job) {
        return(
            <div class="card job-card p-2 m-5">
              <div class="card-title m-0">
                {job.job_name}
              </div>
              <div class="card-body m-1 p-1">
                <table class="w-100">
                    <thead>
                        <tr role="row" class="code">
                            <th ref={React.createRef()} width="30%">source_ordering_field</th>
                            <th ref={React.createRef()} width="30%">record_key</th>
                            <th ref={React.createRef()} width="30%">partition_path_field</th>
                            <th ref={React.createRef()} width="10%">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr role="row" class="code">
                            <td>{job.source_ordering_field}</td>
                            <td>{job.record_key}</td>
                            <td>{job.partition_path_field}</td>
                            <td>{job.test_phase}</td>
                        </tr>
                    </tbody>
                </table>
              </div>
            </div>
        )
    }

    render() {
        const { for_tab } = this.props;
        console.log("in render ListLayout")
        if (for_tab === 1) {
            console.log("for_tab === 1")
            const { deltastreamerJobs } = this.props;
            console.log("in render deltastreamerJobs")
            console.log(deltastreamerJobs)
            deltastreamerJobs.forEach((job) => {
                console.log(job.job_name)
            });
            return (
                <div>
                    <div class="row w-100">
                        <div class="col-lg-11">
                            <h1>Current Deltastreamer Jobs</h1>
                        </div>
                        <div class="col-lg-1 my-auto">
                            <button type="button" class="btn btn-success" onClick={this.onAddClicked}>Add New</button>
                        </div>
                    </div>
                    {deltastreamerJobs.map(job => this.renderJobCard(job))}
                </div>
            );
        } else if (for_tab === 2) {
            return (
                <div>
                    <p>Hello world I am tab 2</p>
                </div>
            );
        } else {
            return (
                <div>
                    <p>Hello world I am tab 3</p>
                </div>
            );
        }
    }
}

ListLayout.defaultProps = {
    deltastreamerJobs: [],
};

ListLayout.propTypes = {
    deltastreamerJobs: PropTypes.array,
};