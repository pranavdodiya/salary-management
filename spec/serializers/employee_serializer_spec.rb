require 'rails_helper'

RSpec.describe EmployeeSerializer do
  describe '#as_json' do
    let(:employee) { create(:employee, first_name: 'Jane', last_name: 'Doe', salary: 85000) }
    subject(:serialized) { described_class.new(employee).as_json }

    it 'includes all expected fields' do
      expect(serialized).to include(
        :id, :first_name, :last_name, :full_name, :job_title,
        :country, :salary, :department, :date_of_joining, :email,
        :created_at, :updated_at
      )
    end

    it 'computes full_name' do
      expect(serialized[:full_name]).to eq('Jane Doe')
    end

    it 'formats salary as float' do
      expect(serialized[:salary]).to be_a(Float)
      expect(serialized[:salary]).to eq(85000.0)
    end

    it 'does not expose internal attributes' do
      expect(serialized).not_to have_key(:password)
      expect(serialized).not_to have_key(:password_digest)
    end
  end

  describe '.collection' do
    let!(:employees) { create_list(:employee, 3) }

    it 'serializes a collection of employees' do
      result = described_class.collection(employees)
      expect(result).to be_an(Array)
      expect(result.length).to eq(3)
      expect(result.first).to include(:id, :full_name)
    end
  end
end
