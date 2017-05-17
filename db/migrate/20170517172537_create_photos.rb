class CreatePhotos < ActiveRecord::Migration
  def change
    create_table :photos do |t|
      t.string :url, null: false
      t.text :caption
      t.integer :user_id, null: false

      t.timestamps null: false
    end

    add_index :photos, :user_id
  end
end
