// Real province statistics for the 20 Isan provinces. Do not edit numbers without a citable source.
// Sources and notes: see SOURCES.md. Household income figures are survey estimates; GPP is provisional.
export interface IncomeStats { meanTotal: number; meanRegular: number; medianTotal: number; medianRegular: number }
export interface ProvinceStats {
  nameTh: string
  gppPerCapita2023: number // baht/person/year (NESDC)
  householdSize: number // persons/household (NSO SES 2023)
  householdIncomeMonthly: IncomeStats // baht/month/household (NSO SES 2023)
  incomePerPersonMonthly: { total: number; regular: number } // baht/month/person
  meanDebtOfIndebtedHouseholds: number // baht, only for households that have debt
}
export const PROVINCE_STATS: ProvinceStats[] = [
  {
    "nameTh": "กาฬสินธุ์",
    "gppPerCapita2023": 84785,
    "householdSize": 2.8,
    "householdIncomeMonthly": {
      "meanTotal": 20599,
      "meanRegular": 20442,
      "medianTotal": 14756,
      "medianRegular": 14566
    },
    "incomePerPersonMonthly": {
      "total": 7392,
      "regular": 7336
    },
    "meanDebtOfIndebtedHouseholds": 271101
  },
  {
    "nameTh": "ขอนแก่น",
    "gppPerCapita2023": 131987,
    "householdSize": 2.4,
    "householdIncomeMonthly": {
      "meanTotal": 19326,
      "meanRegular": 19151,
      "medianTotal": 16362,
      "medianRegular": 16189
    },
    "incomePerPersonMonthly": {
      "total": 8023,
      "regular": 7950
    },
    "meanDebtOfIndebtedHouseholds": 119894
  },
  {
    "nameTh": "ชัยภูมิ",
    "gppPerCapita2023": 85951,
    "householdSize": 2.8,
    "householdIncomeMonthly": {
      "meanTotal": 22778,
      "meanRegular": 22444,
      "medianTotal": 16147,
      "medianRegular": 16000
    },
    "incomePerPersonMonthly": {
      "total": 8009,
      "regular": 7892
    },
    "meanDebtOfIndebtedHouseholds": 331739
  },
  {
    "nameTh": "นครพนม",
    "gppPerCapita2023": 96731,
    "householdSize": 3.2,
    "householdIncomeMonthly": {
      "meanTotal": 22099,
      "meanRegular": 21684,
      "medianTotal": 16244,
      "medianRegular": 16049
    },
    "incomePerPersonMonthly": {
      "total": 6892,
      "regular": 6763
    },
    "meanDebtOfIndebtedHouseholds": 322850
  },
  {
    "nameTh": "นครราชสีมา",
    "gppPerCapita2023": 137864,
    "householdSize": 3.0,
    "householdIncomeMonthly": {
      "meanTotal": 27775,
      "meanRegular": 27567,
      "medianTotal": 20294,
      "medianRegular": 20200
    },
    "incomePerPersonMonthly": {
      "total": 9229,
      "regular": 9160
    },
    "meanDebtOfIndebtedHouseholds": 457090
  },
  {
    "nameTh": "บึงกาฬ",
    "gppPerCapita2023": 84021,
    "householdSize": 2.9,
    "householdIncomeMonthly": {
      "meanTotal": 25137,
      "meanRegular": 24406,
      "medianTotal": 19258,
      "medianRegular": 19171
    },
    "incomePerPersonMonthly": {
      "total": 8594,
      "regular": 8344
    },
    "meanDebtOfIndebtedHouseholds": 300465
  },
  {
    "nameTh": "บุรีรัมย์",
    "gppPerCapita2023": 91636,
    "householdSize": 2.9,
    "householdIncomeMonthly": {
      "meanTotal": 21961,
      "meanRegular": 21813,
      "medianTotal": 16013,
      "medianRegular": 16007
    },
    "incomePerPersonMonthly": {
      "total": 7556,
      "regular": 7506
    },
    "meanDebtOfIndebtedHouseholds": 287377
  },
  {
    "nameTh": "มหาสารคาม",
    "gppPerCapita2023": 90996,
    "householdSize": 2.5,
    "householdIncomeMonthly": {
      "meanTotal": 21169,
      "meanRegular": 20895,
      "medianTotal": 15787,
      "medianRegular": 15723
    },
    "incomePerPersonMonthly": {
      "total": 8433,
      "regular": 8324
    },
    "meanDebtOfIndebtedHouseholds": 255516
  },
  {
    "nameTh": "มุกดาหาร",
    "gppPerCapita2023": 72251,
    "householdSize": 2.8,
    "householdIncomeMonthly": {
      "meanTotal": 24925,
      "meanRegular": 22533,
      "medianTotal": 16419,
      "medianRegular": 16235
    },
    "incomePerPersonMonthly": {
      "total": 8841,
      "regular": 7992
    },
    "meanDebtOfIndebtedHouseholds": 425535
  },
  {
    "nameTh": "ยโสธร",
    "gppPerCapita2023": 77376,
    "householdSize": 2.8,
    "householdIncomeMonthly": {
      "meanTotal": 24439,
      "meanRegular": 24255,
      "medianTotal": 16085,
      "medianRegular": 15883
    },
    "incomePerPersonMonthly": {
      "total": 8842,
      "regular": 8776
    },
    "meanDebtOfIndebtedHouseholds": 267553
  },
  {
    "nameTh": "ร้อยเอ็ด",
    "gppPerCapita2023": 82491,
    "householdSize": 2.8,
    "householdIncomeMonthly": {
      "meanTotal": 20354,
      "meanRegular": 19631,
      "medianTotal": 13685,
      "medianRegular": 13416
    },
    "incomePerPersonMonthly": {
      "total": 7393,
      "regular": 7130
    },
    "meanDebtOfIndebtedHouseholds": 314685
  },
  {
    "nameTh": "เลย",
    "gppPerCapita2023": 117624,
    "householdSize": 2.8,
    "householdIncomeMonthly": {
      "meanTotal": 23766,
      "meanRegular": 23707,
      "medianTotal": 16777,
      "medianRegular": 16777
    },
    "incomePerPersonMonthly": {
      "total": 8596,
      "regular": 8575
    },
    "meanDebtOfIndebtedHouseholds": 488983
  },
  {
    "nameTh": "ศรีสะเกษ",
    "gppPerCapita2023": 91060,
    "householdSize": 3.1,
    "householdIncomeMonthly": {
      "meanTotal": 19858,
      "meanRegular": 19629,
      "medianTotal": 15717,
      "medianRegular": 15465
    },
    "incomePerPersonMonthly": {
      "total": 6494,
      "regular": 6419
    },
    "meanDebtOfIndebtedHouseholds": 377081
  },
  {
    "nameTh": "สกลนคร",
    "gppPerCapita2023": 78895,
    "householdSize": 2.9,
    "householdIncomeMonthly": {
      "meanTotal": 20652,
      "meanRegular": 20343,
      "medianTotal": 15158,
      "medianRegular": 14995
    },
    "incomePerPersonMonthly": {
      "total": 7135,
      "regular": 7029
    },
    "meanDebtOfIndebtedHouseholds": 373235
  },
  {
    "nameTh": "สุรินทร์",
    "gppPerCapita2023": 89852,
    "householdSize": 3.0,
    "householdIncomeMonthly": {
      "meanTotal": 22216,
      "meanRegular": 21753,
      "medianTotal": 16745,
      "medianRegular": 15986
    },
    "incomePerPersonMonthly": {
      "total": 7494,
      "regular": 7338
    },
    "meanDebtOfIndebtedHouseholds": 404617
  },
  {
    "nameTh": "หนองคาย",
    "gppPerCapita2023": 107589,
    "householdSize": 3.0,
    "householdIncomeMonthly": {
      "meanTotal": 26200,
      "meanRegular": 25802,
      "medianTotal": 20356,
      "medianRegular": 20162
    },
    "incomePerPersonMonthly": {
      "total": 8661,
      "regular": 8529
    },
    "meanDebtOfIndebtedHouseholds": 328892
  },
  {
    "nameTh": "หนองบัวลำภู",
    "gppPerCapita2023": 69008,
    "householdSize": 3.2,
    "householdIncomeMonthly": {
      "meanTotal": 24491,
      "meanRegular": 23500,
      "medianTotal": 16504,
      "medianRegular": 15798
    },
    "incomePerPersonMonthly": {
      "total": 7679,
      "regular": 7368
    },
    "meanDebtOfIndebtedHouseholds": 355554
  },
  {
    "nameTh": "อุดรธานี",
    "gppPerCapita2023": 100005,
    "householdSize": 2.5,
    "householdIncomeMonthly": {
      "meanTotal": 21212,
      "meanRegular": 20598,
      "medianTotal": 15246,
      "medianRegular": 15092
    },
    "incomePerPersonMonthly": {
      "total": 8479,
      "regular": 8234
    },
    "meanDebtOfIndebtedHouseholds": 231506
  },
  {
    "nameTh": "อุบลราชธานี",
    "gppPerCapita2023": 82895,
    "householdSize": 2.9,
    "householdIncomeMonthly": {
      "meanTotal": 20317,
      "meanRegular": 19869,
      "medianTotal": 14572,
      "medianRegular": 14011
    },
    "incomePerPersonMonthly": {
      "total": 7028,
      "regular": 6873
    },
    "meanDebtOfIndebtedHouseholds": 299056
  },
  {
    "nameTh": "อำนาจเจริญ",
    "gppPerCapita2023": 85707,
    "householdSize": 3.0,
    "householdIncomeMonthly": {
      "meanTotal": 28515,
      "meanRegular": 27930,
      "medianTotal": 19834,
      "medianRegular": 19094
    },
    "incomePerPersonMonthly": {
      "total": 9545,
      "regular": 9349
    },
    "meanDebtOfIndebtedHouseholds": 480660
  }
]
export const REGION_REFERENCE = {
  "region": {
    "gppPerCapita2023": 99271,
    "householdSize": 2.8,
    "householdIncomeMonthly": {
      "meanTotal": 22524,
      "meanRegular": 22130,
      "medianTotal": 16288,
      "medianRegular": 16049
    },
    "incomePerPersonMonthly": {
      "total": 7973,
      "regular": 7833
    },
    "meanDebtOfIndebtedHouseholds": 329767,
    "povertyHeadcountPct2023": 4.16
  },
  "country": {
    "gppPerCapita2023": 256345,
    "meanDebtOfIndebtedHouseholds": 411799,
    "povertyHeadcountPct2023": 3.41,
    "povertyHeadcountPct2024": 4.89
  },
  "notes": [
    "Ubon Ratchathani and Si Sa Ket are in the 10 provinces with the highest share of poor people in 2024 (NESDC poverty report 2024, as reported by Bangkok Biz News).",
    "No official per-province life expectancy, under-5 mortality, or per-province poverty rate was found for all 20 provinces; do not display such numbers without a citable source."
  ]
}
