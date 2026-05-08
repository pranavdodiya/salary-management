require 'rails_helper'

RSpec.describe 'Salary Insights API', type: :request do
  before do
    create(:employee, country: 'India', job_title: 'Software Engineer', salary: 50000, department: 'Engineering')
    create(:employee, country: 'India', job_title: 'Software Engineer', salary: 70000, department: 'Engineering')
    create(:employee, country: 'India', job_title: 'Product Manager', salary: 90000, department: 'Product')
    create(:employee, country: 'USA', job_title: 'Software Engineer', salary: 120000, department: 'Engineering')
    create(:employee, country: 'USA', job_title: 'Data Scientist', salary: 110000, department: 'Data')
    create(:employee, country: 'UK', job_title: 'Software Engineer', salary: 80000, department: 'Engineering')
  end

  describe 'GET /api/v1/salary_insights' do
    it 'returns overall salary statistics' do
      get '/api/v1/salary_insights'
      expect(response).to have_http_status(200)
      expect(json['overall']).to include('min_salary', 'max_salary', 'average_salary', 'median_salary', 'total_employees')
    end

    it 'returns correct overall values' do
      get '/api/v1/salary_insights'
      overall = json['overall']
      expect(overall['min_salary']).to eq(50000.0)
      expect(overall['max_salary']).to eq(120000.0)
      expect(overall['total_employees']).to eq(6)
    end
  end

  describe 'GET /api/v1/salary_insights/by_country' do
    it 'returns salary stats grouped by country' do
      get '/api/v1/salary_insights/by_country'
      expect(response).to have_http_status(200)
      india = json['data'].find { |d| d['country'] == 'India' }
      expect(india['employee_count']).to eq(3)
    end

    it 'filters by specific country' do
      get '/api/v1/salary_insights/by_country', params: { country: 'India' }
      expect(json['data'].length).to eq(1)
      expect(json['data'][0]['min_salary']).to eq(50000.0)
    end
  end

  describe 'GET /api/v1/salary_insights/by_job_title' do
    it 'returns average salary by job title within a country' do
      get '/api/v1/salary_insights/by_job_title', params: { country: 'India' }
      expect(response).to have_http_status(200)
      se = json['data'].find { |d| d['job_title'] == 'Software Engineer' }
      expect(se['average_salary']).to eq(60000.0)
      expect(se['employee_count']).to eq(2)
    end
  end

  describe 'GET /api/v1/salary_insights/by_department' do
    it 'returns salary stats grouped by department' do
      get '/api/v1/salary_insights/by_department'
      expect(response).to have_http_status(200)
      eng = json['data'].find { |d| d['department'] == 'Engineering' }
      expect(eng['employee_count']).to eq(4)
    end
  end

  describe 'GET /api/v1/salary_insights/salary_ranges' do
    it 'returns salary distribution in ranges' do
      get '/api/v1/salary_insights/salary_ranges'
      expect(response).to have_http_status(200)
      expect(json['data']).to be_an(Array)
      expect(json['data'].first).to include('range', 'count')
    end
  end

  describe 'GET /api/v1/salary_insights/top_earners' do
    it 'returns top paid employees' do
      get '/api/v1/salary_insights/top_earners', params: { limit: 3 }
      expect(response).to have_http_status(200)
      expect(json['data'].length).to eq(3)
      expect(json['data'].first['salary']).to be >= json['data'].last['salary']
    end

    it 'caps limit at 50' do
      get '/api/v1/salary_insights/top_earners', params: { limit: 100 }
      expect(json['data'].length).to be <= 50
    end
  end

  describe 'GET /api/v1/salary_insights/country_payroll' do
    it 'returns total payroll per country' do
      get '/api/v1/salary_insights/country_payroll'
      expect(response).to have_http_status(200)
      expect(json['data'].first).to include('country', 'total_payroll', 'employee_count')
    end
  end

  describe 'GET /api/v1/salary_insights/countries' do
    it 'returns list of distinct countries' do
      get '/api/v1/salary_insights/countries'
      expect(json['data']).to include('India', 'USA', 'UK')
    end
  end

  describe 'GET /api/v1/salary_insights/job_titles' do
    it 'returns list of distinct job titles' do
      get '/api/v1/salary_insights/job_titles'
      expect(json['data']).to include('Software Engineer', 'Product Manager')
    end
  end

  describe 'GET /api/v1/salary_insights/departments' do
    it 'returns list of distinct departments' do
      get '/api/v1/salary_insights/departments'
      expect(json['data']).to include('Engineering', 'Product', 'Data')
    end
  end

  def json
    JSON.parse(response.body)
  end
end
