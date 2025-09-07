// MCQ questions about viruses and diseases
export const healthMCQs = {
  en: [
    // COVID-19 Questions
    {
      id: 1,
      category: "COVID-19",
      question: "What is the main way COVID-19 spreads?",
      options: [
        "Through contaminated food",
        "Through respiratory droplets",
        "Through insect bites",
        "Through skin contact"
      ],
      correctAnswer: 1,
      explanation: "COVID-19 primarily spreads through respiratory droplets when infected people cough, sneeze, or talk.",
      difficulty: "easy"
    },
    {
      id: 2,
      category: "COVID-19",
      question: "Which of these is NOT a common symptom of COVID-19?",
      options: [
        "Fever",
        "Cough",
        "Hair loss",
        "Loss of taste or smell"
      ],
      correctAnswer: 2,
      explanation: "Hair loss is not a common initial symptom of COVID-19, though it may occur later in some cases.",
      difficulty: "medium"
    },
    
    // Tuberculosis Questions
    {
      id: 3,
      category: "Tuberculosis",
      question: "Which bacterium causes tuberculosis?",
      options: [
        "Staphylococcus aureus",
        "Mycobacterium tuberculosis",
        "Streptococcus pneumoniae",
        "Escherichia coli"
      ],
      correctAnswer: 1,
      explanation: "Tuberculosis is caused by Mycobacterium tuberculosis bacteria.",
      difficulty: "medium"
    },
    {
      id: 4,
      category: "Tuberculosis",
      question: "How long is the standard treatment for drug-susceptible TB?",
      options: [
        "2 months",
        "4 months",
        "6 months",
        "12 months"
      ],
      correctAnswer: 2,
      explanation: "Standard treatment for drug-susceptible TB is a 6-month course of antimicrobial drugs.",
      difficulty: "hard"
    },
    
    // Dengue Questions
    {
      id: 5,
      category: "Dengue",
      question: "Which mosquito species primarily transmits dengue?",
      options: [
        "Anopheles mosquito",
        "Culex mosquito",
        "Aedes aegypti mosquito",
        "Mansonia mosquito"
      ],
      correctAnswer: 2,
      explanation: "Dengue is primarily transmitted by female Aedes aegypti mosquitoes.",
      difficulty: "medium"
    },
    {
      id: 6,
      category: "Dengue",
      question: "What temperature fever is associated with dengue?",
      options: [
        "37°C/98.6°F",
        "38°C/100.4°F",
        "40°C/104°F",
        "42°C/107.6°F"
      ],
      correctAnswer: 2,
      explanation: "Dengue fever is typically characterized by high fever of 40°C/104°F.",
      difficulty: "easy"
    },
    
    // Malaria Questions
    {
      id: 7,
      category: "Malaria",
      question: "What causes malaria?",
      options: [
        "Bacteria",
        "Virus",
        "Parasite",
        "Fungus"
      ],
      correctAnswer: 2,
      explanation: "Malaria is caused by Plasmodium parasites transmitted through mosquito bites.",
      difficulty: "easy"
    },
    {
      id: 8,
      category: "Malaria",
      question: "Which mosquito transmits malaria?",
      options: [
        "Aedes mosquito",
        "Culex mosquito",
        "Anopheles mosquito",
        "Mansonia mosquito"
      ],
      correctAnswer: 2,
      explanation: "Malaria is transmitted by infected female Anopheles mosquitoes.",
      difficulty: "medium"
    },
    
    // Hepatitis Questions
    {
      id: 9,
      category: "Hepatitis",
      question: "Which hepatitis type is transmitted through contaminated water?",
      options: [
        "Hepatitis A",
        "Hepatitis B",
        "Hepatitis C",
        "Hepatitis D"
      ],
      correctAnswer: 0,
      explanation: "Hepatitis A is transmitted through contaminated food and water.",
      difficulty: "medium"
    },
    {
      id: 10,
      category: "Hepatitis",
      question: "What organ does hepatitis primarily affect?",
      options: [
        "Heart",
        "Lungs",
        "Liver",
        "Kidneys"
      ],
      correctAnswer: 2,
      explanation: "Hepatitis is inflammation of the liver.",
      difficulty: "easy"
    },
    
    // Influenza Questions
    {
      id: 11,
      category: "Influenza",
      question: "How often should you get a flu vaccine?",
      options: [
        "Once in a lifetime",
        "Every 5 years",
        "Every 2 years",
        "Every year"
      ],
      correctAnswer: 3,
      explanation: "Flu vaccines should be taken annually as the virus strains change yearly.",
      difficulty: "easy"
    },
    {
      id: 12,
      category: "Influenza",
      question: "Which age group is at highest risk for flu complications?",
      options: [
        "Children under 5 and adults over 65",
        "Teenagers",
        "Young adults",
        "Middle-aged adults"
      ],
      correctAnswer: 0,
      explanation: "Children under 5 and adults over 65 are at higher risk for serious flu complications.",
      difficulty: "medium"
    },
    
    // General Prevention Questions
    {
      id: 13,
      category: "Prevention",
      question: "What is the most effective way to prevent many infectious diseases?",
      options: [
        "Taking antibiotics daily",
        "Washing hands frequently",
        "Wearing sunglasses",
        "Drinking energy drinks"
      ],
      correctAnswer: 1,
      explanation: "Regular handwashing is one of the most effective ways to prevent infectious diseases.",
      difficulty: "easy"
    },
    {
      id: 14,
      category: "Prevention",
      question: "For how long should you wash your hands to be effective?",
      options: [
        "5 seconds",
        "10 seconds",
        "20 seconds",
        "1 minute"
      ],
      correctAnswer: 2,
      explanation: "Hands should be washed for at least 20 seconds with soap and water.",
      difficulty: "easy"
    },
    
    // Vaccination Questions
    {
      id: 15,
      category: "Vaccination",
      question: "What do vaccines contain to help build immunity?",
      options: [
        "Antibiotics",
        "Weakened or killed pathogens",
        "Vitamins",
        "Steroids"
      ],
      correctAnswer: 1,
      explanation: "Vaccines contain weakened, killed, or parts of pathogens to help the immune system recognize and fight diseases.",
      difficulty: "medium"
    },
    
    // More questions to reach 50+ for variety
    {
      id: 16,
      category: "COVID-19",
      question: "Which organ does COVID-19 primarily affect?",
      options: [
        "Brain",
        "Liver",
        "Lungs",
        "Stomach"
      ],
      correctAnswer: 2,
      explanation: "COVID-19 is primarily a respiratory illness that affects the lungs.",
      difficulty: "easy"
    },
    
    {
      id: 17,
      category: "Tuberculosis",
      question: "Is tuberculosis curable?",
      options: [
        "No, it's always fatal",
        "Yes, with proper treatment",
        "Only in young people",
        "Only if caught very early"
      ],
      correctAnswer: 1,
      explanation: "Tuberculosis is completely curable with proper treatment and medication compliance.",
      difficulty: "easy"
    },
    
    {
      id: 18,
      category: "Dengue",
      question: "What is the best way to prevent dengue?",
      options: [
        "Taking antibiotics",
        "Eliminating mosquito breeding sites",
        "Drinking more water",
        "Eating spicy food"
      ],
      correctAnswer: 1,
      explanation: "The best prevention is eliminating stagnant water where Aedes mosquitoes breed.",
      difficulty: "medium"
    },
    
    {
      id: 19,
      category: "General Health",
      question: "What should you do if you have persistent fever for more than 3 days?",
      options: [
        "Ignore it",
        "Take more rest",
        "Consult a doctor",
        "Exercise more"
      ],
      correctAnswer: 2,
      explanation: "Persistent fever for more than 3 days requires medical consultation.",
      difficulty: "easy"
    },
    
    {
      id: 20,
      category: "Hygiene",
      question: "Which of these is the most hygienic?",
      options: [
        "Sharing personal items",
        "Using hand sanitizer when soap isn't available",
        "Never washing hands",
        "Touching face frequently"
      ],
      correctAnswer: 1,
      explanation: "Hand sanitizer is a good alternative when soap and water aren't available.",
      difficulty: "easy"
    }
  ],
  
  hi: [
    {
      id: 1,
      category: "COVID-19",
      question: "COVID-19 मुख्य रूप से कैसे फैलता है?",
      options: [
        "दूषित भोजन के माध्यम से",
        "श्वसन की बूंदों के माध्यम से",
        "कीड़ों के काटने से",
        "त्वचा के संपर्क से"
      ],
      correctAnswer: 1,
      explanation: "COVID-19 मुख्य रूप से श्वसन की बूंदों के माध्यम से फैलता है जब संक्रमित व्यक्ति खांसता, छींकता या बात करता है।",
      difficulty: "easy"
    },
    {
      id: 2,
      category: "क्षय रोग",
      question: "क्षय रोग (टीबी) किस बैक्टीरिया से होता है?",
      options: [
        "स्टेफिलोकॉकस ऑरियस",
        "माइकोबैक्टीरियम ट्यूबरकुलोसिस",
        "स्ट्रेप्टोकॉकस न्यूमोनिया",
        "एशेरिचिया कोलाई"
      ],
      correctAnswer: 1,
      explanation: "क्षय रोग माइकोबैक्टीरियम ट्यूबरकुलोसिस बैक्टीरिया के कारण होता है।",
      difficulty: "medium"
    }
    // Add more Hindi questions...
  ],
  
  or: [
    {
      id: 1,
      category: "COVID-19",
      question: "COVID-19 ମୁଖ୍ୟତଃ କିପରି ବ୍ୟାପିଥାଏ?",
      options: [
        "ଦୂଷିତ ଖାଦ୍ୟ ମାଧ୍ୟମରେ",
        "ଶ୍ୱାସକ୍ରିୟା ବୁନ୍ଦା ମାଧ୍ୟମରେ",
        "କୀଟପତଙ୍ଗ କାମୁଡ଼ିବାରୁ",
        "ଚର୍ମ ସମ୍ପର୍କରୁ"
      ],
      correctAnswer: 1,
      explanation: "COVID-19 ମୁଖ୍ୟତଃ ଶ୍ୱାସକ୍ରିୟା ବୁନ୍ଦା ମାଧ୍ୟମରେ ବ୍ୟାପିଥାଏ ଯେତେବେଳେ ସଂକ୍ରମିତ ବ୍ୟକ୍ତି କାଶ, ଛିଙ୍କ କିମ୍ବା କଥା କୁହନ୍ତି।",
      difficulty: "easy"
    }
    // Add more Odia questions...
  ]
};

export const getDailyMCQs = (language = 'en', date = new Date()) => {
  const questions = healthMCQs[language] || healthMCQs.en;
  const dateString = date.toDateString();
  
  // Use date as seed for consistent daily questions
  const seed = dateString.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  // Shuffle questions based on date seed
  const shuffled = [...questions].sort(() => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x) - 0.5;
  });
  
  return shuffled.slice(0, 10);
};
