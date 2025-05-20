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
  
  // Adding new locations from the user's request
  {
    id: "madain-saleh",
    title: "Mada'in Saleh (Hegra)",
    titleArabic: "مدائن صالح (الحجر)",
    description: "Saudi Arabia's first UNESCO World Heritage site featuring over 100 monumental tombs carved into sandstone mountains by the Nabataean civilization.",
    descriptionArabic: "أول موقع للتراث العالمي في المملكة العربية السعودية يضم أكثر من 100 ضريح منحوت في جبال الحجر الرملي من قبل الحضارة النبطية.",
    imageUrl: "/placeholder.svg",
    audioUrl: "/audio/madain-saleh-intro.mp3",
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
        audioUrl: "/audio/qasr-al-farid.mp3",
        duration: 15,
        location: {
          lat: 26.7950,
          lng: 37.9548
        }
      },
      {
        id: "diwan",
        title: "Diwan",
        description: "Religious gathering space carved into sandstone rock, showcasing Nabataean architectural ingenuity.",
        audioUrl: "/audio/diwan.mp3",
        duration: 12,
        location: {
          lat: 26.7925,
          lng: 37.9555
        }
      },
      {
        id: "jabal-al-mahjar",
        title: "Jabal al-Mahjar",
        description: "Collection of densely concentrated tombs with intricate facade designs and cultural significance.",
        audioUrl: "/audio/jabal-al-mahjar.mp3",
        duration: 18,
        location: {
          lat: 26.7900,
          lng: 37.9530
        }
      },
      {
        id: "nabataean-wells",
        title: "Ancient Nabataean Wells",
        description: "Sophisticated water management system that allowed the Nabataean civilization to thrive in the desert.",
        audioUrl: "/audio/nabataean-wells.mp3",
        duration: 10,
        location: {
          lat: 26.7890,
          lng: 37.9520
        }
      }
    ]
  },
  {
    id: "al-masjid-al-nabawi",
    title: "Al-Masjid al-Nabawi (Prophet's Mosque)",
    titleArabic: "المسجد النبوي",
    description: "Islam's second holiest site, built by Prophet Muhammad in 622 CE, featuring distinctive green domes and accommodating over one million worshippers.",
    descriptionArabic: "ثاني أقدس موقع في الإسلام، بناه النبي محمد عام 622 م، يتميز بقبابه الخضراء المميزة ويستوعب أكثر من مليون مصلي.",
    imageUrl: "/placeholder.svg",
    audioUrl: "/audio/masjid-nabawi-intro.mp3",
    duration: 75,
    distance: 1.8,
    location: {
      lat: 24.4672,
      lng: 39.6112
    },
    isPremium: false,
    points: [
      {
        id: "rawdah",
        title: "Rawdah (Garden of Paradise)",
        description: "Sacred area between Prophet Muhammad's house and pulpit, believed to be a piece of paradise.",
        audioUrl: "/audio/rawdah.mp3",
        duration: 20,
        location: {
          lat: 24.4675,
          lng: 39.6115
        }
      },
      {
        id: "original-pillars",
        title: "Original Pillars",
        description: "Preserved pillars dating back to the Prophet's era, marking the original structure of the mosque.",
        audioUrl: "/audio/original-pillars.mp3",
        duration: 15,
        location: {
          lat: 24.4670,
          lng: 39.6110
        }
      },
      {
        id: "ottoman-architecture",
        title: "Ottoman Architectural Elements",
        description: "Magnificent architectural features added during the Ottoman expansion of the mosque.",
        audioUrl: "/audio/ottoman-architecture.mp3",
        duration: 12,
        location: {
          lat: 24.4678,
          lng: 39.6118
        }
      }
    ]
  },
  {
    id: "edge-of-the-world",
    title: "Edge of the World (Jebel Fihrayn)",
    titleArabic: "حافة العالم (جبل فهرين)",
    description: "Dramatic cliffs rising 300 meters from the desert floor with panoramic views extending to the horizon, part of the 800km-long Tuwaiq Escarpment.",
    descriptionArabic: "منحدرات مذهلة ترتفع 300 متر من أرض الصحراء مع إطلالات بانورامية تمتد إلى الأفق، جزء من جرف طويق الذي يبلغ طوله 800 كم.",
    imageUrl: "/placeholder.svg",
    audioUrl: "/audio/edge-of-world-intro.mp3",
    duration: 180,
    distance: 8.5,
    location: {
      lat: 24.5700,
      lng: 45.9867
    },
    isPremium: true,
    points: [
      {
        id: "main-viewpoint",
        title: "Main Panoramic Viewpoint",
        description: "The primary observation area offering the most spectacular views across the ancient seabed.",
        audioUrl: "/audio/main-viewpoint.mp3",
        duration: 25,
        location: {
          lat: 24.5710,
          lng: 45.9870
        }
      },
      {
        id: "fossil-site",
        title: "Marine Fossil Site",
        description: "Area containing well-preserved marine fossils embedded in rock layers, evidence of the region's underwater past.",
        audioUrl: "/audio/fossil-site.mp3",
        duration: 20,
        location: {
          lat: 24.5690,
          lng: 45.9850
        }
      },
      {
        id: "caravan-route",
        title: "Ancient Caravan Route",
        description: "Visible markers of historical trade routes used for centuries by traders and pilgrims crossing the Arabian Peninsula.",
        audioUrl: "/audio/caravan-route.mp3",
        duration: 15,
        location: {
          lat: 24.5720,
          lng: 45.9880
        }
      }
    ]
  }
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
