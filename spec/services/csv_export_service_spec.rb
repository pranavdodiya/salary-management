require 'rails_helper'

RSpec.describe CsvExportService do
  describe '#generate' do
    let!(:employee) { create(:employee, first_name: 'John', last_name: 'Doe', salary: 75000) }

    it 'generates valid CSV with headers' do
      csv = described_class.new.generate
      rows = CSV.parse(csv, headers: true)
      expect(rows.headers).to eq(%w[ID FirstName LastName Email JobTitle Department Country Salary DateOfJoining])
    end

    it 'includes employee data' do
      csv = described_class.new.generate
      rows = CSV.parse(csv, headers: true)
      expect(rows.length).to eq(1)
      expect(rows[0]['FirstName']).to eq('John')
      expect(rows[0]['Salary']).to eq('75000.0')
    end

    it 'accepts filtered relation' do
      create(:employee, country: 'India')
      create(:employee, country: 'USA')
      csv = described_class.new(Employee.where(country: 'India')).generate
      rows = CSV.parse(csv, headers: true)
      expect(rows.all? { |r| r['Country'] == 'India' }).to be true
    end

    it 'handles empty relation' do
      Employee.delete_all
      csv = described_class.new.generate
      rows = CSV.parse(csv, headers: true)
      expect(rows.length).to eq(0)
    end
  end
end
