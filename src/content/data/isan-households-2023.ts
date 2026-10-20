/**
 * Official provincial data for Isan, stored as source facts rather than game
 * balance values. Amounts are nominal baht per month unless stated otherwise.
 *
 * Household income/size: NSO Household Socio-Economic Survey, 2023 (2566),
 * Provincial Household Income and Income Distribution report, table 3.
 * Household debt: same NSO survey/report, supplementary table 6; debt amount
 * is the average per all households (not only indebted households).
 * Poverty: NESDC estimates, reproduced in NSO Thai Economic Indicators 2025,
 * table 11.8; a dash in the source is kept as null, never treated as zero.
 *
 * These are survey estimates for 2023, not historical values and not direct
 * modifiers for the simulation. Keep source year and measure with every field.
 */
export const isanHouseholds2023Source = {
  income: {
    organization: 'National Statistical Office of Thailand',
    surveyYearBE: 2566,
    table: 'Table 3: Average Monthly Household Income by Province',
    url: 'https://www.nso.go.th/public/e-book/Analytical-Reports/Income-2566/46/',
    continuationUrl: 'https://www.nso.go.th/public/e-book/Analytical-Reports/Income-2566/47/',
  },
  debt: {
    organization: 'National Statistical Office of Thailand',
    surveyYearBE: 2566,
    table: 'Supplementary Table 6: Share of Households with Debt and Average Debt per All Households',
    url: 'https://www.nso.go.th/public/e-book/Analytical-Reports/Income-2566/146/',
    continuationUrl: 'https://www.nso.go.th/public/e-book/Analytical-Reports/Income-2566/147/',
    unit: 'baht per household',
  },
  poverty: {
    organization: 'Office of the National Economic and Social Development Council',
    reproducedBy: 'National Statistical Office of Thailand',
    table: 'Thai Economic Indicators 2025, Table 11.8: Poverty Headcount Ratio of Consumption Expenditure by Province',
    url: 'https://www.nso.go.th/public/e-book/Indicators-Economic/Thai_Economic_Indicators_2025/224/',
    continuationUrl: 'https://www.nso.go.th/public/e-book/Indicators-Economic/Thai_Economic_Indicators_2025/225/',
    unit: 'percent of population',
    yearsBE: [2564, 2565, 2566],
  },
} as const

