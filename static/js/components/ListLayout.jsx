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
            const {
                deltastreamerJobs,
//                ingestionTopics
            } = this.props;
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
        // TODO render create new form
        console.log("Add new button was pressed")
    }

    renderTopicCard(topic) {
        return(
            <div class="card topic-card card-rounded p-2 m-1">
              <div class="card-title">
                <strong>Topic:</strong> {topic.topic_name}
              </div>
              <div class="card-body m-1 p-1">
                <table class="w-100">
                    <thead>
                        <tr role="row" class="code">
                            <th ref={React.createRef()} width="30%">source_ordering_field</th>
                            <th ref={React.createRef()} width="30%">partition_path_field</th>
                            <th ref={React.createRef()} width="20%">record_key</th>
                            <th ref={React.createRef()} width="20%">table_size</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr role="row" class="code">
                            <td>{topic.source_ordering_field}</td>
                            <td>{topic.record_key}</td>
                            <td>{topic.partition_path_field}</td>
                            <td>{topic.table_size}</td>
                        </tr>
                    </tbody>
                </table>
              </div>
            </div>
        )
    }

    renderJobCard(job) {
        return(
            <div class="card job-card p-2 m-5">
              <div class="card-title m-1">
                <strong>{job.job_name}</strong>
              </div>
              <div class="card-body m-1 p-1">
                <table class="w-100">
                    <thead>
                        <tr role="row" class="code">
                            <th ref={React.createRef()} width="50%">Job Size</th>
                            <th ref={React.createRef()} width="50%">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr role="row" class="code">
                            <td>{job.job_size}</td>
                            <td>{job.test_phase}</td>
                        </tr>
                        <tr role="row" class="code">
                            <td colspan="2">{job.ingestion_topics.map(topic => this.renderTopicCard(topic))}</td>
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
            const {
                deltastreamerJobs,
                ingestionTopics
            } = this.props;
            console.log("in render list")
            console.log("Deltastreamer jobs" + deltastreamerJobs)
//            console.log("Ingestion topics" + ingestionTopics)
            deltastreamerJobs.forEach((job) => {
                console.log(job.job_name)
                console.log(job.ingestion_topics)
            });
//            ingestionTopics.forEach((topic) => {
//                console.log(topic.formatted_dict().topic_name)
//            });
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
//    ingestionTopics: [],
};

ListLayout.propTypes = {
    deltastreamerJobs: PropTypes.array,
//    ingestionTopics: [],
};