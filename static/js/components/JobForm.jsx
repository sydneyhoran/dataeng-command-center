import React from 'react';
import PropTypes from 'prop-types';
import Button from './Button';

import * as utils from '../lib/utils';


export default class JobForm extends React.Component {
    constructor(props) {
        super(props);
        const { job, unassigned_topics } = props;
        this.state = {
            current: this.formatJobProps(job),
            initial: this.formatJobProps(job),
            existing_topics: job.ingestion_topics || []
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleInputClick = this.handleInputClick.bind(this);
        this.handleTopicSelectionChange = this.handleTopicSelectionChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const { job } = nextProps;
        const formatted_props = this.formatJobProps(job);
        this.setState({
            current: formatted_props,
            initial: formatted_props,
            existing_topics: job.ingestion_topics
        }, () => {
            if (job.ingestion_topics) {
                var topicArray = job.ingestion_topics.map(function(item) { return item["topic_name"]; });
                this.initializeTopicList(topicArray);
//                job.ingestion_topics.map(topic => {
//                    const ret = this.addItemToTopicList(topic.topic_name);
//                });
            }
        });
    }

    formatJobProps(job) {
        const ret = {
            job_name: job.job_name || 'deltastreamer_',
            topic_list: job.topic_list || [],
            job_size: job.job_size || 'xs',
            is_active: job.has_active_topics || false,
            updated_by: job.updated_by || ''
        }
        return ret
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

    handleInputClick(name) {
        return () => {
          const { current } = this.state;
          let update_payload = { [name]: !current[name] }
          const updated = Object.assign({}, current, update_payload);
          this.setState({ current: updated });
        }
    }

    handleTopicSelectionChange(e) {
        this.addItemToTopicList(e.target.id);
    }

    initializeTopicList(initial_topics) {
        const { current } = this.state;
        const { topic_list } = {...this.state.current};
        let newArray = [...topic_list, ...initial_topics];
        const updated = Object.assign({}, current, { topic_list: newArray } );
        this.setState({
                current: updated
            }, () => {
            });
    }

    addItemToTopicList(topic_name) {
            const { current } = this.state;
            const { topic_list } = {...this.state.current};
            let newArray = [...topic_list, topic_name];
            if (topic_list.includes(topic_name)) {
                newArray = newArray.filter(array_item => array_item !== topic_name);
            }
            const updated = Object.assign({}, current, { topic_list: newArray } );
            this.setState({
                current: updated
            }, () => {
            });

    }

    handleSubmit(e) {
        const { onSubmit } = this.props;
        const { current } = this.state;
        const job = Object.assign({}, current);
//        const keys = [
//            'job_name',
//            'job_size',
//            'is_active',
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
            <div className="card topic-card card-rounded p-2 m-1">
              <div className="card-title">
                <strong>Topic:</strong> {topic.topic_name}
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

    renderTopicRow(topic) {
        const { topic_list } = {...this.state.current};
        return (
            <tr role="row" key={`${topic.topic_name}`}>
                <td>
                    <div className="form-check form-switch">
                        <input
                            type="checkbox"
                            onChange={this.handleTopicSelectionChange}
                            name={`${topic.topic_name}`}
                            className="form-control form-check-input"
                            value="included"
                            id={`${topic.topic_name}`}
                            checked={topic_list.includes(`${topic.topic_name}`)}
                        />
                    </div>
                </td>
                <td>{topic.topic_name}</td>
                <td>{topic.source_ordering_field}</td>
                <td>{topic.table_size}</td>
            </tr>
        )
    }

    renderSelectionTable(unassigned_topics, existing_topics) {
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
                {existing_topics &&
                <tbody id="section1">
                    <tr role="row">
                        <th colspan="4">
                            Original Topics Selected
                        </th>
                    </tr>
                    {existing_topics.map(topic => this.renderTopicRow(topic, true))}
                </tbody>
                }
                <tbody id="section2">
                    <tr role="row">
                        <th colspan="4">
                            Available Topics
                        </th>
                    </tr>
                    {unassigned_topics.map(topic => this.renderTopicRow(topic))}
                </tbody>
            </table>
        )

    }

    render() {
        const { unassigned_topics } = this.props;
        const {
            current,
            current: {
                job_name,
                job_size,
                topic_list,
                is_active,
                updated_by,
            },
            initial,
            existing_topics
        } = this.state;
        return(
            <div className="job-card px-5 mx-5">
                <p>You are now editing a job</p>
                <form>
                    <div className="container w-100">
                        <div className="row mb-3 w-100">
                            <div className="card job-card w-100">
                                <p>All jobs to select from</p>
                                <div>
                                    { this.renderSelectionTable(unassigned_topics, existing_topics) }
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-7">
                                <div className="left-form">
                                    <div className="form-group">
                                        <label className="w-100">
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
                                    <div className="form-group">
                                        <label>
                                        Job Size <br/>
                                        <label className="btn btn-secondary">
                                        <input
                                                  type="radio"
                                                  onChange={this.handleInputChange}
                                                  name="job_size"
                                                  className="form-control"
                                                  value="xs"
                                                  checked={job_size === "xs"} />
                                            X-Small
                                        </label>
                                        <label className="btn btn-secondary">
                                            <input
                                                  type="radio"
                                                  onChange={this.handleInputChange}
                                                  name="job_size"
                                                  className="form-control"
                                                  value="sm"
                                                  checked={job_size === "sm"} />
                                                Small
                                        </label>
                                        <label className="btn btn-secondary">
                                            <input
                                                  type="radio"
                                                  onChange={this.handleInputChange}
                                                  name="job_size"
                                                  className="form-control"
                                                  value="md"
                                                  checked={job_size === "md"} />
                                                 Medium
                                        </label>
                                        <label className="btn btn-secondary">
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
                                    <div className="form-group">
                                        <label>
                                            Active? <br/>
                                        <div class="custom-control custom-switch">
                                          <input
                                            type="checkbox"
                                            onChange={this.handleInputClick("is_active")}
                                            className="custom-control-input"
                                            name="is_active"
//                                            value={is_active}
                                            id={`${job_name}_active_switch`}
                                            checked={is_active} />
                                          <label className="custom-control-label" for={`${job_name}_active_switch`}></label>
                                        </div>
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
                            { (topic_list.length > 0) &&
                                <div className="col-5">
                                    Selected topics:
                                    <ul>
                                    {topic_list.map(topic => <li>{topic}</li>)}
                                    </ul>
                                </div>
                            }
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
    existing_topics: [],
    onSubmit: () => {},
    setAppState: () => {},
};

JobForm.propTypes = {
    job: PropTypes.object,
    unassigned_topics: PropTypes.array,
    existing_topics: PropTypes.array,
    setAppState: PropTypes.func,
    onSubmit: PropTypes.func,
};
