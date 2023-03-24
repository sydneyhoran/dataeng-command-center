//import React from 'react';
//import PropTypes from 'prop-types';
//
//import * as utils from '../lib/utils';
//
//import TopicTableForm from './TopicTableForm';
//
//export default class EditorLayout extends React.Component {
//    constructor(props) {
//        super(props);
//        const { for_page } = this.props;
//        this.publishTopic = this.publishTopic.bind(this);
//    }
//
//    componentDidMount() {
//        const { setAppState, for_page, triggerAlert } = this.props;
////        if (for_page == 1) {
////            console.log("Entering editing mode")
////        }
//    }
//
//    publishTopic(topic) {
//        const {
//            for_page,
//            history,
//            setAppState,
//            triggerAlert,
//        } = this.props;
//        setAppState({ loading: true });
//        console.log("In publish topic, topic is:")
//        console.log(topic)
//        const route = (for_page == 1) ? 'ingestion_topics' : 'deltastreamer_jobs';
//        utils.postRequest(
//            route,
//            topic,
//            (new_topic) => {
//                setAppState({ loading: false });
//                if (((for_page == 1) && route === 'ingestion_topics') || ((for_page == 2) && route === 'deltastreamer_jobs')) history.push('/');
//                history.push('/temp');
//                history.goBack();
//            },
//            (resp) => {
//                setAppState({ loading: false });
//                console.log(`Error publishing ${(for_page == 1) ? 'topic' : 'job'} - ${resp.response.data.response.error}`);
//                triggerAlert(`Error publishing ${(for_page == 1) ? 'topic' : 'job'} - ${resp.response.data.response.error}`);
//            },
//        );
//    }
//
//    render() {
//        const { for_page } = this.props;
//        const selection = ({} || {});
//        if (for_page == 1) {
//            const {
//                triggerAlert,
//            } = this.props;
//            return (
//                <TopicTableForm
//                    topic={selection || {}}
//                    onSubmit={this.publishTopic}
//                    triggerAlert={triggerAlert}
//                />
//            )
//        } else {
//            return (
//                <div>
//                    <p>Not correct</p>
//                </div>
//            )
//        }
//    }
//}
//
//EditorLayout.defaultProps = {
//    setAppState: () => {},
//    triggerAlert: () => {},
//};
//
//EditorLayout.propTypes = {
//    history: PropTypes.object.isRequired,
//    setAppState: PropTypes.func,
//    triggerAlert: PropTypes.func,
//};