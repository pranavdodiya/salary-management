FactoryBot.define do
  factory :employee do
    first_name { Faker::Name.first_name }
    last_name { Faker::Name.last_name }
    job_title { Faker::Job.title }
    country { Faker::Address.country }
    salary { Faker::Number.decimal(l_digits: 5, r_digits: 2) }
    department { Faker::Commerce.department(max: 1) }
    date_of_joining { Faker::Date.between(from: 10.years.ago, to: Date.today) }
    sequence(:email) { |n| "employee#{n}@example.com" }
  end
end
