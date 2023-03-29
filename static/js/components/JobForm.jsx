import React from 'react';
import PropTypes from 'prop-types';
import Button from './Button';

import * as utils from '../lib/utils';


export default class JobForm extends React.Component {
    constructor(props) {
        super(props);
        const { job } = props;
        this.state = {
            current: this.formatJobProps(job),
            initial: this.formatJobProps(job),
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleTopicSelectionChange = this.handleTopicSelectionChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const { job } = nextProps;
        const formatted_props = this.formatJobProps(job);
        this.setState({ current: formatted_props, initial: formatted_props });
    }

    componentDidMount() {
        const {
            unassigned_topics,
            setAppState,
        } = this.props;
        setAppState({ loading: true });
        utils.getRequest(
            'unassigned_topics',
            (u_topics) => {
                setAppState({ loading: false, unassigned_topics: u_topics });
            },
            (resp) => {
                triggerAlert(`Error loading topics - ${resp.response.data.response.error}`);
                console.log(`Could not load the topics - ${resp.response.data.response.error}`);
            },
        );
    }

    formatJobProps(job) {
        return {
            job_name: job.job_name || 'deltastreamer_',
            topic_list: job.topic_list || [],
            job_size: job.job_size || 'xs',
            test_phase: job.test_phase || 'initial',
            updated_by: job.updated_by || ''
        }
    }

    handleSubmit(e) {
        const { onSubmit } = this.props;
        const { current } = this.state;
        const job = Object.assign({}, current);
//        const keys = [
//            'job_name',
//            'job_size',
//            'test_phase',
//            'updated_by',
//        ]
//        keys.forEach((key) => {
//            job[key] = job[key].map(elem => elem.value);
//        });
        this.setState({ current: {} });
        onSubmit(job);
        e.preventDefault();
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

    renderTopicRow(topic) {
        return (
            <tr role="row" key={`${topic.topic_name}`}>
                <td>
                    <div class="form-check form-switch">
                        <input
                            type="checkbox"
                            onChange={this.handleTopicSelectionChange}
                            name={`${topic.topic_name}`}
                            className="form-control form-check-input"
                            value="included"
                            id={`${topic.topic_name}`} />
                    </div>
                </td>
                <td>{topic.topic_name}</td>
                <td>{topic.source_ordering_field}</td>
                <td>{topic.table_size}</td>
            </tr>
        )
    }

    renderSelectionTable(unassigned_topics) {
        return (
            <table className="table table-striped table-bordered dataTable no-footer" style={{ paddingTop: '10px' }}>
                <thead>
                    <tr role="row">
                        <th ref={React.createRef()}></th>
                        <th ref={React.createRef()}>Topic Name</th>
                        <th ref={React.createRef()}>Source Ordering Field</th>
                        <th ref={React.createRef()}>Table Size</th>
                    </tr>
                </thead>
                <tbody>
                    {unassigned_topics.map(topic => this.renderTopicRow(topic))}
                </tbody>
            </table>
        )

    }

    handleInputChange(e) {
        const { current } = this.state;
        const { value, name } = e.target;
        const updated = Object.assign({}, current, { [name]: value });
        this.setState({
            current: updated
        }, () => {
        });
    }

    handleTopicSelectionChange(e) {
        const { current } = this.state;
        const { topic_list } = {...this.state.current}
        let newArray = [...topic_list, e.target.id];
        if (topic_list.includes(e.target.id)) {
          newArray = newArray.filter(topic_name => topic_name !== e.target.id);
        }
        const updated = Object.assign({}, current, { topic_list: newArray });
        this.setState({
            current: updated
        }, () => {
        });
    }

    render() {
        const { job, unassigned_topics } = this.props;
        const {
            current,
            current: {
                job_name,
                job_size,
                topic_list,
                test_phase,
                updated_by,
            },
            initial,
        } = this.state;
        return(
            <div class="job-card px-5 mx-5">
                <p>You are now editing a job</p>
                <form>
                    <div class="container w-100">
                        <div class="row mb-3 w-100">
                            <div class="card job-card w-100">
                                <p>All jobs to select from</p>
                                <div>
                                 { this.renderSelectionTable(unassigned_topics) }
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-7">
                                <div className="left-form">
                                    <div className="form-group">
                                        <label>
                                            Job Name
                                            <input
                                                value={job_name}
                                                onChange={this.handleInputChange}
                                                name="job_name"
                                                type="text"
                                                className="form-control"
                                            />
                                        </label>
                                    </div>
                                    <div class="btn-group btn-group-toggle" className="form-group">
                                        <label>
                                        Job Size <br/>
                                        <label class="btn btn-secondary">
                                        <input
                                                  type="radio"
                                                  onChange={this.handleInputChange}
                                                  name="job_size"
                                                  className="form-control"
                                                  value="xs"
                                                  checked={job_size === "xs"} />
                                            X-Small
                                        </label>
                                        <label class="btn btn-secondary">
                                            <input
                                                  type="radio"
                                                  onChange={this.handleInputChange}
                                                  name="job_size"
                                                  className="form-control"
                                                  value="sm"
                                                  checked={job_size === "sm"} />
                                                Small
                                        </label>
                                        <label class="btn btn-secondary">
                                            <input
                                                  type="radio"
                                                  onChange={this.handleInputChange}
                                                  name="job_size"
                                                  className="form-control"
                                                  value="md"
                                                  checked={job_size === "md"} />
                                                 Medium
                                        </label>
                                        <label class="btn btn-secondary">
                                            <input
                                                  type="radio"
                                                  onChange={this.handleInputChange}
                                                  name="job_size"
                                                  className="form-control"
                                                  value="lg"
                                                  checked={job_size === "lg"} />
                                                 Large
                                            </label>
                                        </label>
                                    </div>
                                    <div class="btn-group btn-group-toggle" className="form-group">
                                        <label>
                                            Test Phase <br/>
                                            <label class="btn btn-light">
                                                <input
                                                      type="radio"
                                                      onChange={this.handleInputChange}
                                                      name="test_phase"
                                                      className="form-control"
                                                      value="initial"
                                                      checked={test_phase === "initial"} />
                                                Initial
                                            </label>
                                            <label class="btn btn-dark">
                                                <input
                                                      type="radio"
                                                      onChange={this.handleInputChange}
                                                      name="test_phase"
                                                      className="form-control"
                                                      value="complete"
                                                      checked={test_phase === "complete"}
                                                      />
                                                Completed
                                            </label>
                                        </label>
                                    </div>
                                    <div className="form-group">
                                        <label>
                                            Updated By (Your Name)
                                            <input
                                                    value={updated_by}
                                                    onChange={this.handleInputChange}
                                                    name="updated_by"
                                                    type="text"
                                                    className="form-control"
                                                    />
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div class="col-5">
                                Selected topics:
                                <ul>
                                {topic_list.map(topic => <li>{topic}</li>)}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <Button onClick={e => this.handleSubmit(e)} value="Publish" />
                </form>
            </div>
        )
    }
}

JobForm.defaultProps = {
    job: {},
    unassigned_topics: [],
    onSubmit: () => {},
    setAppState: () => {},
};

JobForm.propTypes = {
    job: PropTypes.object,
    unassigned_topics: PropTypes.array,
    setAppState: PropTypes.func,
    onSubmit: PropTypes.func,
};
