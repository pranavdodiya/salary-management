class EmployeeQuery
  attr_reader :relation

  def initialize(relation = Employee.all)
    @relation = relation
  end

  def filter(params)
    @relation = relation.by_country(params[:country])
    @relation = relation.by_job_title(params[:job_title])
    @relation = relation.by_department(params[:department])
    @relation = relation.search(params[:search])
    self
  end

  def sorted(sort_by: 'created_at', sort_direction: 'desc')
    column = sanitize_sort_column(sort_by)
    direction = sort_direction.to_s.downcase == 'asc' ? :asc : :desc
    @relation = relation.order(column => direction)
    self
  end

  def paginate(page:, per_page:)
    page = [page.to_i, 1].max
    per_page = [[per_page.to_i, 1].max, 100].min

    total_count = relation.count
    records = relation.offset((page - 1) * per_page).limit(per_page)

    {
      data: records,
      meta: {
        total_count: total_count,
        page: page,
        per_page: per_page,
        total_pages: (total_count.to_f / per_page).ceil
      }
    }
  end

  def results
    relation
  end

  private

  SORTABLE_COLUMNS = %w[first_name last_name salary country job_title department date_of_joining created_at].freeze

  def sanitize_sort_column(column)
    SORTABLE_COLUMNS.include?(column.to_s) ? column.to_s : 'created_at'
  end
end
