module Searchable
  extend ActiveSupport::Concern

  included do
    scope :search, ->(query) {
      return all unless query.present?

      sanitized = sanitize_sql_like(query)
      where(
        "first_name LIKE :q OR last_name LIKE :q OR email LIKE :q",
        q: "%#{sanitized}%"
      )
    }
  end
end
