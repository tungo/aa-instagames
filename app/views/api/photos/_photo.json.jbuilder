show ||= false
uploaded_at = distance_of_time_in_words(photo.created_at, Time.now)

json.id photo.id
json.username photo.user.username
json.avatar asset_path(photo.user.avatar.url(:thumb))
json.url asset_path(photo.image.url(:large))
json.caption photo.caption
json.created_at photo.created_at
json.uploaded_at uploaded_at.gsub(/about/, '').concat(' ago')

if show
  json.url_medium asset_path(photo.image.url(:medium))
end

json.likesCount photo.likes.length
json.currentUserLiked (photo.likes.where(user_id: current_user.id).length > 0) ? true : false

json.commentsCount photo.comments.length
json.comments do
  photo.comments.each do |comment|
    json.set! comment.id do
      json.id comment.id
      json.body comment.body
      json.username comment.user.username
      json.created_at comment.created_at
    end
  end
end