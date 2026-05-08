class EmployeeSerializer
  attr_reader :employee

  def initialize(employee)
    @employee = employee
  end

  def as_json(_options = {})
    {
      id: employee.id,
      first_name: employee.first_name,
      last_name: employee.last_name,
      full_name: employee.full_name,
      job_title: employee.job_title,
      country: employee.country,
      salary: employee.salary.to_f,
      department: employee.department,
      date_of_joining: employee.date_of_joining,
      email: employee.email,
      created_at: employee.created_at,
      updated_at: employee.updated_at
    }
  end

  def self.collection(employees)
    employees.map { |employee| new(employee).as_json }
  end
end
