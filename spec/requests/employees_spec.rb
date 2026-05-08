require 'rails_helper'

RSpec.describe 'Employees API', type: :request do
  let!(:employees) { create_list(:employee, 5) }
  let(:employee) { employees.first }
  let(:employee_id) { employee.id }

  describe 'GET /api/v1/employees' do
    before { get '/api/v1/employees' }

    it 'returns employees' do
      expect(json['data']).not_to be_empty
    end

    it 'returns status code 200' do
      expect(response).to have_http_status(200)
    end

    it 'returns paginated results with meta' do
      expect(json['meta']).to include('total_count', 'page', 'per_page', 'total_pages')
    end

    it 'caps per_page at 100' do
      get '/api/v1/employees', params: { per_page: 999 }
      expect(json['meta']['per_page']).to eq(100)
    end
  end

  describe 'GET /api/v1/employees with filters' do
    let!(:indian_employee) { create(:employee, country: 'India', job_title: 'Engineer', department: 'Engineering') }

    it 'filters by country' do
      get '/api/v1/employees', params: { country: 'India' }
      expect(json['data'].all? { |e| e['country'] == 'India' }).to be true
    end

    it 'filters by job_title' do
      get '/api/v1/employees', params: { job_title: 'Engineer' }
      expect(json['data'].all? { |e| e['job_title'] == 'Engineer' }).to be true
    end

    it 'filters by department' do
      get '/api/v1/employees', params: { department: 'Engineering' }
      expect(json['data'].all? { |e| e['department'] == 'Engineering' }).to be true
    end

    it 'searches by name' do
      get '/api/v1/employees', params: { search: indian_employee.first_name }
      expect(json['data'].length).to be >= 1
    end

    it 'supports sorting' do
      get '/api/v1/employees', params: { sort_by: 'salary', sort_direction: 'desc' }
      salaries = json['data'].map { |e| e['salary'] }
      expect(salaries).to eq(salaries.sort.reverse)
    end
  end

  describe 'GET /api/v1/employees/:id' do
    before { get "/api/v1/employees/#{employee_id}" }

    context 'when the record exists' do
      it 'returns the employee' do
        expect(json['id']).to eq(employee_id)
      end

      it 'returns status code 200' do
        expect(response).to have_http_status(200)
      end

      it 'includes full_name in response' do
        expect(json['full_name']).to eq(employee.full_name)
      end
    end

    context 'when the record does not exist' do
      let(:employee_id) { 999 }

      it 'returns status code 404' do
        expect(response).to have_http_status(404)
      end

      it 'returns a not found message' do
        expect(json['error']).to match(/Couldn't find Employee/)
      end
    end
  end

  describe 'POST /api/v1/employees' do
    let(:valid_attributes) do
      {
        employee: {
          first_name: 'Jane',
          last_name: 'Doe',
          job_title: 'Software Engineer',
          country: 'India',
          salary: 85000,
          department: 'Engineering',
          date_of_joining: '2023-01-15',
          email: 'jane.doe@example.com'
        }
      }
    end

    context 'when the request is valid' do
      before { post '/api/v1/employees', params: valid_attributes }

      it 'creates an employee' do
        expect(json['first_name']).to eq('Jane')
      end

      it 'returns status code 201' do
        expect(response).to have_http_status(201)
      end
    end

    context 'when the request is invalid' do
      before { post '/api/v1/employees', params: { employee: { first_name: '' } } }

      it 'returns status code 422' do
        expect(response).to have_http_status(422)
      end

      it 'returns validation errors' do
        expect(json['errors']).not_to be_empty
      end
    end

    context 'when email is duplicate' do
      before do
        create(:employee, email: 'duplicate@test.com')
        post '/api/v1/employees', params: {
          employee: valid_attributes[:employee].merge(email: 'duplicate@test.com')
        }
      end

      it 'returns status code 422' do
        expect(response).to have_http_status(422)
      end

      it 'returns email uniqueness error' do
        expect(json['errors']).to include('Email has already been taken')
      end
    end
  end

  describe 'PUT /api/v1/employees/:id' do
    let(:valid_attributes) { { employee: { first_name: 'Updated' } } }

    before { put "/api/v1/employees/#{employee_id}", params: valid_attributes }

    it 'updates the record' do
      expect(json['first_name']).to eq('Updated')
    end

    it 'returns status code 200' do
      expect(response).to have_http_status(200)
    end
  end

  describe 'DELETE /api/v1/employees/:id' do
    before { delete "/api/v1/employees/#{employee_id}" }

    it 'returns status code 204' do
      expect(response).to have_http_status(204)
    end

    it 'deletes the employee' do
      expect(Employee.find_by(id: employee_id)).to be_nil
    end
  end

  def json
    JSON.parse(response.body)
  end
end
