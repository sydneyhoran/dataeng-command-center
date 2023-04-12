import React from 'react';
import PropTypes from 'prop-types';

import * as utils from '../lib/utils';

import TopicForm from './TopicForm';

export default class TopicEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            topic: {}
        };
        this.publishTopic = this.publishTopic.bind(this);
    }

    componentDidMount() {
        const { match: { params }, topic, setAppState, triggerAlert } = this.props;
        if (params.topic_id) {
            setAppState({ loading: true });
            utils.getRequest(
                `ingestion_topics/${params.topic_id}`,
                (found_topic) => {
                    setAppState({ loading: false });
                    this.setState({ topic: found_topic });
                },
                (resp) => {
                    setAppState({ loading: false });
                    triggerAlert(`Could not get the requested topic - ${resp.response.data.response.error}`);
                    console.log(`Could not get the requested topic - ${resp.response.data.response.error}`);
                },
            );
        }
    }

    publishTopic(topic) {
        const {
            match: { params },
            history,
            setAppState,
            triggerAlert,
        } = this.props;
        setAppState({ loading: true });
        // TODO change to 'ingestion_topics' (for new) or 'ingestion_topics/:db/:schema/:table' (for edit)
        const route =  (params.topic_id ? `ingestion_topics/${params.topic_id}` : 'ingestion_topics')
        utils.postRequest(
            route,
            topic,
            (new_topic) => {
                setAppState({ loading: false });
                if (route === 'ingestion_topics') history.push('/');
                history.push('/temp');
                history.goBack();
            },
            (resp) => {
                setAppState({ loading: false });
                console.log(`Error publishing topic - ${resp.response.data.response.error}`);
                triggerAlert(`Error publishing topic - ${resp.response.data.response.error}`);
            },
        );
    }

    render() {
        const selection = ({} || {});
        const {
            triggerAlert,
        } = this.props;
        if (this.state.topic != {}) {
            const { topic } = this.state;
            const selection = topic;
            return (
                <TopicForm
                    {...this.props}
                    topic={selection}
                    onSubmit={this.publishTopic}
                    triggerAlert={triggerAlert}
                />
            )
        } else {
            return ( <p> loading </p> )
        }
    }
}

TopicEditor.defaultProps = {
    setAppState: () => {},
    triggerAlert: () => {},
};

TopicEditor.propTypes = {
    history: PropTypes.object.isRequired,
    setAppState: PropTypes.func,
    triggerAlert: PropTypes.func,
};
