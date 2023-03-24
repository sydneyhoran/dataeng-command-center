import React from 'react';
import PropTypes from 'prop-types';
import Button from './Button';


export default class TopicForm extends React.Component {
    constructor(props) {
        super(props);
        const { topic } = props;
        this.state = {
            current: this.formatTopicProps(topic),
            initial: this.formatTopicProps(topic),
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const { topic } = nextProps;
        const formatted_props = this.formatTopicProps(topic);
        this.setState({ current: formatted_props, initial: formatted_props });
    }

    formatTopicProps(topic) {
        return {
            topic_name: topic.topic_name || '',
            db_name: topic.db_name || '',
            schema_name: topic.schema_name || '',
            table_name: topic.table_name || '',
            table_size: topic.table_size || 'xs',
            multi_flag: topic.multi_flag || 'false',
            source_ordering_field: topic.source_ordering_field || 'updated_at',
            record_key: topic.record_key || 'id',
            partition_path_field: topic.partition_path_field || 'inserted_at',
            updated_by: topic.updated_by || ''
        }

    }

    handleSubmit(e) {
        const { onSubmit, triggerAlert } = this.props;
        const { current } = this.state;
        const topic = Object.assign({}, current);
        console.log("topic is:")
        console.log(topic)
//        const keys = [
//            'db_name',
//            'schema_name',
//            'table_name',
//            'table_size',
//            'source_ordering_field',
//            'record_key',
//            'partition_path_field',
//            'updated_by',
//        ]
//        keys.forEach((key) => {
//            topic[key] = topic[key].map(elem => elem.value);
//        });
        this.setState({ current: {} });
        onSubmit(topic);
        e.preventDefault();
    }

    handleInputChange(e) {
        const { current } = this.state;
        const { value, name } = e.target;
        const updated = Object.assign({}, current, { [name]: value });
        this.setState({
            current: updated
        }, () => {
            if ((name === 'topic_name') && (value.split('.').length == 3) && (value.split('.')[2])) {
                const table_details_updated = Object.assign({}, current, {
                    ['db_name']: value.split('.')[0],
                    ['schema_name']: value.split('.')[1],
                    ['table_name']: value.split('.')[2],
                    [name]: value
                });
                this.setState({ current: table_details_updated });
            }
        });
    }

    render() {
        const { topic, triggerAlert } = this.props;
        const {
            current,
            current: {
                topic_name,
                db_name,
                schema_name,
                table_name,
                table_size,
                multi_flag,
                source_ordering_field,
                record_key,
                partition_path_field,
                updated_by
            },
            initial,
        } = this.state;
        return(
                <div class="job-card px-5 mx-5">
                    <p>You are now editing a topic</p>
                    <form>
                        <div className="left-form">
                        <div className="form-group">
                            <label>
                                Topic Name
                                <input
                                value={topic_name}
                                onChange={this.handleInputChange}
                                name="topic_name"
                                type="text"
                                className="form-control"
                                />
                            </label>
                            <label>
                                Database
                                <input
                                value={db_name || "Enter topic to generate" }
                                name="db_name"
                                type="text"
                                className="form-control"
                                readonly
                                disabled
                                />
                            </label>
                            <label>
                                Schema Name
                                <input
                                value={schema_name}
                                name="schema_name"
                                type="text"
                                className="form-control"
                                readonly
                                disabled
                                />
                            </label>
                            <label>
                                Table Name
                                <input
                                value={table_name}
                                name="table_name"
                                type="text"
                                className="form-control"
                                readonly
                                disabled
                                />
                            </label>
                        </div>
                        <div class="btn-group btn-group-toggle" className="form-group">
                            <label class="btn btn-secondary">
                                <input
                                  type="radio"
                                  onChange={this.handleInputChange}
                                  name="table_size"
                                  className="form-control"
                                  value="xs"
                                  checked/>
                                 X-Small
                            </label>
                            <label class="btn btn-secondary">
                                <input
                                  type="radio"
                                  onChange={this.handleInputChange}
                                  name="table_size"
                                  className="form-control"
                                  value="sm" />
                                 Small
                            </label>
                            <label class="btn btn-secondary">
                                <input
                                  type="radio"
                                  onChange={this.handleInputChange}
                                  name="table_size"
                                  className="form-control"
                                  value="md" />
                                 Medium
                            </label>
                            <label class="btn btn-secondary">
                                <input
                                  type="radio"
                                  onChange={this.handleInputChange}
                                  name="table_size"
                                  className="form-control"
                                  value="lg" />
                                 Large
                            </label>
                        </div>
                        <div class="btn-group btn-group-toggle" className="form-group">
                            <label class="btn btn-light">
                                <input
                                  type="radio"
                                  onChange={this.handleInputChange}
                                  name="multi_flag"
                                  className="form-control"
                                  value="false"
                                  checked/>
                                 SingleTable
                            </label>
                            <label class="btn btn-dark">
                                <input
                                  type="radio"
                                  onChange={this.handleInputChange}
                                  name="multi_flag"
                                  className="form-control"
                                  value="true" />
                                 MultiTable
                            </label>
                        </div>
                        <div className="form-group">
                            <label>
                                Source Ordering Field
                                <input
                                value={source_ordering_field}
                                onChange={this.handleInputChange}
                                name="source_ordering_field"
                                type="text"
                                className="form-control"
                                />
                            </label>
                        </div>
                        <div className="form-group">
                            <label>
                                Record Key
                                <input
                                value={record_key}
                                onChange={this.handleInputChange}
                                name="record_key"
                                type="text"
                                className="form-control"
                                />
                            </label>
                        </div>
                        <div className="form-group">
                            <label>
                                Partition Path Field
                                <input
                                value={partition_path_field}
                                onChange={this.handleInputChange}
                                name="partition_path_field"
                                type="text"
                                className="form-control"
                                />
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
                    <Button onClick={e => this.handleSubmit(e)} value="Publish" />
                </form>
            </div>
        )
    }
}

TopicForm.defaultProps = {
    topic: {},
    onSubmit: () => {},
};

TopicForm.propTypes = {
    topic: PropTypes.object,
    onSubmit: PropTypes.func,
};
