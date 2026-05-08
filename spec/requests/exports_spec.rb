require 'rails_helper'

RSpec.describe 'Exports API', type: :request do
  describe 'GET /api/v1/exports/employees' do
    let!(:employees) { create_list(:employee, 3) }

    it 'returns a CSV file' do
      get '/api/v1/exports/employees'
      expect(response).to have_http_status(200)
      expect(response.content_type).to include('text/csv')
    end

    it 'includes all employees in CSV' do
      get '/api/v1/exports/employees'
      rows = CSV.parse(response.body, headers: true)
      expect(rows.length).to eq(3)
    end

    it 'sets proper filename in Content-Disposition header' do
      get '/api/v1/exports/employees'
      expect(response.headers['Content-Disposition']).to include("employees_#{Date.today.iso8601}.csv")
    end

    it 'supports filtering in export' do
      create(:employee, country: 'TestCountry')
      get '/api/v1/exports/employees', params: { country: 'TestCountry' }
      rows = CSV.parse(response.body, headers: true)
      expect(rows.length).to eq(1)
      expect(rows[0]['Country']).to eq('TestCountry')
    end
  end
end
