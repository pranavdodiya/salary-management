class SalaryInsightsService
  SALARY_RANGES = [
    { min: 0, max: 30_000, label: '0 - 30K' },
    { min: 30_000, max: 50_000, label: '30K - 50K' },
    { min: 50_000, max: 75_000, label: '50K - 75K' },
    { min: 75_000, max: 100_000, label: '75K - 100K' },
    { min: 100_000, max: 150_000, label: '100K - 150K' },
    { min: 150_000, max: Float::INFINITY, label: '150K+' }
  ].freeze

  def overall
    stats = Employee.pick(
      Arel.sql("MIN(salary)"),
      Arel.sql("MAX(salary)"),
      Arel.sql("AVG(salary)"),
      Arel.sql("COUNT(*)")
    )

    {
      min_salary: stats[0]&.to_f,
      max_salary: stats[1]&.to_f,
      average_salary: stats[2]&.to_f&.round(2),
      median_salary: median_salary,
      total_employees: stats[3] || 0
    }
  end

  def by_country(country: nil)
    scope = country.present? ? Employee.where(country: country) : Employee
    scope.group(:country).select(
      "country",
      "MIN(salary) as min_salary",
      "MAX(salary) as max_salary",
      "AVG(salary) as average_salary",
      "COUNT(*) as employee_count"
    ).map do |row|
      {
        country: row.country,
        min_salary: row.min_salary.to_f,
        max_salary: row.max_salary.to_f,
        average_salary: row.average_salary.to_f.round(2),
        employee_count: row.employee_count
      }
    end
  end

  def by_job_title(country: nil)
    scope = country.present? ? Employee.where(country: country) : Employee
    scope.group(:job_title).select(
      "job_title",
      "AVG(salary) as average_salary",
      "MIN(salary) as min_salary",
      "MAX(salary) as max_salary",
      "COUNT(*) as employee_count"
    ).map do |row|
      {
        job_title: row.job_title,
        average_salary: row.average_salary.to_f.round(2),
        min_salary: row.min_salary.to_f,
        max_salary: row.max_salary.to_f,
        employee_count: row.employee_count
      }
    end
  end

  def by_department
    Employee.group(:department).select(
      "department",
      "AVG(salary) as average_salary",
      "MIN(salary) as min_salary",
      "MAX(salary) as max_salary",
      "COUNT(*) as employee_count"
    ).map do |row|
      {
        department: row.department,
        average_salary: row.average_salary.to_f.round(2),
        min_salary: row.min_salary.to_f,
        max_salary: row.max_salary.to_f,
        employee_count: row.employee_count
      }
    end
  end

  # Optimized: single SQL query with CASE/WHEN instead of N separate queries
  def salary_ranges
    cases = SALARY_RANGES.each_with_index.map do |range, i|
      upper = range[:max] == Float::INFINITY ? nil : range[:max]
      condition = upper ? "salary >= #{range[:min]} AND salary < #{upper}" : "salary >= #{range[:min]}"
      "SUM(CASE WHEN #{condition} THEN 1 ELSE 0 END) as r#{i}"
    end

    result = Employee.pick(*cases.map { |c| Arel.sql(c) })
    result = [result] unless result.is_a?(Array)

    SALARY_RANGES.each_with_index.map do |range, i|
      { range: range[:label], count: result[i].to_i }
    end
  end

  def top_earners(limit: 10)
    Employee.order(salary: :desc).limit(limit).map do |employee|
      EmployeeSerializer.new(employee).as_json
    end
  end

  def country_payroll
    Employee.group(:country).select(
      "country",
      "SUM(salary) as total_payroll",
      "COUNT(*) as employee_count",
      "AVG(salary) as average_salary"
    ).order("total_payroll DESC").map do |row|
      {
        country: row.country,
        total_payroll: row.total_payroll.to_f.round(2),
        employee_count: row.employee_count,
        average_salary: row.average_salary.to_f.round(2)
      }
    end
  end

  def countries
    Employee.distinct.pluck(:country).sort
  end

  def job_titles
    Employee.distinct.pluck(:job_title).sort
  end

  def departments
    Employee.distinct.pluck(:department).compact.sort
  end

  private

  # Efficient median using OFFSET/LIMIT instead of loading all records
  def median_salary
    count = Employee.count
    return nil if count.zero?

    mid = count / 2

    if count.odd?
      Employee.order(:salary).offset(mid).limit(1).pick(:salary)&.to_f
    else
      values = Employee.order(:salary).offset(mid - 1).limit(2).pluck(:salary)
      ((values[0] + values[1]) / 2.0).to_f.round(2)
    end
  end
end
