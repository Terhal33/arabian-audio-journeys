
export interface Category {
  id: string;
  name: string;
  nameArabic: string;
  icon?: string;
}

export const categories: Category[] = [
  {
    id: "historical",
    name: "Historical",
    nameArabic: "تاريخي",
    icon: "🏛️"
  },
  {
    id: "cultural",
    name: "Cultural",
    nameArabic: "ثقافي",
    icon: "🎭"
  },
  {
    id: "religious",
    name: "Religious",
    nameArabic: "ديني",
    icon: "🕌"
  },
  {
    id: "natural",
    name: "Nature",
    nameArabic: "طبيعي",
    icon: "🌄"
  },
  {
    id: "modern",
    name: "Modern",
    nameArabic: "حديث",
    icon: "🏙️"
  },
  {
    id: "archaeological",
    name: "Archaeological",
    nameArabic: "أثري",
    icon: "🏺"
  }
];

export const regions: Category[] = [
  {
    id: "riyadh",
    name: "Riyadh Region",
    nameArabic: "منطقة الرياض"
  },
  {
    id: "makkah",
    name: "Makkah Region",
    nameArabic: "منطقة مكة المكرمة"
  },
  {
    id: "madinah",
    name: "Madinah Region",
    nameArabic: "منطقة المدينة المنورة"
  },
  {
    id: "qassim",
    name: "Qassim Region",
    nameArabic: "منطقة القصيم"
  },
  {
    id: "eastern",
    name: "Eastern Province",
    nameArabic: "المنطقة الشرقية"
  },
  {
    id: "asir",
    name: "Asir Region",
    nameArabic: "منطقة عسير"
  },
  {
    id: "tabuk",
    name: "Tabuk Region",
    nameArabic: "منطقة تبوك"
  },
  {
    id: "hail",
    name: "Hail Region",
    nameArabic: "منطقة حائل"
  }
];

export const historicalPeriods: Category[] = [
  {
    id: "ancient",
    name: "Ancient",
    nameArabic: "العصور القديمة"
  },
  {
    id: "islamic-early",
    name: "Early Islamic",
    nameArabic: "الإسلام المبكر"
  },
  {
    id: "ottoman",
    name: "Ottoman Era",
    nameArabic: "العصر العثماني"
  },
  {
    id: "saudi-first",
    name: "First Saudi State",
    nameArabic: "الدولة السعودية الأولى"
  },
  {
    id: "saudi-second",
    name: "Second Saudi State",
    nameArabic: "الدولة السعودية الثانية"
  },
  {
    id: "saudi-third",
    name: "Modern Kingdom",
    nameArabic: "المملكة الحديثة"
  }
];
