import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';
import Select from 'react-select';

//import DeleteButton from './DeleteButton';

import * as utils from '../lib/utils';

export default class ListLayout extends React.Component {
    constructor(props) {
        super(props);
        const { for_tab } = this.props;
        this.state = {
            filter: "",
            displayed_jobs: [],
            filter_options: []
        };
        this.getFilterOptions = this.getFilterOptions.bind(this);
        this.getFilterOptions = this.handleFilterChange.bind(this);
    }

    componentDidMount() {
        const { setAppState, triggerAlert, for_tab } = this.props;
        setAppState({ loading: true });
        if (for_tab === 1) {
            const {
                deltastreamerJobs,
//                ingestionTopics
            } = this.props;
            utils.getRequest(
                'deltastreamer_jobs',
                (jobs) => {
                    setAppState({ loading: false });
                    setAppState({ deltastreamerJobs: jobs });

                    this.getFilterOptions(jobs);
                },
                (resp) => {
                    triggerAlert(`Error loading jobs - ${resp.response.data.response.error}`);
                    console.log(`Could not load the jobs - ${resp.response.data.response.error}`);
                },
            );
       }
    }

    getFilterOptions(jobs) {
        console.log("In getFilterOptions, jobs are " + JSON.stringify(jobs));
    }

    handleFilterChange(e) {
        console.log("In handleFilterChange, target is " + JSON.stringify(e));
    }

    renderTopicCard(topic) {
        return(
            <div className="card topic-card card-rounded p-2 m-1">
              <div className="card-title container">
                <div className="row">
                    <div classNAme="col-11">
                        <strong>Topic:</strong> {topic.topic_name}
                    </div>
                    <div className="col-1">
                        <div className="custom-control custom-switch">
                            <input
                                type="checkbox"
                                className="custom-control-input"
                                id={`${topic.topic_name}_switch`}
                                checked={topic.is_active}
                                disabled />
                            <label class="custom-control-label" for={`${topic.topic_name}_switch`}></label>
                        </div>
                    </div>
                </div>
              </div>
              <div className="card-body m-1 p-1">
                <table className="w-100">
                    <thead>
                        <tr role="row" className="code">
                            <th ref={React.createRef()} width="30%">source_ordering_field</th>
                            <th ref={React.createRef()} width="30%">partition_path_field</th>
                            <th ref={React.createRef()} width="20%">record_key</th>
                            <th ref={React.createRef()} width="20%">table_size</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr role="row" className="code">
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
            <div className="card job-card p-2 m-5">
              <div className="card-title m-1 position-relative">
                <strong>{job.job_name}</strong>
                <Link to={job.id != 1 ? `/edit/deltastreamer_job/${job.id}` : '#'}><i className="fas fa-pen"></i></Link>
              </div>
              <div className="card-body m-1 p-1">
                <table className="w-100">
                    <thead>
                        <tr role="row" className="code">
                            <th ref={React.createRef()} width="50%">Job Size</th>
                            <th ref={React.createRef()} width="50%">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr role="row" className="code">
                            <td>{job.job_size}</td>
                            <td>
                                <div class="custom-control custom-switch">
                                  <input
                                    type="checkbox"
                                    class="custom-control-input"
                                    id={`${job.job_name}_switch`}
                                    checked={job.has_active_topics}
                                    disabled />
                                  <label class="custom-control-label" for={`${job.job_name}_switch`}></label>
                                </div>
                            </td>
                        </tr>
                        <tr role="row" className="code">
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
        if (for_tab === 1) {
            const {
                deltastreamerJobs,
                ingestionTopics
            } = this.props;
            const {
                filter_options,
            } = this.state;
            return (
                <div>
                    <div className="row w-100">
                        <div className="col-lg-11">
                            <h1>Current Deltastreamer Jobs</h1>
                        </div>
                    </div>
                    { filter_options &&
                    <div className="row w-100">
                          <Select
                            placeholder="filter"
                            name="filter"
                            value={{ label: "Filter By Source DB" , value: "filter" }}
                            onChange={this.handleFilterChange}
                            options={['identity', 'payments', 'vegas', 'edgebook_ca_on']}
                          />
                    </div>
                    }
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
    triggerAlert: () => {},
    setAppState: () => {},
};

ListLayout.propTypes = {
    deltastreamerJobs: PropTypes.array,
    setAppState: PropTypes.func,
    triggerAlert: PropTypes.func,
    history: PropTypes.object.isRequired,
};
