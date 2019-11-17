import React, { Fragment } from 'react';
import spinner_img from './spinner.gif';

const Spinner = () => {
  return (
    <Fragment>
      <img
        src={spinner_img}
        style={{ width: '200px', margin: 'auto', display: 'block' }}
        alt='Loading...'
      />
    </Fragment>
  );
};

export default Spinner;
