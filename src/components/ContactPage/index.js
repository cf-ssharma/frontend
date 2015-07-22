import React, {PropTypes} from 'react';
import styles from './styles.scss';

class ContactPage {

  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired
  };

  render() {
    const title = 'Contact Us';
    this.context.onSetTitle(title);
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <h1>{title}</h1>
          <p>...</p>
        </div>
      </div>
    );
  }

}

export default ContactPage;
