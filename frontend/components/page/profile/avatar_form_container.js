import { connect } from 'react-redux';

import { updateAvatar } from '../../../actions/user_actions';
import {
  clearFormErrors,
  receiveFormErrors
} from '../../../actions/error_actions';

import AvatarForm from './avatar_form';

const mapStateToProps = (state) => ({
  errors: state.errors.avatarUpload
});

const mapDispatchToProps = (dispatch) => ({
  updateAvatar: (user) => dispatch(updateAvatar(user)),
  receiveFormErrors: (err) => dispatch(receiveFormErrors('avatarUpload', err)),
  clearErrors: () => dispatch(clearFormErrors('avatarUpload'))
});

export default connect(mapStateToProps, mapDispatchToProps)(AvatarForm);