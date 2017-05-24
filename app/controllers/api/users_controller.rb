class Api::UsersController < ApplicationController
  before_action :require_logged_in!, except: [:create]

  def show
    @user = User.includes(photos: [:likes, :comments])
      .includes(in_follows: :follower)
      .includes(out_follows: :following)
      .order('photos.created_at DESC')
      .friendly.find(params[:id])

    if @user
      render :show
    else
      render json: @user.errors.full_messages, status: 422
    end
  end

  def create
    @user = User.new(user_params)

    if @user.save
      login(@user)
      render :show
    else
      render json: @user.errors.full_messages, status: 422
    end
  end

  def update
    @user = User.find(current_user.id)
    @user.slug = nil

    update_type = params[:id]
    if @user.update_user(user_params, update_type)
      if %w(avatar edit password).include?(update_type)
        render update_type.to_sym
      else
        render :show
      end
    else
      render json: @user.errors.full_messages, status: 422
    end
  end

  def search
    if params[:query].present?
      @users = User.where("username ~ ?", params[:query])
                   .order('username ASC')
                   .limit(20)
    else
      @users = User.none
    end

    render :search
  end

  private

  def user_params
    params.require(:user).permit(
      :username,
      :password,
      :avatar,
      :name,
      :bio,
      :new_password
    )
  end
end
