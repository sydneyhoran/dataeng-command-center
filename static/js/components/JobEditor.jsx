//import React from 'react';
//import PropTypes from 'prop-types';
//
//import * as utils from '../lib/utils';
//
//import TopicTableForm from './JobTableForm';
//
//export default class TopicEditor extends React.Component {
//    constructor(props) {
//        super(props);
//        this.publishTopic = this.publishTopic.bind(this);
//    }
//
//    componentDidMount() {
//        const { setAppState, triggerAlert } = this.props;
//    }
//
//    publishTopic(topic) {
//        const {
//            history,
//            setAppState,
//            triggerAlert,
//        } = this.props;
//        setAppState({ loading: true });
//        console.log("In publish topic, topic is:")
//        console.log(topic)
//        // TODO change to 'ingestion_topics' (for new) or 'ingestion_topics/:db/:schema/:table' (for edit)
//        const route = 'ingestion_topics';
//        utils.postRequest(
//            route,
//            topic,
//            (new_topic) => {
//                setAppState({ loading: false });
//                if (route === 'ingestion_topics') history.push('/');
//                history.push('/temp');
//                history.goBack();
//            },
//            (resp) => {
//                setAppState({ loading: false });
//                console.log(`Error publishing topic - ${resp.response.data.response.error}`);
//                triggerAlert(`Error publishing topic - ${resp.response.data.response.error}`);
//            },
//        );
//    }
//
//    render() {
//        const selection = ({} || {});
//        const {
//            triggerAlert,
//        } = this.props;
//        return (
//            <TopicTableForm
//                topic={selection || {}}
//                onSubmit={this.publishTopic}
//                triggerAlert={triggerAlert}
//            />
//        )
//    }
//}
//
//TopicEditor.defaultProps = {
//    setAppState: () => {},
//    triggerAlert: () => {},
//};
//
//TopicEditor.propTypes = {
//    history: PropTypes.object.isRequired,
//    setAppState: PropTypes.func,
//    triggerAlert: PropTypes.func,
//};