export const isanHouseholds2023 = [
  { province: 'กาฬสินธุ์', householdSize: 2.8, monthlyIncomeBaht: 20_599, monthlyRegularIncomeBaht: 20_442, perPersonIncomeBaht: 7_392, perPersonRegularIncomeBaht: 7_336, householdsWithDebtPercent: 60.5, averageDebtPerHouseholdBaht: 164_052, povertyPercent: [25.20, 18.26, 6.61] },
  { province: 'ขอนแก่น', householdSize: 2.4, monthlyIncomeBaht: 19_326, monthlyRegularIncomeBaht: 19_151, perPersonIncomeBaht: 8_023, perPersonRegularIncomeBaht: 7_950, householdsWithDebtPercent: 52.4, averageDebtPerHouseholdBaht: 62_884, povertyPercent: [0.58, 1.58, null] },
  { province: 'ชัยภูมิ', householdSize: 2.8, monthlyIncomeBaht: 22_778, monthlyRegularIncomeBaht: 22_444, perPersonIncomeBaht: 8_009, perPersonRegularIncomeBaht: 7_892, householdsWithDebtPercent: 61.3, averageDebtPerHouseholdBaht: 203_222, povertyPercent: [2.98, 1.17, 2.36] },
  { province: 'นครพนม', householdSize: 3.2, monthlyIncomeBaht: 22_099, monthlyRegularIncomeBaht: 21_684, perPersonIncomeBaht: 6_892, perPersonRegularIncomeBaht: 6_763, householdsWithDebtPercent: 60.1, averageDebtPerHouseholdBaht: 193_929, povertyPercent: [12.95, 9.77, 5.55] },
  { province: 'นครราชสีมา', householdSize: 3.0, monthlyIncomeBaht: 27_775, monthlyRegularIncomeBaht: 27_567, perPersonIncomeBaht: 9_229, perPersonRegularIncomeBaht: 9_160, householdsWithDebtPercent: 66.3, averageDebtPerHouseholdBaht: 303_257, povertyPercent: [21.01, 9.78, 7.02] },
  { province: 'บึงกาฬ', householdSize: 2.9, monthlyIncomeBaht: 25_137, monthlyRegularIncomeBaht: 24_406, perPersonIncomeBaht: 8_594, perPersonRegularIncomeBaht: 8_344, householdsWithDebtPercent: 62.9, averageDebtPerHouseholdBaht: 189_019, povertyPercent: [2.31, 1.79, 0.47] },
  { province: 'บุรีรัมย์', householdSize: 2.9, monthlyIncomeBaht: 21_961, monthlyRegularIncomeBaht: 21_813, perPersonIncomeBaht: 7_556, perPersonRegularIncomeBaht: 7_506, householdsWithDebtPercent: 61.9, averageDebtPerHouseholdBaht: 177_744, povertyPercent: [8.61, 6.64, 2.74] },
  { province: 'มหาสารคาม', householdSize: 2.5, monthlyIncomeBaht: 21_169, monthlyRegularIncomeBaht: 20_895, perPersonIncomeBaht: 8_433, perPersonRegularIncomeBaht: 8_324, householdsWithDebtPercent: 60.4, averageDebtPerHouseholdBaht: 154_313, povertyPercent: [2.24, 4.79, 0.33] },
  { province: 'มุกดาหาร', householdSize: 2.8, monthlyIncomeBaht: 24_925, monthlyRegularIncomeBaht: 22_533, perPersonIncomeBaht: 8_841, perPersonRegularIncomeBaht: 7_992, householdsWithDebtPercent: 67.0, averageDebtPerHouseholdBaht: 285_176, povertyPercent: [2.82, 11.16, 3.88] },
  { province: 'ยโสธร', householdSize: 2.8, monthlyIncomeBaht: 24_439, monthlyRegularIncomeBaht: 24_255, perPersonIncomeBaht: 8_842, perPersonRegularIncomeBaht: 8_776, householdsWithDebtPercent: 62.5, averageDebtPerHouseholdBaht: 167_342, povertyPercent: [2.57, 1.79, 1.19] },
  { province: 'ร้อยเอ็ด', householdSize: 2.8, monthlyIncomeBaht: 20_354, monthlyRegularIncomeBaht: 19_631, perPersonIncomeBaht: 7_393, perPersonRegularIncomeBaht: 7_130, householdsWithDebtPercent: 51.3, averageDebtPerHouseholdBaht: 161_510, povertyPercent: [6.62, 5.42, 1.44] },
  { province: 'เลย', householdSize: 2.8, monthlyIncomeBaht: 23_766, monthlyRegularIncomeBaht: 23_707, perPersonIncomeBaht: 8_596, perPersonRegularIncomeBaht: 8_575, householdsWithDebtPercent: 52.7, averageDebtPerHouseholdBaht: 257_883, povertyPercent: [0.97, 0.58, 0.48] },
  { province: 'ศรีสะเกษ', householdSize: 3.1, monthlyIncomeBaht: 19_858, monthlyRegularIncomeBaht: 19_629, perPersonIncomeBaht: 6_494, perPersonRegularIncomeBaht: 6_419, householdsWithDebtPercent: 63.2, averageDebtPerHouseholdBaht: 238_414, povertyPercent: [18.10, 16.03, 4.07] },
  { province: 'สกลนคร', householdSize: 2.9, monthlyIncomeBaht: 20_652, monthlyRegularIncomeBaht: 20_343, perPersonIncomeBaht: 7_135, perPersonRegularIncomeBaht: 7_029, householdsWithDebtPercent: 59.4, averageDebtPerHouseholdBaht: 221_537, povertyPercent: [6.82, 10.32, 6.10] },
  { province: 'สุรินทร์', householdSize: 3.0, monthlyIncomeBaht: 22_216, monthlyRegularIncomeBaht: 21_753, perPersonIncomeBaht: 7_494, perPersonRegularIncomeBaht: 7_338, householdsWithDebtPercent: 71.7, averageDebtPerHouseholdBaht: 290_152, povertyPercent: [6.60, 10.49, 5.57] },
  { province: 'หนองคาย', householdSize: 3.0, monthlyIncomeBaht: 26_200, monthlyRegularIncomeBaht: 25_802, perPersonIncomeBaht: 8_661, perPersonRegularIncomeBaht: 8_529, householdsWithDebtPercent: 58.8, averageDebtPerHouseholdBaht: 193_443, povertyPercent: [5.55, 3.87, 0.99] },
  { province: 'หนองบัวลำภู', householdSize: 3.2, monthlyIncomeBaht: 24_491, monthlyRegularIncomeBaht: 23_500, perPersonIncomeBaht: 7_679, perPersonRegularIncomeBaht: 7_368, householdsWithDebtPercent: 73.1, averageDebtPerHouseholdBaht: 260_061, povertyPercent: [18.12, 18.16, 9.61] },
  { province: 'อุดรธานี', householdSize: 2.5, monthlyIncomeBaht: 21_212, monthlyRegularIncomeBaht: 20_598, perPersonIncomeBaht: 8_479, perPersonRegularIncomeBaht: 8_234, householdsWithDebtPercent: 45.5, averageDebtPerHouseholdBaht: 105_266, povertyPercent: [9.45, 6.26, 4.65] },
  { province: 'อุบลราชธานี', householdSize: 2.9, monthlyIncomeBaht: 20_317, monthlyRegularIncomeBaht: 19_869, perPersonIncomeBaht: 7_028, perPersonRegularIncomeBaht: 6_873, householdsWithDebtPercent: 67.8, averageDebtPerHouseholdBaht: 202_806, povertyPercent: [15.15, 9.59, 7.89] },
  { province: 'อำนาจเจริญ', householdSize: 3.0, monthlyIncomeBaht: 28_515, monthlyRegularIncomeBaht: 27_930, perPersonIncomeBaht: 9_545, perPersonRegularIncomeBaht: 9_349, householdsWithDebtPercent: 70.2, averageDebtPerHouseholdBaht: 337_610, povertyPercent: [6.90, 4.96, 3.60] },
] as const
