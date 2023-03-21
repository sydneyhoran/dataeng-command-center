import React from 'react';
import PropTypes from 'prop-types';

import * as utils from '../lib/utils';

import TopicTableForm from './TopicTableForm';

export default class EditorLayout extends React.Component {
    constructor(props) {
        super(props);
        const { for_page } = this.props;
        this.publishTopic = this.publishTopic.bind(this);
    }

    componentDidMount() {
        const { setAppState, for_page } = this.props;
        if (for_page == 1) {
            console.log("Entering create new topic")
        }
    }

    publishTopic(topic) {
        const {
            for_page,
            history,
            setAppState,
        } = this.props;
        console.log("In publish topic, topic is:")
        console.log(topic)
        utils.postRequest(
            'ingestion_topics',
            topic,
            (new_topic) => {
                history.push('/');
                history.goBack();
            },
            (resp) => {
                console.log(`Error publishing ${(for_page == 1) ? 'topic' : 'job'} - ${resp.response.data.response.error}`);
            },
        );
    }

    render() {
        const { for_page } = this.props;
        const selection = ({} || {});
        if (for_page == 1) {
            return (
                <TopicTableForm
                    topic={selection || {}}
                    onSubmit={this.publishTopic}
                />
            )
        } else {
            return (
                <div>
                    <p>Not correct</p>
                </div>
            )
        }
    }
}

EditorLayout.defaultProps = {
    setAppState: () => {},
};

EditorLayout.propTypes = {
    history: PropTypes.object.isRequired,
    setAppState: PropTypes.func,
};