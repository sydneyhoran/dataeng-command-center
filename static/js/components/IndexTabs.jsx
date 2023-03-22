import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';

import DeltastreamerList from './DeltastreamerList';
import TabSelector from './TabSelector';
import * as utils from '../lib/utils';

const INDEX_TABS = {
  jobs: 'Jobs',
  healthcheck: 'HealthCheck',
  redshift: 'Redshift',
};

export default class IndexTabs extends React.Component {
  constructor(props) {
    super(props);
    const { hash } = props.location;

    this.state = {
      tab: (hash && INDEX_TABS[hash.slice(1).toLowerCase()]) || INDEX_TABS.jobs,
    }
    this.handleTabChange = this.handleTabChange.bind(this);
  }

  handleTabChange(selection) {
    this.setState({ tab: INDEX_TABS[selection.toLowerCase()] || INDEX_TABS.jobs });
  }

  componentDidMount() {
    const {
      setAppState,
    } = this.props;
  }

  render() {
    const {history} = this.props;
    const {tab} = this.state;
    return (
        <div>
            <div style={{ display: 'inline-block', width: '90%', textAlign: 'right' }}>
              <input type="submit" className="btn btn-success" value="New Ingestion Topic" onClick={() => history.push('/edit/ingestion_topic')} />
            </div>
            <div style={{ marginTop: '1.5em' }}>
                <TabSelector
                    options={Object.values(INDEX_TABS)}
                    selected={tab}
                    onChange={this.handleTabChange}
                />
            </div>
            <div class="mx-4 py-4">
                {
                  {
                    [INDEX_TABS.jobs]: (<DeltastreamerList {...this.props} />),
                  }[tab]
                }
            </div>
        </div>
    );
  }
}

IndexTabs.defaultProps = {
  setAppState: () => { },
  triggerAlert: () => { },
};

IndexTabs.propTypes = {
  history: PropTypes.object.isRequired,
  setAppState: PropTypes.func,
};