module Api
  module V1
    class ExportsController < ApplicationController
      def employees_csv
        employees = EmployeeQuery.new.filter(filter_params).results
        csv_data = CsvExportService.new(employees).generate

        send_data csv_data,
                  filename: "employees_#{Date.today.iso8601}.csv",
                  type: 'text/csv',
                  disposition: 'attachment'
      end

      private

      def filter_params
        params.permit(:country, :job_title, :department, :search)
      end
    end
  end
end
