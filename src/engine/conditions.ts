import type { Condition, LifeState } from './types'
const cmp = (a: number, op: '<'|'<='|'='|'>='|'>', b: number) => op === '<' ? a < b : op === '<=' ? a <= b : op === '=' ? a === b : op === '>=' ? a >= b : a > b
export function evaluateCondition(c: Condition | undefined, s: LifeState): boolean {
  if (!c) return true
  if ('all' in c) return c.all.every(x => evaluateCondition(x, s))
  if ('any' in c) return c.any.some(x => evaluateCondition(x, s))
  if ('not' in c) return !evaluateCondition(c.not, s)
  if ('age' in c) return cmp(s.year - s.person.birthYear, c.age, c.value)
  if ('stat' in c) return cmp(s.person[c.stat], c.op, c.value)
  if ('flag' in c) return (s.person.flags[c.flag] ?? false) === (c.value ?? true)
  if ('gender' in c) return s.person.gender === c.gender
  if ('province' in c) return Array.isArray(c.province) ? c.province.includes(s.person.province) : s.person.province === c.province
  if ('relativeAlive' in c) return s.person.relatives.some(r => r.role === c.relativeAlive && r.alive)
  if ('household' in c) return s.person.householdType === c.household
  if ('householdMoney' in c) return cmp(s.person.householdMoney,c.householdMoney,c.value)
  if ('householdDebt' in c) return cmp(s.person.debt,c.householdDebt,c.value)
  if ('householdLandRai' in c) return cmp(s.person.householdLandRai,c.householdLandRai,c.value)
  if ('children' in c) return cmp(s.person.children,c.children,c.value)
  if ('siblingCount' in c) return cmp(s.person.siblingCount,c.siblingCount,c.value)
  if ('birthOrder' in c) return cmp(s.person.birthOrder,c.birthOrder,c.value)
  return cmp(s.region[`${c.regionAccess === 'jobs' ? 'job' : c.regionAccess}Access` as 'schoolAccess'|'hospitalAccess'|'jobAccess'], c.op, c.value)
}
