// 휴가 타입별 정보
export const LEAVE_TYPE_INFO = {
  ANNUAL: { 
    name: '연차', 
    paid: true, 
    deduct: true, 
    description: '근로기준법에 따라 발생한 연차 사용',
    minDays: 0,
    maxDays: 0,
    daysRangeDescription: '제한없음',
    showDuration: true
  },
  SICK: { 
    name: '병가', 
    paid: false, 
    deduct: false, 
    description: '무급 병가',
    minDays: 0,
    maxDays: 0,
    daysRangeDescription: '제한없음',
    showDuration: false
  },
  SICK_PAID: { 
    name: '유급병가', 
    paid: true, 
    deduct: false, 
    description: '회사 복리후생, 연간 최대 3일',
    minDays: 1,
    maxDays: 3,
    daysRangeDescription: '1-3일',
    showDuration: false
  },
  MATERNITY: { 
    name: '출산휴가', 
    paid: true, 
    deduct: false, 
    description: '근로기준법 제74조, 출산 전후 90일 (다태아 120일)',
    minDays: 90,
    maxDays: 90,
    daysRangeDescription: '정확히 90일',
    showDuration: false
  },
  PATERNITY: { 
    name: '배우자출산휴가', 
    paid: true, 
    deduct: false, 
    description: '남녀고용평등법 제18조의2, 배우자 출산 시 10일',
    minDays: 10,
    maxDays: 10,
    daysRangeDescription: '정확히 10일',
    showDuration: false
  },
  CHILDCARE: { 
    name: '육아휴직', 
    paid: false, 
    deduct: false, 
    description: '육아휴직법, 최대 1년',
    minDays: 30,
    maxDays: 365,
    daysRangeDescription: '30-365일',
    showDuration: false
  },
  MARRIAGE: { 
    name: '결혼휴가', 
    paid: true, 
    deduct: false, 
    description: '본인 결혼 시 5일',
    minDays: 5,
    maxDays: 5,
    daysRangeDescription: '정확히 5일',
    showDuration: false
  },
  FAMILY_MARRIAGE: { 
    name: '가족결혼휴가', 
    paid: true, 
    deduct: false, 
    description: '자녀 및 형제자매 결혼 시 1일',
    minDays: 1,
    maxDays: 1,
    daysRangeDescription: '정확히 1일',
    showDuration: false
  },
  BEREAVEMENT: { 
    name: '경조사', 
    paid: true, 
    deduct: false, 
    description: '부모 5일, 조부모/배우자부모 3일, 형제자매 1일',
    minDays: 1,
    maxDays: 5,
    daysRangeDescription: '1-5일',
    showDuration: false
  },
  OFFICIAL: { 
    name: '공가', 
    paid: true, 
    deduct: false, 
    description: '병역, 공무 수행, 선거 등',
    minDays: 1,
    maxDays: 30,
    daysRangeDescription: '1-30일',
    showDuration: false
  },
  UNPAID: { 
    name: '무급휴가', 
    paid: false, 
    deduct: false, 
    description: '개인 사유에 따른 무급 휴가',
    minDays: 0,
    maxDays: 0,
    daysRangeDescription: '제한없음',
    showDuration: false
  }
};

// 기간 구분 정보
export const DURATION_INFO = {
  FULL_DAY: { name: '종일', days: 1.0 },
  HALF_DAY_AM: { name: '오전 반차', days: 0.5 },
  HALF_DAY_PM: { name: '오후 반차', days: 0.5 },
  QUARTER_DAY_AM: { name: '오전 반반차', days: 0.25 },
  QUARTER_DAY_PM: { name: '오후 반반차', days: 0.25 }
};
