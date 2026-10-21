// TODO: replace with NSO / World Bank data. Every value here is a tunable game placeholder.
export const balance = {
  yearMax: 2026, maxAge: { value: 105, provenance: { type: 'design', reason: 'Simulation endpoint; death is forced at this ceiling to prevent unbounded lives.' } }, maxStat: 100, minStat: 0, yearOffsetBE: 543,
  stages: { childhood: 12, teen: 19, youngAdult: 35, midLife: 59 }, nameEraBreaks: [1980,2000] as const,
  milestoneAges:{earlyHealth:[0,2],schoolStart:[6,8],farmWork:[8,12],gradeSix:[12,12],gradeNine:[15,16],gradeTwelve:[18,19],migration:[16,19],conscription:20},
  // TODO(verify): placeholder game weights, not demographic estimates; all genders have equal birth-roll weight.
  genderWeights:[1,1,1] as const,
  // TODO(verify): background weights are placeholders, not measured population shares.
  householdWeights:[1,1,1,1,1,1,1,1,1] as const,relativeHealth:[55,95] as const,relativeRelationship:[35,90] as const,affinityRange:[-20,30] as const,childFarmWorkAge:16,
  provinceWeights: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1] as const,
  stats: { health: [45, 99], wellbeing: [40, 80], knowledge: [0, 35], relationships: [35, 85], careBurden: [0, 25], aptitude: [20, 95], diligence: [20, 95], temperament: [20, 95] },
  startingMoney: [0, 50], startingDebt: [0, 40], startingPersonalDebt:[0,10], rai: [0, 30], householdTypes: ['ทำนา', 'รับจ้าง', 'ค้าขายเล็ก ๆ', 'ข้าราชการชั้นผู้น้อย', 'ประมงน้ำจืด', 'งานฝีมือ', 'แรงงานในเมือง', 'ค้าขายครอบครัวไทยเชื้อสายจีน', 'ข้าราชการในเมือง'],
  startingHouseholdMoney: [8, 55], siblingCount: [0, 5], relativeLife: { parentMother: [22, 42], parentFather: [24, 45], grandmother: [55, 82], grandfather: [55, 85], siblingAge: [0, 15], extendedAge: [20, 75], marriageAge: 18, marriageChance: 0.04, deathAge: 92, migrationChance: 0.004 },
  mortality: {
    childAgeLimit: { value: 15, provenance: { type: 'sourced', sourceId: 'MORT09', year: 2024, ageBand: '0-14', reason: 'DDC reports child drowning surveillance under age fifteen.' } },
    maxAnnualRisk: { value: 0.65, provenance: { type: 'design', reason: 'Hard safety ceiling for the game risk roll; the source rates are observational, not individual predictions.' } },
    maxModifier: { value: 1.1, provenance: { type: 'design', reason: 'Caps the combined player and childhood context modifiers to limit distortion of the sourced baseline.' } },
    lowHealthThreshold: { value: 25, provenance: { type: 'design', reason: 'Game stat threshold used only for the illustrative risk modifier.' } },
    lowHealthMultiplier: { value: 1.03, provenance: { type: 'design', reason: 'Very small illustrative modifier; not an epidemiological effect estimate.' } },
    highDebtThreshold: { value: 60, provenance: { type: 'design', reason: 'Game debt scale threshold.' } },
    highDebtMultiplier: { value: 1.01, provenance: { type: 'design', reason: 'Minimal illustrative modifier; not a claim that debt causes mortality.' } },
    highCareBurdenThreshold: { value: 60, provenance: { type: 'design', reason: 'Game care-burden scale threshold.' } },
    highCareBurdenMultiplier: { value: 1.01, provenance: { type: 'design', reason: 'Minimal illustrative modifier; not an epidemiological effect estimate.' } },
    migratedRoadMultiplier: { value: 1.01, provenance: { type: 'design', reason: 'Illustrative exposure modifier only; no migration-specific mortality estimate is claimed.' } },
    hazardousWorkMultiplier: { value: 1.03, provenance: { type: 'design', sourceId: 'MORT08', reason: 'Very small conservative direction for an explicitly flagged hazardous occupation; magnitude is game tuning.' } },
    motorcycleMultiplier: { value: 1.04, provenance: { type: 'design', sourceId: 'MORT08', reason: 'Very small conservative direction for an explicitly flagged motorcycle exposure; magnitude is game tuning, not a measured multiplier.' } },
    childLowHouseholdMultiplier: { value: 1.01, provenance: { type: 'design', sourceId: 'MORT09', reason: 'Minimal childhood context modifier; magnitude is game tuning and does not assign blame.' } },
    childFarmOrFishingMultiplier: { value: 1.01, provenance: { type: 'design', sourceId: 'MORT09', reason: 'Minimal exposure proxy for fictional household context; magnitude is game tuning.' } }
  },
  annual: { healthDecay: 0.18, healthVariation:0.8,farmHealth:0.15, debtInterest: 0.035, moneyRange: 3, quietYearChance: 0.45, secondEventChance: 0.22, riceIncomePerRai: 0.12, householdIncome: 1, migrantRemittance: 5, relativeAgeGate:65,relativeDeathBase:0.002,relativeDeathPerYear:0.001,migrationMinAge:17,workMinAge:20,harvestAgeLimit:20 },
  access: { school: 0.56, hospital: 0.42, jobs: 0.38, lowSchoolThreshold: 0.45, lowHospitalThreshold:0.45, lowJobThreshold: 0.35, distanceCost: 3 },
  routineAges:{library:[8,12] as const,siblingExam:[7,12] as const,examTrip:[13,19] as const,factoryInterview:[15,19] as const},
  migration: { travelCost: 8, homeRelationshipCost: 3, remittance: 5 },
  migrationDestinations: { bangkok: 'กรุงเทพฯ', east: 'เขตอุตสาหกรรมฝั่งตะวันออก' },
  genderCareCost: 3, genderExpectationCosts:{female:3,male:1,other:3}, birthOrderCost: 2, lowWealthThreshold: 20, choiceCost: 2, yearsPerTurn: 1,
  cards: { routineWeight:2,milestoneWeight:4,lowWeight:1 },
  // TODO: tune the effects through play simulation and replace with verified data where applicable.
  eventDeltas: {
    health:{'-2':-2,'-1':-1,'1':1,'2':2,'3':3,'5':5,'7':7},wellbeing:{'-2':-2,'-1':-1,'1':1,'2':2,'3':3},knowledge:{'-1':-1,'1':1,'2':2,'3':3,'4':4,'5':5,'6':6},
    relationships:{'-2':-2,'-1':-1,'1':1,'2':2,'3':3,'4':4},careBurden:{'-1':-1,'1':1,'2':2,'3':3,'5':5},
    aptitude:{'2':2},diligence:{'2':2},temperament:{},money:{'-5':-5,'-4':-4,'-3':-3,'-2':-2,'-1':-1,'0':0,'1':1,'2':2,'3':3,'4':4,'5':5,'6':6,'7':7},debt:{'0':0,'7':7,'8':8},
  } as Record<string,Record<string,number>>,
  world: { seed:91357, sampleLives:36, birthsLow:2, birthsHigh:28, liveCountWindowMs:60000, birthWindowMs:180000, maxCatchupSteps:4, populationLimit:200 },
  collection: { lockedSlots:3,maxEntries:24 },
} as const;
