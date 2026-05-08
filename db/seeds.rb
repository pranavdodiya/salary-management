require 'benchmark'

puts "=== Salary Management - Database Seeding ==="
puts "Loading name data..."

first_names = File.readlines(Rails.root.join('db/data/first_names.txt')).map(&:strip).reject(&:empty?)
last_names = File.readlines(Rails.root.join('db/data/last_names.txt')).map(&:strip).reject(&:empty?)

COUNTRIES = [
  'India', 'USA', 'UK', 'Germany', 'Canada',
  'Australia', 'France', 'Japan', 'Brazil', 'Singapore'
].freeze

JOB_TITLES = [
  'Software Engineer', 'Senior Software Engineer', 'Staff Engineer',
  'Engineering Manager', 'Product Manager', 'Senior Product Manager',
  'Data Scientist', 'Senior Data Scientist', 'Data Engineer',
  'DevOps Engineer', 'Senior DevOps Engineer', 'SRE',
  'QA Engineer', 'Senior QA Engineer', 'QA Lead',
  'UI/UX Designer', 'Senior Designer', 'Design Lead',
  'Business Analyst', 'Technical Writer', 'Scrum Master',
  'Solutions Architect', 'Principal Engineer', 'CTO'
].freeze

DEPARTMENTS = [
  'Engineering', 'Product', 'Data', 'DevOps',
  'Quality Assurance', 'Design', 'Operations', 'Management'
].freeze

DOMAINS = %w[company.com corp.io enterprise.org techfirm.com globalinc.net].freeze

# Salary ranges by country (annual, in USD equivalent)
SALARY_RANGES = {
  'India'     => (25_000..120_000),
  'USA'       => (60_000..200_000),
  'UK'        => (45_000..170_000),
  'Germany'   => (50_000..160_000),
  'Canada'    => (55_000..180_000),
  'Australia' => (55_000..175_000),
  'France'    => (40_000..150_000),
  'Japan'     => (45_000..165_000),
  'Brazil'    => (20_000..100_000),
  'Singapore' => (50_000..180_000)
}.freeze

TOTAL_EMPLOYEES = 10_000
BATCH_SIZE = 1_000

puts "Generating #{TOTAL_EMPLOYEES} employees..."
puts "First names pool: #{first_names.length}, Last names pool: #{last_names.length}"

# Clear existing data for idempotent runs
Employee.delete_all

time = Benchmark.measure do
  now = Time.current
  employee_records = []

  TOTAL_EMPLOYEES.times do |i|
    country = COUNTRIES.sample
    salary_range = SALARY_RANGES[country]
    fname = first_names.sample
    lname = last_names.sample

    employee_records << {
      first_name: fname,
      last_name: lname,
      job_title: JOB_TITLES.sample,
      country: country,
      salary: rand(salary_range).round(2),
      department: DEPARTMENTS.sample,
      date_of_joining: Date.today - rand(1..3650),
      email: "#{fname.downcase}.#{lname.downcase}.#{i + 1}@#{DOMAINS.sample}",
      created_at: now,
      updated_at: now
    }

    # Bulk insert in batches for performance
    if employee_records.length >= BATCH_SIZE
      Employee.insert_all(employee_records)
      employee_records.clear
      print "\r  Inserted #{((i + 1).to_f / TOTAL_EMPLOYEES * 100).round(1)}%..."
    end
  end

  # Insert remaining records
  Employee.insert_all(employee_records) if employee_records.any?
end

puts "\n\n=== Seeding Complete ==="
puts "Total employees: #{Employee.count}"
puts "Countries: #{Employee.distinct.pluck(:country).sort.join(', ')}"
puts "Job titles: #{Employee.distinct.count(:job_title)}"
puts "Departments: #{Employee.distinct.count(:department)}"
puts "Time taken: #{time.real.round(2)} seconds"
puts "Performance: #{(TOTAL_EMPLOYEES / time.real).round(0)} records/second"
