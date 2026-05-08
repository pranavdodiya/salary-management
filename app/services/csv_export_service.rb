require 'csv'

class CsvExportService
  HEADERS = %w[ID FirstName LastName Email JobTitle Department Country Salary DateOfJoining].freeze

  def initialize(relation = Employee.all)
    @relation = relation
  end

  def generate
    CSV.generate(headers: true) do |csv|
      csv << HEADERS

      @relation.find_each(batch_size: 1000) do |employee|
        csv << [
          employee.id,
          employee.first_name,
          employee.last_name,
          employee.email,
          employee.job_title,
          employee.department,
          employee.country,
          employee.salary.to_f,
          employee.date_of_joining
        ]
      end
    end
  end
end
