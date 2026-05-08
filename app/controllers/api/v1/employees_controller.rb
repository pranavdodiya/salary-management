module Api
  module V1
    class EmployeesController < ApplicationController
      before_action :set_employee, only: [:show, :update, :destroy]

      def index
        result = EmployeeQuery.new
                   .filter(filter_params)
                   .sorted(sort_by: params[:sort_by], sort_direction: params[:sort_direction])
                   .paginate(page: params[:page] || 1, per_page: params[:per_page] || 20)

        render json: {
          data: EmployeeSerializer.collection(result[:data]),
          meta: result[:meta]
        }
      end

      def show
        render json: EmployeeSerializer.new(@employee).as_json
      end

      def create
        employee = Employee.new(employee_params)

        if employee.save
          render json: EmployeeSerializer.new(employee).as_json, status: :created
        else
          render json: { errors: employee.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        if @employee.update(employee_params)
          render json: EmployeeSerializer.new(@employee).as_json
        else
          render json: { errors: @employee.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        @employee.destroy
        head :no_content
      end

      private

      def set_employee
        @employee = Employee.find(params[:id])
      end

      def employee_params
        params.require(:employee).permit(
          :first_name, :last_name, :job_title, :country,
          :salary, :department, :date_of_joining, :email
        )
      end

      def filter_params
        params.permit(:country, :job_title, :department, :search)
      end
    end
  end
end
