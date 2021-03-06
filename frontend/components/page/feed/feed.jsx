import React from 'react';

import { selectAllPhotos } from '../../../reducers/selectors';
import Photo from './photo';
import Welcome from './welcome';

class Feed extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lastCreatedAt: null,
      isFeeding: false,
      noMorePhoto: false
    };

    this.limit = 6;

    this.handleScroll = this.handleScroll.bind(this);
    this.feedPhotos = this.feedPhotos.bind(this);
  }

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);

    this.feedPhotos();
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
      // stop scrolling
      // body.style.overflow = 'hidden';
      // setTimeout(function() {
      //   body.style.overflow = '';
      // }, 10);

      this.feedPhotos();
    }
  }

  feedPhotos() {
    if (this.state.isFeeding || this.state.noMorePhoto) {
      return;
    }
    this.setState({isFeeding: true});

    this.props.feedPhotos({
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
    }).always(() => this.setState({isFeeding: false}));
  }

  renderPhotos() {
    return this.props.photos.map((photo) => (
      <li key={`photo-${photo.id}`}>
        <Photo photo={photo} />
      </li>
    ));
  }

  render() {
    if (this.props.photos.length < 1) {
      return <Welcome />;
    }

    return (
      <section className="feed-page">
        <ul>
          {this.renderPhotos()}

          <li>
            <div
              id="image-loading-spinner"
              className={this.state.isFeeding ? 'loading-spinner' : 'hidden'}
            >
            </div>
          </li>
        </ul>


      </section>
    );
  }
}

export default Feed;