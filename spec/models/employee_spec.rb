require 'rails_helper'

RSpec.describe Employee, type: :model do
  describe 'validations' do
    subject { build(:employee) }

    it { should validate_presence_of(:first_name) }
    it { should validate_presence_of(:last_name) }
    it { should validate_presence_of(:job_title) }
    it { should validate_presence_of(:country) }
    it { should validate_presence_of(:salary) }
    it { should validate_numericality_of(:salary).is_greater_than(0) }
    it { should validate_presence_of(:date_of_joining) }
    it { should validate_presence_of(:email) }
    it { should validate_uniqueness_of(:email).case_insensitive }

    it 'validates email format' do
      employee = build(:employee, email: 'invalid-email')
      expect(employee).not_to be_valid
      expect(employee.errors[:email]).to include('must be a valid email address')
    end

    it 'accepts valid email format' do
      employee = build(:employee, email: 'test@example.com')
      expect(employee).to be_valid
    end
  end

  describe '#full_name' do
    it 'returns first_name and last_name concatenated' do
      employee = build(:employee, first_name: 'John', last_name: 'Doe')
      expect(employee.full_name).to eq('John Doe')
    end
  end

  describe 'concerns' do
    describe 'Filterable' do
      before do
        create(:employee, country: 'India', job_title: 'Software Engineer', department: 'Engineering')
        create(:employee, country: 'India', job_title: 'Product Manager', department: 'Product')
        create(:employee, country: 'USA', job_title: 'Software Engineer', department: 'Engineering')
      end

      describe '.by_country' do
        it 'filters employees by country' do
          expect(Employee.by_country('India').count).to eq(2)
        end

        it 'returns all employees when country is nil' do
          expect(Employee.by_country(nil).count).to eq(3)
        end
      end

      describe '.by_job_title' do
        it 'filters employees by job title' do
          expect(Employee.by_job_title('Software Engineer').count).to eq(2)
        end

        it 'returns all employees when job_title is nil' do
          expect(Employee.by_job_title(nil).count).to eq(3)
        end
      end

      describe '.by_department' do
        it 'filters employees by department' do
          expect(Employee.by_department('Engineering').count).to eq(2)
        end

        it 'returns all employees when department is nil' do
          expect(Employee.by_department(nil).count).to eq(3)
        end
      end
    end

    describe 'Searchable' do
      let!(:employee) { create(:employee, first_name: 'Unique', last_name: 'Person', email: 'unique@test.com') }

      it 'searches by first name' do
        expect(Employee.search('Unique')).to include(employee)
      end

      it 'searches by email' do
        expect(Employee.search('unique@test')).to include(employee)
      end

      it 'returns all when query is blank' do
        create(:employee)
        expect(Employee.search(nil).count).to eq(2)
      end
    end
  end

  describe 'database columns' do
    it { should have_db_column(:first_name).of_type(:string) }
    it { should have_db_column(:last_name).of_type(:string) }
    it { should have_db_column(:job_title).of_type(:string) }
    it { should have_db_column(:country).of_type(:string) }
    it { should have_db_column(:salary).of_type(:decimal) }
    it { should have_db_column(:department).of_type(:string) }
    it { should have_db_column(:date_of_joining).of_type(:date) }
    it { should have_db_column(:email).of_type(:string) }
  end

  describe 'database indexes' do
    it { should have_db_index(:country) }
    it { should have_db_index(:job_title) }
    it { should have_db_index(:department) }
    it { should have_db_index(:email).unique(true) }
    it { should have_db_index([:country, :job_title]) }
    it { should have_db_index([:country, :department]) }
  end
end
