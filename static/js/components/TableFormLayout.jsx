import React from 'react';
import PropTypes from 'prop-types';
import Button from './Button';


export default class TableFormLayout extends React.Component {
    constructor(props) {
        super(props);
        const { is_topic } = this.props;
        const { table } = props;
        if (is_topic) {
            this.state = {
                current: this.formatTableProps(table),
                initial: this.formatTableProps(table),
            }
            this.handleSubmit = this.handleSubmit.bind(this);
        } else {
            this.state = {
                current: {},
                initial: {},
            };
        }
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const { table } = nextProps;
        const { is_topic } = this.props;
        const formatted_props = is_topic ? this.formatTableProps(table) : this.formatTableProps(table);
        this.setState({ current: formatted_props, initial: formatted_props });
    }

    formatTableProps(table) {
        const { is_topic } = this.props;
        if (is_topic) {
            return {
                topic_name: table.topic_name || '',
                db_name: table.db_name || '',
                schema_name: table.schema_name || '',
                table_name: table.table_name || '',
                table_size: table.table_size || '',
                multi_flag: table.multi_flag || '',
                source_ordering_field: table.source_ordering_field || 'updated_at',
                record_key: table.record_key || 'id',
                partition_path_field: table.partition_path_field || 'inserted_at',
                updated_by: table.updated_by || ''
            }
        }
    }

    handleSubmit(e) {
        const { is_topic, onSubmit, triggerAlert } = this.props;
        const { current } = this.state;
        const table = Object.assign({}, current);
        console.log("table is:")
        console.log(table)
//        const keys = is_topic ? [
//            'db_name',
//            'schema_name',
//            'table_name',
//            'table_size',
//            'source_ordering_field',
//            'record_key',
//            'partition_path_field',
//            'updated_by',
//        ] : [];
//        keys.forEach((key) => {
//            table[key] = table[key].map(elem => elem.value);
//        });
        if (is_topic) {
            this.setState({ current: {} });
            onSubmit(table);
        }
        e.preventDefault();
    }

    handleInputChange(e) {
        const { is_topic } = this.props;
        const { current } = this.state;
        const { value, name } = e.target;
        const updated = Object.assign({}, current, { [name]: value });
        this.setState({
            current: updated
        }, () => {
            if ((name === 'topic_name') && (value.split('.').length == 3) && (value.split('.')[2])) {
                const table_updated = Object.assign({}, current, {
                    ['db_name']: value.split('.')[0],
                    ['schema_name']: value.split('.')[1],
                    ['table_name']: value.split('.')[2],
                    [name]: value
                });
                this.setState({ current: table_updated });
            }
        });

//        if (is_topic) {
//            const updated = Object.assign({}, { [name]: value });
//            this.setState({ new_tag: updated });
//        } else {
//            const updated = Object.assign({}, current, { [name]: value });
//            this.setState({ current: updated });
//        }
//        const { value, name } = e.target;
//        this.setState({value: e.target.value })
//        if (is_model) {
//            const updated = Object.assign({}, new_tag, { [name]: value });
//            this.setState({ new_tag: updated });
//        } else {
//            const updated = Object.assign({}, current, { [name]: value });
//            this.setState({ current: updated });
//        }
    }

    render() {
        const { table, is_topic, triggerAlert } = this.props;
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
        if (is_topic) {
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
                                  value="xs" />
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
                                  value="false" />
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
        else {
            return(
                <div>
                    <p>Not editing a topic</p>
                </div>
            )
        }
    }
}

TableFormLayout.defaultProps = {
    table: {},
    onSubmit: () => {},
};

TableFormLayout.propTypes = {
    table: PropTypes.object,
    onSubmit: PropTypes.func,
};

//                            <div class="btn-group btn-group-toggle" className="form-group">
//                            <label>
//                                Table Size
//                                <select
//                                value={table_size}
//                                onChange={this.handleInputChange}
//                                name="table_size"
//                                className="form-control">
//                                    <option value="lg">Large</option>
//                                    <option value="md">Medium</option>
//                                    <option value="sm">Small</option>
//                                    <option value="xs">X-Small</option>
//                                </select>
//                            </label>