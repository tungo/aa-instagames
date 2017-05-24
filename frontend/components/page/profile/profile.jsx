import React from 'react';
import { Link } from 'react-router-dom';

import { selectAllPhotos } from '../../../reducers/selectors';
import PhotoIndex from './photo_index';
import AvatarModal from './avatar_modal';
import FollowModal from './follow_modal';

class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      following: false,
      isInfiniteScroll: false,
      lastCreatedAt: null,
      isFetchingPhotos: false,
      noMorePhoto: false
    };

    this.limit = 6;

    this.handleScroll = this.handleScroll.bind(this);
    this.handleFollow = this.handleFollow.bind(this);
    this.startInfiniteScroll = this.startInfiniteScroll.bind(this);
  }

  componentWillReceiveProps({ userId }) {
    if (this.props.userId !== userId ) {
      this.fetchUser(userId);
    }
  }

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);

    this.fetchUser(this.props.match.params.userId);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll() {
    const body = document.body;
    const html = document.documentElement;
    const windowHeight = ("innerHeight" in window)
                         ? window.innerHeight
                         : document.documentElement.offsetHeight;

    const docHeight = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );
    const windowBottom = windowHeight + window.pageYOffset;

    if (windowBottom >= docHeight) {
      this.fetchUserPhotos();
    }
  }

  fetchUser(userId) {
    this.props.fetchUser(userId)
      .then((user) => {
        const photos = selectAllPhotos(user.photos);
        if (photos.length > 0) {
          this.setState({
            lastCreatedAt: photos[photos.length - 1].createdAt
          });
        }
      });
  }

  fetchUserPhotos(force) {
    if ((!force && !this.state.isInfiniteScroll) ||
        this.state.isFetchingPhotos ||
        this.state.noMorePhoto) {
      return;
    }

    this.setState({isFetchingPhotos: true});

    this.props.fetchUserPhotos({
      userId: this.props.match.params.userId,
      limit: this.limit,
      max_created_at: this.state.lastCreatedAt
    }).then((rspPhotos) => {
      const photos = selectAllPhotos(rspPhotos);

      if (photos.length < this.limit) {
        this.setState({noMorePhoto: true});
      }

      if (photos.length > 0) {
        this.setState({
          lastCreatedAt: photos[photos.length - 1].createdAt
        });
      }
    }).always(() => this.setState({isFetchingPhotos: false}));
  }

  startInfiniteScroll(e) {
    e.preventDefault();

    this.setState({isInfiniteScroll: true});
    this.fetchUserPhotos(true);
  }

  handleFollow(e) {
    e.preventDefault();

    this.setState({following: true});

    const { currentUser, user, followUser, unfollowUser } = this.props;
    const result = (user.currentUserFollowed)
                  ? unfollowUser(user.id)
                  : followUser(user.id);
    result.always(() => this.setState({following: false}));
  }

  renderSetting() {
    const { user, currentUser } = this.props;

    let setting = <Link
      to="/account/edit"
      alt="Edit Profile"
      className="link-button"
    >
      Edit Profile
    </Link>;

    if (user.username !== currentUser.username) {
      let followText = user.currentUserFollowed ? 'following' : 'follow';

      setting = <button
        className={`blue-button ${followText}`}
        onClick={this.handleFollow}
        disabled={this.state.submitting}
      >{followText}
      </button>;
    }

    return setting;
  }

  render() {
    const { user, photos, fetchPhotoDetail, currentUser } = this.props;

    let avatar = <AvatarModal user={user} />;
    if (user.username !== currentUser.username) {
      avatar = <figure>
        <img
          src={user.avatar}
          alt={user.username}
          className="image-circle"
        />
      </figure>;
    }

    return (
      <section className="profile-page">
        <article>
          <header>

            {avatar}

            <section className="information">
              <div className="title">
                <div>{user.username}</div>

                {this.renderSetting()}
              </div>

              <ul className="summary">
                <div className="count">
                  <span>{photos.length} </span>
                  posts
                </div>

                <FollowModal
                  count={user.followersCount}
                  followType="followers"
                />

                <FollowModal
                  count={user.followingCount}
                  followType="following"
                />
              </ul>

              <div className="bio">
                <span>{user.name} </span>
                {user.bio}
              </div>
            </section>
          </header>

          <PhotoIndex photos={photos} fetchPhotoDetail={fetchPhotoDetail} />

          <footer>
            <button
              className={this.state.isInfiniteScroll
                        ? 'hidden'
                        : 'blue-button'}
              onClick={this.startInfiniteScroll}
            >Load more
            </button>
          </footer>
        </article>
      </section>
    );
  }
}

export default Profile;