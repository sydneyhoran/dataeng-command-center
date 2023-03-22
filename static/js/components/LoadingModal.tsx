import React, { ReactElement } from 'react';

import '../../css/LoadingModal.css';

const LoadingModal: React.FC<{}> = (): ReactElement => (
  <div>
    <i className="fa fa-spinner fa-spin loading-spinner" />
    <span className="loading-message">Loading...</span>
  </div>
);

export default LoadingModal;
