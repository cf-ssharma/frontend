import React, {PropTypes} from 'react';

import classNames from 'classnames';
import styles from './styles.scss';

class Header extends React.Component {

  static propTypes = {
    className: PropTypes.string
  }

  render() {
    return (
      <div className={classNames(styles.header, this.props.className)}></div>
    );
  }

}

export default Header;
