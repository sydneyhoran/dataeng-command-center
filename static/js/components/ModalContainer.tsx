import React, { ReactElement } from 'react';

import '../../css/ModalContainer.css';

type Props = {
  child: React.FC,
  children?: React.ReactNode
};


const ModalContainer: React.FC<Props> = ({ children }): ReactElement => {
  return (
    <div className="modal-overlay">
      <div className="modal-dialog">
        { children }
      </div>
    </div>
  );
};


export default ModalContainer;
