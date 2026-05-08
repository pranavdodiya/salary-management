module Filterable
  extend ActiveSupport::Concern

  included do
    scope :by_country, ->(country) { country.present? ? where(country: country) : all }
    scope :by_job_title, ->(job_title) { job_title.present? ? where(job_title: job_title) : all }
    scope :by_department, ->(department) { department.present? ? where(department: department) : all }
  end
end
