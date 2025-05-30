
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
    id: "hegra-archaeological-site",
    title: "Hegra Archaeological Site (Al-Hijr / Madā'in Ṣāliḥ)",
    titleArabic: "موقع الحجر الأثري (الحجر / مدائن صالح)",
    description: "Saudi Arabia's first UNESCO World Heritage Site. Hegra represents the largest preserved site of the Nabatean civilization outside of Petra, featuring over 130 monumental tombs carved into sandstone outcrops.",
    descriptionArabic: "أول موقع للتراث العالمي في المملكة العربية السعودية. يمثل الحجر أكبر موقع محفوظ للحضارة النبطية خارج البتراء، ويضم أكثر من 130 قبرًا أثريًا منحوتًا في الصخور الرملية.",
    imageUrl: "/lovable-uploads/9f845f59-a64c-4dc9-8a1d-1e55afa22cb4.png",
    audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    duration: 120,
    distance: 5.2,
    location: {
      lat: 26.7917,
      lng: 37.9542
    },
    isPremium: true,
    points: [
      {
        id: "qasr-al-farid",
        title: "Qasr al-Farid (The Lonely Castle)",
        description: "Iconic unfinished tomb with a distinctive single facade, standing alone in the desert landscape.",
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        duration: 15,
        location: {
          lat: 26.7950,
          lng: 37.9548
        }
      },
      {
        id: "nabatean-tombs",
        title: "Monumental Nabatean Tombs",
        description: "Over 130 elaborately carved tombs showcasing the architectural mastery of the Nabatean civilization.",
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        duration: 20,
        location: {
          lat: 26.7925,
          lng: 37.9555
        }
      },
      {
        id: "ancient-inscriptions",
        title: "Ancient Inscriptions and Cave Drawings",
        description: "Discover wells, inscriptions, and cave drawings that tell the story of ancient desert life.",
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        duration: 12,
        location: {
          lat: 26.7900,
          lng: 37.9530
        }
      }
    ]
  },
  {
    id: "at-turaif-diriyah",
    title: "At-Turaif District in Ad-Dir'iyah",
    titleArabic: "حي الطريف في الدرعية",
    description: "The birthplace of the Saudi kingdom and UNESCO World Heritage Site. This historic district features mud-brick palaces and defensive walls representing the architectural style of central Arabia.",
    descriptionArabic: "مسقط رأس المملكة السعودية وموقع التراث العالمي. يضم هذا الحي التاريخي قصورًا من الطوب اللبن وأسوارًا دفاعية تمثل الطراز المعماري لوسط الجزيرة العربية.",
    imageUrl: "/lovable-uploads/ec049573-bd54-4cae-a3a6-c9d996622e4d.png",
    audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    duration: 90,
    distance: 3.5,
    location: {
      lat: 24.7336,
      lng: 46.5722
    },
    isPremium: false,
    points: [
      {
        id: "salwa-palace",
        title: "Salwa Palace",
        description: "The historic residence of the ruling Al Saud family and the seat of government during the first Saudi state.",
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        duration: 15,
        location: {
          lat: 24.7338,
          lng: 46.5725
        }
      },
      {
        id: "defensive-walls",
        title: "Historic Defensive Walls",
        description: "Explore the mud-brick defensive structures that protected the first Saudi capital.",
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        duration: 10,
        location: {
          lat: 24.7342,
          lng: 46.5728
        }
      },
      {
        id: "royal-quarters",
        title: "Royal Residential Quarters",
        description: "Visit the traditional residential areas that housed the Saudi royal family and officials.",
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        duration: 12,
        location: {
          lat: 24.7345,
          lng: 46.5730
        }
      }
    ]
  },
  {
    id: "historic-jeddah",
    title: "Historic Jeddah, the Gate to Makkah",
    titleArabic: "جدة التاريخية، بوابة مكة المكرمة",
    description: "The Al-Balad district represents one of the last remaining examples of Red Sea architectural tradition, featuring distinctive coral stone construction and traditional roshan balconies.",
    descriptionArabic: "يمثل حي البلد أحد آخر الأمثلة المتبقية على تقاليد العمارة في البحر الأحمر، ويتميز ببناء الحجر المرجاني المميز والشرفات التقليدية (الرواشين).",
    imageUrl: "/lovable-uploads/65e26636-18ad-464c-b969-467a59c3b244.png",
    audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    duration: 75,
    distance: 2.8,
    location: {
      lat: 21.4858,
      lng: 39.1925
    },
    isPremium: true,
    points: [
      {
        id: "al-balad-district",
        title: "Al-Balad Historic District",
        description: "Walk through the ancient commercial hub with its coral stone and wood construction.",
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        duration: 20,
        location: {
          lat: 21.4861,
          lng: 39.1911
        }
      },
      {
        id: "roshan-balconies",
        title: "Traditional Roshan Balconies",
        description: "Admire the intricate wooden balconies that are iconic to Jeddah's architecture.",
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        duration: 15,
        location: {
          lat: 21.4872,
          lng: 39.1935
        }
      },
      {
        id: "historic-souks",
        title: "Historic Souks and Markets",
        description: "Experience the traditional markets that served pilgrims on their way to Makkah.",
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        duration: 18,
        location: {
          lat: 21.4850,
          lng: 39.1920
        }
      }
    ]
  },
  {
    id: "hail-rock-art",
    title: "Rock Art in the Hail Region",
    titleArabic: "الفن الصخري في منطقة حائل",
    description: "This UNESCO site encompasses Jebel Umm Sinman at Jubbah and Shuwaymas at Thaqab, containing extensive petroglyphs dating from the Neolithic period to the early Islamic era.",
    descriptionArabic: "يشمل هذا الموقع جبل أم سنمان في جبة والشويمس في ثقب، ويحتوي على نقوش صخرية واسعة تعود من العصر النيوليتي إلى بداية العصر الإسلامي.",
    imageUrl: "/lovable-uploads/bb59d475-d925-4ce0-a427-79d36dd45cfd.png",
    audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    duration: 100,
    distance: 4.2,
    location: {
      lat: 28.0339,
      lng: 40.2151
    },
    isPremium: true,
    points: [
      {
        id: "jebel-umm-sinman",
        title: "Jebel Umm Sinman at Jubbah",
        description: "Explore ancient petroglyphs showing the lives of prehistoric communities including camels and human figures.",
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        duration: 25,
        location: {
          lat: 28.0350,
          lng: 40.2160
        }
      },
      {
        id: "shuwaymas-thaqab",
        title: "Shuwaymas at Thaqab",
        description: "Discover ancient Arabic script and rock art panels providing evidence of environmental changes.",
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        duration: 20,
        location: {
          lat: 28.0320,
          lng: 40.2140
        }
      },
      {
        id: "neolithic-inscriptions",
        title: "Neolithic to Islamic Era Inscriptions",
        description: "Witness the evolution of human activity in the Arabian Peninsula through rock art spanning millennia.",
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        duration: 15,
        location: {
          lat: 28.0360,
          lng: 40.2170
        }
      }
    ]
  },
  {
    id: "al-ahsa-oasis",
    title: "Al-Ahsa Oasis, an Evolving Cultural Landscape",
    titleArabic: "واحة الأحساء، المشهد الثقافي المتطور",
    description: "The world's largest oasis featuring 2.3 million date palms, springs, canals, and historical buildings demonstrating sustainable water management practices developed over millennia.",
    descriptionArabic: "أكبر واحة في العالم تضم 2.3 مليون نخلة، وينابيع، وقنوات، ومباني تاريخية تظهر ممارسات إدارة المياه المستدامة المطورة عبر آلاف السنين.",
    imageUrl: "/lovable-uploads/3c809fb0-ff83-4b8c-a580-5f8a4cb7075f.png",
    audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    duration: 110,
    distance: 6.8,
    location: {
      lat: 25.3547,
      lng: 49.5578
    },
    isPremium: false,
    points: [
      {
        id: "date-palm-gardens",
        title: "Historic Date Palm Gardens",
        description: "Walk through groves containing 2.3 million date palms in the world's largest oasis.",
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        duration: 25,
        location: {
          lat: 25.3560,
          lng: 49.5590
        }
      },
      {
        id: "ancient-springs",
        title: "Ancient Natural Springs",
        description: "Discover the natural springs that have sustained this oasis for over 6,000 years.",
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        duration: 20,
        location: {
          lat: 25.3540,
          lng: 49.5570
        }
      },
      {
        id: "irrigation-canals",
        title: "Traditional Irrigation System",
        description: "Learn about the sophisticated water management network that makes this oasis possible.",
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        duration: 18,
        location: {
          lat: 25.3550,
          lng: 49.5580
        }
      }
    ]
  },
  {
    id: "hima-cultural-area",
    title: "Ḥimā Cultural Area",
    titleArabic: "منطقة حمى الثقافية",
    description: "Located in Najran region, this site contains one of the largest collections of rock art in Saudi Arabia, with petroglyphs spanning thousands of years depicting hunting scenes and ancient trade routes.",
    descriptionArabic: "تقع في منطقة نجران، وتحتوي على واحدة من أكبر مجموعات الفن الصخري في المملكة العربية السعودية، مع نقوش صخرية تمتد لآلاف السنين تصور مشاهد الصيد وطرق التجارة القديمة.",
    imageUrl: "/lovable-uploads/4a0bfc18-5932-4f8a-9c7e-2abad5a77d5a.png",
    audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    duration: 95,
    distance: 5.5,
    location: {
      lat: 19.1951,
      lng: 44.2271
    },
    isPremium: true,
    points: [
      {
        id: "hunting-scenes",
        title: "Ancient Hunting Scene Petroglyphs",
        description: "View detailed rock art depicting hunting practices of ancient Arabian communities.",
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        duration: 22,
        location: {
          lat: 19.1960,
          lng: 44.2280
        }
      },
      {
        id: "trade-route-evidence",
        title: "Ancient Trade Route Markers",
        description: "Discover evidence of ancient trade routes that connected southern Arabian Peninsula.",
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        duration: 18,
        location: {
          lat: 19.1940,
          lng: 44.2260
        }
      },
      {
        id: "cultural-practices",
        title: "Cultural Practice Depictions",
        description: "Explore rock art showing the cultural practices and daily life of ancient civilizations.",
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        duration: 15,
        location: {
          lat: 19.1970,
          lng: 44.2290
        }
      }
    ]
  },
  {
    id: "uruq-bani-maarid",
    title: "'Uruq Bani Ma'arid",
    titleArabic: "عروق بني معارض",
    description: "This natural World Heritage site protects a vast area of the Rub' al Khali (Empty Quarter) desert ecosystem, representing one of the world's largest continuous sand desert systems.",
    descriptionArabic: "يحمي هذا الموقع الطبيعي للتراث العالمي منطقة شاسعة من النظام البيئي الصحراوي للربع الخالي، ويمثل واحدًا من أكبر أنظمة الصحراء الرملية المتواصلة في العالم.",
    imageUrl: "/lovable-uploads/15e96ef7-2eef-4e52-b11c-a519cecea845.png",
    audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    duration: 150,
    distance: 12.0,
    location: {
      lat: 22.4833,
      lng: 49.1167
    },
    isPremium: true,
    points: [
      {
        id: "empty-quarter-dunes",
        title: "Rub' al Khali Sand Dunes",
        description: "Experience the vastness of the Empty Quarter, one of the world's largest sand desert systems.",
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        duration: 30,
        location: {
          lat: 22.4850,
          lng: 49.1180
        }
      },
      {
        id: "arabian-wildlife",
        title: "Endangered Arabian Species Habitat",
        description: "Discover the crucial habitat for endangered Arabian species in this protected ecosystem.",
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        duration: 25,
        location: {
          lat: 22.4820,
          lng: 49.1150
        }
      },
      {
        id: "desert-ecosystem",
        title: "Desert Ecosystem Conservation",
        description: "Learn about the natural heritage and conservation efforts in the Arabian Peninsula.",
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        duration: 20,
        location: {
          lat: 22.4840,
          lng: 49.1170
        }
      }
    ]
  },
  {
    id: "trajan-kharax-farasan",
    title: "Trajan's Kharax, Farasan Al-Kabir",
    titleArabic: "خراكس تراجان، فرسان الكبير",
    description: "The most recently inscribed UNESCO site, featuring Roman military installations and harbor facilities on Farasan Island, representing the southernmost extent of Roman influence in Arabia.",
    descriptionArabic: "أحدث موقع مدرج في قائمة اليونسكو، يضم منشآت عسكرية رومانية ومرافق مرفأ في جزيرة فرسان، ويمثل أقصى امتداد جنوبي للنفوذ الروماني في الجزيرة العربية.",
    imageUrl: "/lovable-uploads/34a411c9-c00d-440b-a275-02e59188483d.png",
    audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    duration: 85,
    distance: 3.2,
    location: {
      lat: 16.7000,
      lng: 42.1167
    },
    isPremium: true,
    points: [
      {
        id: "roman-installations",
        title: "Roman Military Installations",
        description: "Explore the remains of Roman military structures at the edge of their Arabian influence.",
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        duration: 20,
        location: {
          lat: 16.7010,
          lng: 42.1170
        }
      },
      {
        id: "ancient-harbor",
        title: "Ancient Harbor Facilities",
        description: "Discover the harbor installations that facilitated ancient maritime trade networks.",
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        duration: 18,
        location: {
          lat: 16.6990,
          lng: 42.1160
        }
      },
      {
        id: "red-sea-trade",
        title: "Red Sea Maritime Trade",
        description: "Learn about the ancient trade networks that connected Arabia with the Roman Empire.",
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        duration: 15,
        location: {
          lat: 16.7020,
          lng: 42.1180
        }
      }
    ]
  }
];

