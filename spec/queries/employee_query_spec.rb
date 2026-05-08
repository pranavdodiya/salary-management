require 'rails_helper'

RSpec.describe EmployeeQuery do
  let!(:india_eng) { create(:employee, country: 'India', job_title: 'Engineer', department: 'Engineering', salary: 50000) }
  let!(:india_pm) { create(:employee, country: 'India', job_title: 'Manager', department: 'Product', salary: 90000) }
  let!(:usa_eng) { create(:employee, country: 'USA', job_title: 'Engineer', department: 'Engineering', salary: 120000) }

  describe '#filter' do
    it 'filters by country' do
      result = described_class.new.filter(country: 'India').results
      expect(result.count).to eq(2)
    end

    it 'filters by job_title' do
      result = described_class.new.filter(job_title: 'Engineer').results
      expect(result.count).to eq(2)
    end

    it 'filters by department' do
      result = described_class.new.filter(department: 'Engineering').results
      expect(result.count).to eq(2)
    end

    it 'combines multiple filters' do
      result = described_class.new.filter(country: 'India', job_title: 'Engineer').results
      expect(result.count).to eq(1)
      expect(result.first).to eq(india_eng)
    end

    it 'returns all when no filters' do
      result = described_class.new.filter({}).results
      expect(result.count).to eq(3)
    end
  end

  describe '#sorted' do
    it 'sorts by salary ascending' do
      result = described_class.new.sorted(sort_by: 'salary', sort_direction: 'asc').results
      expect(result.first).to eq(india_eng)
    end

    it 'sorts by salary descending' do
      result = described_class.new.sorted(sort_by: 'salary', sort_direction: 'desc').results
      expect(result.first).to eq(usa_eng)
    end

    it 'rejects invalid sort columns (SQL injection prevention)' do
      result = described_class.new.sorted(sort_by: 'DROP TABLE employees', sort_direction: 'asc').results
      expect(result).to be_present
    end

    it 'defaults to created_at for invalid columns' do
      result = described_class.new.sorted(sort_by: 'invalid', sort_direction: 'desc').results
      expect(result.count).to eq(3)
    end
  end

  describe '#paginate' do
    it 'returns paginated results with meta' do
      result = described_class.new.paginate(page: 1, per_page: 2)
      expect(result[:data].count).to eq(2)
      expect(result[:meta][:total_count]).to eq(3)
      expect(result[:meta][:total_pages]).to eq(2)
    end

    it 'caps per_page at 100' do
      result = described_class.new.paginate(page: 1, per_page: 999)
      expect(result[:meta][:per_page]).to eq(100)
    end

    it 'enforces minimum page of 1' do
      result = described_class.new.paginate(page: -5, per_page: 20)
      expect(result[:meta][:page]).to eq(1)
    end

    it 'enforces minimum per_page of 1' do
      result = described_class.new.paginate(page: 1, per_page: 0)
      expect(result[:meta][:per_page]).to eq(1)
    end
  end
end
