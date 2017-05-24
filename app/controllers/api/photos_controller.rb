class Api::PhotosController < ApplicationController
  before_action :require_logged_in!

  def index
    @photos = current_user.feed_photos

    if @photos
      render :index
    else
      render json: {}
    end
  end

  def create
    @photo = Photo.new(photo_params)
    @photo.user_id = current_user.id

    if @photo.save
      render :show
    else
      render json: @photo.errors.full_messages, status: 422
    end
  end

  def show
    @photo = Photo
      .includes(:user)
      .includes(:likes)
      .includes(:comments)
      .find(params[:id])
  end

  def destroy
    @photo = current_user.photos.find(params[:id])

    if @photo.destroy
      render :show
    else
      render json: @photo.errors.full_messages, status: 422
    end
  end

  def user
    @photos = Photo
      .includes(:user)
      .includes(:likes)
      .includes(:comments)
      .where(user_id: params[:user_id])

    if @photos
      render :user_index
    else
      render json: {}
    end
  end

  private

  def photo_params
    params.require(:photo).permit(:caption, :image)
  end
end
