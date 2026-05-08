module Api
  module V1
    class SalaryInsightsController < ApplicationController
      def index
        render json: { overall: service.overall }
      end

      def by_country
        render json: { data: service.by_country(country: params[:country]) }
      end

      def by_job_title
        render json: { data: service.by_job_title(country: params[:country]) }
      end

      def by_department
        render json: { data: service.by_department }
      end

      def salary_ranges
        render json: { data: service.salary_ranges }
      end

      def top_earners
        limit = [[params.fetch(:limit, 10).to_i, 1].max, 50].min
        render json: { data: service.top_earners(limit: limit) }
      end

      def country_payroll
        render json: { data: service.country_payroll }
      end

      def countries
        render json: { data: service.countries }
      end

      def job_titles
        render json: { data: service.job_titles }
      end

      def departments
        render json: { data: service.departments }
      end

      private

      def service
        @service ||= SalaryInsightsService.new
      end
    end
  end
end
