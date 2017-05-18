import React from 'react';
import { Redirect, Link } from 'react-router-dom';

import UploadModal from './upload_modal';

class Nav extends React.Component {
  constructor (props) {
    super(props);

    this.state = {};
  }

  handleLogout(e) {
    e.preventDefault();

    this.props.logout()
      .then(() => this.setState({ redirect: true }));
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to="/login" />;
    }
    return (
      <nav className="nav-bar">
        <div className="logo">
          <Link to="/" className="link">
            <div>
              <img src="/assets/instagames-logo-90.png" />
            </div>
            <div className="separator"></div>
            <div className="name">Instagames</div>
          </Link>
        </div>

        <div className="utils">
            <UploadModal />
            <Link to={`/user/${this.props.currentUser.username}`}>
              <i className="fa fa-user-o"></i>
            </Link>
            <button onClick={this.handleLogout.bind(this)} className="button-link">
              <i className="fa fa-sign-out"></i>
            </button>
        </div>
      </nav>
    );
  }
}

export default Nav;