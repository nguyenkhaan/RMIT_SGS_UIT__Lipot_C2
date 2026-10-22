import type { PackageTag, RentalPackageType } from '../rental-passport/contracts'

export interface IncomePayload {
  applicantName: string
  employer: string
  employmentType: string
  monthlyIncome: number
  currency: string
  payslipPeriod: string
}

export interface ReferencePayload {
  applicantName: string
  previousProperty: string
  tenancyPeriod: string
  referenceName: string
  paymentHistory: string
}

export const SYNTHETIC_INCOME_DATA: IncomePayload = {
  applicantName: 'Alex Morgan',
  employer: 'Northstar Studio',
  employmentType: 'Full-time',
  monthlyIncome: 7200,
  currency: 'AUD',
  payslipPeriod: 'September 2026',
}

export const SYNTHETIC_REFERENCE_DATA: ReferencePayload = {
  applicantName: 'Alex Morgan',
  previousProperty: '42 Example Lane',
  tenancyPeriod: 'January 2024 to September 2026',
  referenceName: 'Jordan Lee',
  paymentHistory: 'Paid on time',
}

export const TAG_MAPPING: Record<
  RentalPackageType,
  {
    tag: PackageTag
    recipientId: string
    recipientName: string
    requiredDecryptRole: string
  }
> = {
  income: {
    tag: 'income_manager_a',
    recipientId: 'manager-a',
    recipientName: 'Manager A (Priya Shah)',
    requiredDecryptRole: '_tide_income_manager_a.selfdecrypt',
  },
  reference: {
    tag: 'reference_manager_b',
    recipientId: 'manager-b',
    recipientName: 'Manager B (Noah Williams)',
    requiredDecryptRole: '_tide_reference_manager_b.selfdecrypt',
  },
}
