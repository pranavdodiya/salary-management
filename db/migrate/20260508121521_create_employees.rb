class CreateEmployees < ActiveRecord::Migration[7.2]
  def change
    create_table :employees do |t|
      t.string :first_name, null: false
      t.string :last_name, null: false
      t.string :job_title, null: false
      t.string :country, null: false
      t.decimal :salary, null: false, precision: 12, scale: 2
      t.string :department
      t.date :date_of_joining, null: false
      t.string :email, null: false

      t.timestamps
    end

    add_index :employees, :country
    add_index :employees, :job_title
    add_index :employees, :department
    add_index :employees, :email, unique: true
    add_index :employees, [:country, :job_title]
    add_index :employees, [:country, :department]
  end
end
