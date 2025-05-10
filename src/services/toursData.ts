
export interface Tour {
  id: string;
  title: string;
  titleArabic: string;
  description: string;
  descriptionArabic: string;
  imageUrl: string;
  audioUrl: string;
  duration: number; // in minutes
  distance: number; // in kilometers
  location: {
    lat: number;
    lng: number;
  };
  isPremium: boolean;
  points: {
    id: string;
    title: string;
    description: string;
    audioUrl: string;
    duration: number;
    location: {
      lat: number;
      lng: number;
    };
  }[];
}

export const tours: Tour[] = [
  {
    id: "diriyah-main",
    title: "Diriyah Historic District",
    titleArabic: "حي الدرعية التاريخي",
    description: "Experience the birthplace of the first Saudi state and home to the UNESCO World Heritage Site At-Turaif.",
    descriptionArabic: "استكشف مسقط رأس الدولة السعودية الأولى وموطن موقع التراث العالمي التريف.",
    imageUrl: "/placeholder.svg",
    audioUrl: "/audio/diriyah-intro.mp3",
    duration: 45,
    distance: 2.3,
    location: {
      lat: 24.7336,
      lng: 46.5722
    },
    isPremium: false,
    points: [
      {
        id: "turaif-district",
        title: "At-Turaif District",
        description: "The UNESCO World Heritage site featuring mud-brick structures from the original Saudi dynasty.",
        audioUrl: "/audio/turaif.mp3",
        duration: 8,
        location: {
          lat: 24.7342,
          lng: 46.5728
        }
      },
      {
        id: "salwa-palace",
        title: "Salwa Palace",
        description: "The historic residence of the ruling Al Saud family and the seat of government during the first Saudi state.",
        audioUrl: "/audio/salwa-palace.mp3",
        duration: 10,
        location: {
          lat: 24.7338,
          lng: 46.5725
        }
      },
      {
        id: "saad-bin-saud-palace",
        title: "Saad bin Saud Palace",
        description: "One of the largest palaces in At-Turaif, known for its distinctive architecture.",
        audioUrl: "/audio/saad-palace.mp3",
        duration: 7,
        location: {
          lat: 24.7345,
          lng: 46.5730
        }
      }
    ]
  },
  {
    id: "al-ula",
    title: "AlUla Ancient City",
    titleArabic: "مدينة العلا القديمة",
    description: "Discover the 2,000-year-old city of Hegra, Saudi Arabia's first UNESCO World Heritage Site.",
    descriptionArabic: "اكتشف مدينة الحجر التي يبلغ عمرها 2000 عام، أول موقع للتراث العالمي في المملكة العربية السعودية.",
    imageUrl: "/placeholder.svg",
    audioUrl: "/audio/alula-intro.mp3",
    duration: 90,
    distance: 4.7,
    location: {
      lat: 26.6088,
      lng: 37.9154
    },
    isPremium: true,
    points: [
      {
        id: "hegra",
        title: "Hegra Archaeological Site",
        description: "Explore the ancient Nabataean city with over 100 well-preserved monumental tombs with elaborate facades.",
        audioUrl: "/audio/hegra.mp3",
        duration: 15,
        location: {
          lat: 26.7902,
          lng: 37.9542
        }
      },
      {
        id: "elephant-rock",
        title: "Elephant Rock",
        description: "A natural sandstone formation resembling an elephant, one of AlUla's most iconic landmarks.",
        audioUrl: "/audio/elephant-rock.mp3",
        duration: 5,
        location: {
          lat: 26.6302,
          lng: 37.9920
        }
      }
    ]
  },
  {
    id: "jeddah-historical",
    title: "Historic Jeddah",
    titleArabic: "جدة التاريخية",
    description: "Walk through Al-Balad, the historic district of Jeddah with its distinctive coral houses and ancient merchant quarters.",
    descriptionArabic: "تجول في البلد، الحي التاريخي بجدة مع بيوته المرجانية المميزة وأحياء التجار القديمة.",
    imageUrl: "/placeholder.svg",
    audioUrl: "/audio/jeddah-intro.mp3",
    duration: 60,
    distance: 3.1,
    location: {
      lat: 21.4858,
      lng: 39.1925
    },
    isPremium: true,
    points: [
      {
        id: "naseef-house",
        title: "Naseef House",
        description: "A traditional coral merchant house where King Abdulaziz stayed after conquering Jeddah in 1925.",
        audioUrl: "/audio/naseef-house.mp3",
        duration: 10,
        location: {
          lat: 21.4861,
          lng: 39.1911
        }
      },
      {
        id: "bab-makkah",
        title: "Bab Makkah",
        description: "The historic eastern gate of Old Jeddah that marked the beginning of the pilgrimage route to Mecca.",
        audioUrl: "/audio/bab-makkah.mp3",
        duration: 8,
        location: {
          lat: 21.4872,
          lng: 39.1935
        }
      }
    ]
  },
];

export const getTour = (id: string): Tour | undefined => {
  return tours.find(tour => tour.id === id);
};

export const getFeaturedTours = (): Tour[] => {
  return tours.slice(0, 2);
};

export const getPremiumTours = (): Tour[] => {
  return tours.filter(tour => tour.isPremium);
};

export const getFreeTours = (): Tour[] => {
  return tours.filter(tour => !tour.isPremium);
};
