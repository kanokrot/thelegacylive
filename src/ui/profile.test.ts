import { describe, expect, it } from 'vitest'
import { balance, occupations } from '../content'
import { ui } from '../content/ui'
import { occupationLabel } from './profile'

describe('profile occupation label', () => {
  it('uses the not-yet-working label before working age', () => {
    const notYetWorking = ui.notYetWorking
    const farmHousehold = balance.householdTypes[0]
    expect(occupationLabel(12, '', farmHousehold, balance.annual.workMinAge, notYetWorking)).toBe(notYetWorking)
    expect(occupationLabel(16, occupations.farmWork, farmHousehold, balance.annual.workMinAge, notYetWorking)).toBe(notYetWorking)
  })

  it('shows the occupation or household work type from working age onward', () => {
    const notYetWorking = ui.notYetWorking
    const workMinAge = balance.annual.workMinAge
    const farmHousehold = balance.householdTypes[0]
    expect(occupationLabel(workMinAge, occupations.urbanWork, balance.householdTypes[1], workMinAge, notYetWorking)).toBe(occupations.urbanWork)
    expect(occupationLabel(workMinAge, '', farmHousehold, workMinAge, notYetWorking)).toBe(farmHousehold)
  })
})
