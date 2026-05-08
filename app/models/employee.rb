class Employee < ApplicationRecord
  include Searchable
  include Filterable

  validates :first_name, presence: true
  validates :last_name, presence: true
  validates :job_title, presence: true
  validates :country, presence: true
  validates :salary, presence: true, numericality: { greater_than: 0 }
  validates :date_of_joining, presence: true
  validates :email, presence: true,
                    uniqueness: { case_sensitive: false },
                    format: { with: URI::MailTo::EMAIL_REGEXP, message: "must be a valid email address" }

  def full_name
    "#{first_name} #{last_name}"
  end
end