// Utility functions with improved error handling
export const getTour = (id: string): Tour | undefined => {
  if (!id) {
    console.warn('getTour called with empty id');
    return undefined;
  }
  return tours.find(tour => tour.id === id);
};

export const getFeaturedTours = (): Tour[] => {
  return tours.slice(0, 3);
};

export const getPremiumTours = (): Tour[] => {
  return tours.filter(tour => tour.isPremium);
};

export const getFreeTours = (): Tour[] => {
  return tours.filter(tour => !tour.isPremium);
};

export const validateTour = (tour: Partial<Tour>): boolean => {
  return !!(
    tour.id &&
    tour.title &&
    tour.description &&
    tour.location?.lat &&
    tour.location?.lng &&
    typeof tour.isPremium === 'boolean'
  );
};

export const getToursByCategory = (isPremium: boolean): Tour[] => {
  return tours.filter(tour => tour.isPremium === isPremium);
};

export const searchTours = (query: string): Tour[] => {
  if (!query) return tours;
  
  const searchTerm = query.toLowerCase();
  return tours.filter(tour => 
    tour.title.toLowerCase().includes(searchTerm) ||
    tour.description.toLowerCase().includes(searchTerm) ||
    tour.titleArabic.includes(query) ||
    tour.descriptionArabic.includes(query)
  );
};
