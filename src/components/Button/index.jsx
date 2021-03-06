import React, {PropTypes} from 'react';
import {Link} from 'react-router';

import styles from './styles.scss';
import classNames from 'classnames';

/**
 * A button component with different options:
 *
 * @type  link      Render the component as an <a> instead of <button>.
 * @type  light     White instead of black.
 * @type  outline   Don't fill the button.
 * @type  external  Internal buttons use react-router's Link instead of <a> or <button>.
 * @type  loading   Whether a loading indicator should be shown instead of text.
 * @type  children  Text to display inside the button.
 * @type  className Add classes to the element.
 * @type  type      Button type.
 * @type  href      A link to redirect to.
 */
class Button extends React.Component {

  static propTypes = {
    link: PropTypes.bool,
    light: PropTypes.bool,
    outline: PropTypes.bool,
    external: PropTypes.bool,
    loading: PropTypes.bool,
    children: PropTypes.node,
    className: PropTypes.string,
    onClick: PropTypes.func,
    href: PropTypes.string,
    type: PropTypes.string
  }

  handleClick = () => {
    if (!this.props.loading && this.props.href) {
      document.location = this.props.href;
    }
  }

  render() {
    let {link, light, outline, external, loading, children, className, onClick, href, ...props} = this.props;

    const fillClass = outline ? styles.outline : styles.filled;
    const colorClass = light ? styles.light : styles.dark;
    const classes = classNames(fillClass, colorClass, className);

    if (loading) {
      children = (<div className={styles.loader}><div></div><div></div></div>);
    }

    if (!link) {
      return (
        <button
          className={classes}
          onClick={onClick || this.handleClick}
          disabled={loading}
          {...props}>
            {children}
        </button>
      );
    } else if (external) {
      return (
        <a
          className={classes}
          onClick={onClick}
          href={href}
          {...props}>
            {children}
        </a>
      );
    } else {
      return (
        <Link
          className={classes}
          onClick={onClick}
          to={href}
          {...props}>
            {children}
        </Link>
      );
    }
  }

}

export default Button;
