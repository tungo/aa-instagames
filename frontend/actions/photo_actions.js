import * as PhotoAPIUtil from '../util/photo_api_util';

import { receiveFormErrors } from './error_actions';
import { startLoading, stopLoading } from './loading_actions';


export const RECEIVE_PHOTOS = 'RECEIVE_PHOTOS';
export const RECEIVE_PHOTO = 'RECEIVE_PHOTO';
export const RECEIVE_PHOTO_DETAIL = 'RECEIVE_PHOTO_DETAIL';
export const REMOVE_PHOTO = 'REMOVE_PHOTO';
export const RECEIVE_USER_PHOTOS = 'RECEIVE_USER_PHOTOS';
export const RECEIVE_USER_PHOTO = 'RECEIVE_USER_PHOTO';


export const receivePhotos = (photos) => ({
  type: RECEIVE_PHOTOS,
  photos
});

export const receivePhoto = (photo) => ({
  type: RECEIVE_PHOTO,
  photo
});

export const receivePhotoDetail = (photoDetail) => ({
  type: RECEIVE_PHOTO_DETAIL,
  photoDetail
});

export const removePhoto = (id) => ({
  type: REMOVE_PHOTO,
  id
});

export const receiveUserPhotos = (photos) => ({
  type: RECEIVE_USER_PHOTOS,
  photos
});

export const receiveUserPhoto = (photo) => ({
  type: RECEIVE_USER_PHOTO,
  photo
});


export const feedPhotos = (query) => (dispatch) => {
  dispatch(startLoading());

  return PhotoAPIUtil.feedPhotos(query)
    .then((photos) => {
      dispatch(receivePhotos(photos));
      return photos;
    });
};

export const createPhoto = (photo) => (dispatch) => {
  dispatch(startLoading());

  return PhotoAPIUtil.createPhoto(photo)
    .then((rspPhoto) => {
      dispatch(receivePhoto(rspPhoto));
      dispatch(receiveUserPhoto(rspPhoto));
      return rspPhoto;
    })
    .fail((err) =>
      dispatch(receiveFormErrors('photoUpload', err.responseJSON)
    ));
};

export const fetchPhotoDetail = (id) => (dispatch, getState) => {
  dispatch(startLoading());

  const photo = getState().photos[id];
  if (photo) {
    dispatch(receivePhotoDetail(photo));
    return photo;
  }

  return PhotoAPIUtil.requestPhoto(id)
    .then((rspPhoto) => {
      dispatch(receivePhotoDetail(rspPhoto));
      return rspPhoto;
    });
};

export const deletePhoto = (id) => (dispatch) => {
  dispatch(startLoading());

  return PhotoAPIUtil.deletePhoto(id)
    .then((photo) => dispatch(removePhoto(photo.id)));
};

export const fetchUserPhotos = (query) => (dispatch) => {
  dispatch(startLoading());

  return PhotoAPIUtil.fetchUserPhotos(query)
    .then((photos) => {
      dispatch(receiveUserPhotos(photos));
      return photos;
    });
};
