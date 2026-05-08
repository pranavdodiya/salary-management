Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :employees

      get 'salary_insights', to: 'salary_insights#index'
      get 'salary_insights/by_country', to: 'salary_insights#by_country'
      get 'salary_insights/by_job_title', to: 'salary_insights#by_job_title'
      get 'salary_insights/by_department', to: 'salary_insights#by_department'
      get 'salary_insights/salary_ranges', to: 'salary_insights#salary_ranges'
      get 'salary_insights/top_earners', to: 'salary_insights#top_earners'
      get 'salary_insights/country_payroll', to: 'salary_insights#country_payroll'
      get 'salary_insights/countries', to: 'salary_insights#countries'
      get 'salary_insights/job_titles', to: 'salary_insights#job_titles'
      get 'salary_insights/departments', to: 'salary_insights#departments'

      get 'exports/employees', to: 'exports#employees_csv'
    end
  end

  get "up" => "rails/health#show", as: :rails_health_check
end
