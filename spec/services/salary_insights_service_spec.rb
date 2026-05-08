require 'rails_helper'

RSpec.describe SalaryInsightsService do
  subject(:service) { described_class.new }

  describe '#overall' do
    context 'with no employees' do
      it 'returns nil values gracefully' do
        result = service.overall
        expect(result[:total_employees]).to eq(0)
        expect(result[:min_salary]).to be_nil
        expect(result[:median_salary]).to be_nil
      end
    end

    context 'with employees' do
      before do
        create(:employee, salary: 50000)
        create(:employee, salary: 100000)
        create(:employee, salary: 75000)
      end

      it 'calculates correct overall statistics' do
        result = service.overall
        expect(result[:min_salary]).to eq(50000.0)
        expect(result[:max_salary]).to eq(100000.0)
        expect(result[:average_salary]).to eq(75000.0)
        expect(result[:median_salary]).to eq(75000.0)
        expect(result[:total_employees]).to eq(3)
      end
    end

    context 'with even number of employees for median' do
      before do
        create(:employee, salary: 40000)
        create(:employee, salary: 60000)
      end

      it 'calculates median as average of two middle values' do
        result = service.overall
        expect(result[:median_salary]).to eq(50000.0)
      end
    end
  end

  describe '#by_country' do
    before do
      create(:employee, country: 'India', salary: 50000)
      create(:employee, country: 'India', salary: 70000)
      create(:employee, country: 'USA', salary: 120000)
    end

    it 'groups statistics by country' do
      result = service.by_country
      expect(result.length).to eq(2)
      india = result.find { |r| r[:country] == 'India' }
      expect(india[:employee_count]).to eq(2)
      expect(india[:average_salary]).to eq(60000.0)
    end

    it 'filters by specific country' do
      result = service.by_country(country: 'USA')
      expect(result.length).to eq(1)
      expect(result.first[:country]).to eq('USA')
    end
  end

  describe '#by_job_title' do
    before do
      create(:employee, country: 'India', job_title: 'Engineer', salary: 50000)
      create(:employee, country: 'India', job_title: 'Engineer', salary: 70000)
      create(:employee, country: 'India', job_title: 'Manager', salary: 90000)
    end

    it 'groups statistics by job title' do
      result = service.by_job_title
      engineer = result.find { |r| r[:job_title] == 'Engineer' }
      expect(engineer[:average_salary]).to eq(60000.0)
      expect(engineer[:employee_count]).to eq(2)
    end

    it 'filters by country' do
      create(:employee, country: 'USA', job_title: 'Engineer', salary: 120000)
      result = service.by_job_title(country: 'India')
      engineer = result.find { |r| r[:job_title] == 'Engineer' }
      expect(engineer[:average_salary]).to eq(60000.0)
    end
  end

  describe '#salary_ranges' do
    before do
      create(:employee, salary: 25000)
      create(:employee, salary: 45000)
      create(:employee, salary: 80000)
      create(:employee, salary: 160000)
    end

    it 'distributes employees into salary brackets' do
      result = service.salary_ranges
      expect(result).to be_an(Array)
      low = result.find { |r| r[:range] == '0 - 30K' }
      expect(low[:count]).to eq(1)
      high = result.find { |r| r[:range] == '150K+' }
      expect(high[:count]).to eq(1)
    end

    it 'returns all ranges even when empty' do
      Employee.delete_all
      result = service.salary_ranges
      expect(result.length).to eq(6)
      expect(result.all? { |r| r[:count] == 0 }).to be true
    end
  end

  describe '#top_earners' do
    before do
      create(:employee, salary: 50000)
      create(:employee, salary: 200000)
      create(:employee, salary: 150000)
    end

    it 'returns employees ordered by salary descending' do
      result = service.top_earners(limit: 2)
      expect(result.length).to eq(2)
      expect(result.first[:salary]).to eq(200000.0)
      expect(result.last[:salary]).to eq(150000.0)
    end
  end

  describe '#country_payroll' do
    before do
      create(:employee, country: 'India', salary: 50000)
      create(:employee, country: 'India', salary: 70000)
      create(:employee, country: 'USA', salary: 120000)
    end

    it 'returns total payroll per country ordered by total' do
      result = service.country_payroll
      india = result.find { |r| r[:country] == 'India' }
      expect(india[:total_payroll]).to eq(120000.0)
    end
  end

  describe '#countries' do
    it 'returns distinct sorted countries' do
      create(:employee, country: 'USA')
      create(:employee, country: 'India')
      expect(service.countries).to eq(['India', 'USA'])
    end
  end

  describe '#departments' do
    it 'returns distinct sorted departments' do
      create(:employee, department: 'Engineering')
      create(:employee, department: 'Product')
      expect(service.departments).to eq(['Engineering', 'Product'])
    end
  end
end
