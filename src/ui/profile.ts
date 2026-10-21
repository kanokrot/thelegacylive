export function occupationLabel(age: number, occupation: string, householdType: string, workMinAge: number, notYetWorking: string): string {
  if (age < workMinAge) return notYetWorking
  return occupation || householdType
}
