module ErrorHandler
  extend ActiveSupport::Concern

  included do
    rescue_from ActiveRecord::RecordNotFound, with: :handle_not_found
    rescue_from ActiveRecord::RecordInvalid, with: :handle_unprocessable
    rescue_from ActionController::ParameterMissing, with: :handle_bad_request
  end

  private

  def handle_not_found(exception)
    render json: { error: exception.message }, status: :not_found
  end

  def handle_unprocessable(exception)
    render json: { errors: exception.record.errors.full_messages }, status: :unprocessable_entity
  end

  def handle_bad_request(exception)
    render json: { error: exception.message }, status: :bad_request
  end
end
