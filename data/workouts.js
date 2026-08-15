// Conteúdo do app: treinos e planos de dieta.
// Free = amostra grátis (sem cadastro no Stripe). Premium = liberado só
// para assinantes ativos (ver api/workouts.js).

const freeWorkouts = [
  {
    id: 'free-fullbody-1',
    title: 'Full Body Iniciante',
    level: 'Iniciante',
    muscle_group: 'Corpo todo',
    duration_min: 35,
    exercises: [
      { name: 'Agachamento livre', sets: 3, reps: '12-15' },
      { name: 'Flexão de braço (joelhos se precisar)', sets: 3, reps: '8-12' },
      { name: 'Remada com halteres', sets: 3, reps: '12' },
      { name: 'Prancha abdominal', sets: 3, reps: '30s' },
    ],
  },
  {
    id: 'free-cardio-abdomen',
    title: 'Cardio + Abdômen',
    level: 'Iniciante',
    muscle_group: 'Cardio / Core',
    duration_min: 25,
    exercises: [
      { name: 'Polichinelo', sets: 4, reps: '30s' },
      { name: 'Corrida estacionária', sets: 4, reps: '30s' },
      { name: 'Abdominal supra', sets: 3, reps: '15-20' },
      { name: 'Elevação de pernas', sets: 3, reps: '15' },
    ],
  },
];

const premiumWorkouts = [
  {
    id: 'premium-peito-triceps',
    title: 'Peito e Tríceps',
    level: 'Intermediário',
    muscle_group: 'Peito / Tríceps',
    duration_min: 50,
    exercises: [
      { name: 'Supino reto com barra', sets: 4, reps: '8-10' },
      { name: 'Supino inclinado com halteres', sets: 3, reps: '10-12' },
      { name: 'Crucifixo', sets: 3, reps: '12' },
      { name: 'Tríceps testa', sets: 3, reps: '10-12' },
      { name: 'Tríceps corda', sets: 3, reps: '12-15' },
    ],
  },
  {
    id: 'premium-costas-biceps',
    title: 'Costas e Bíceps',
    level: 'Intermediário',
    muscle_group: 'Costas / Bíceps',
    duration_min: 50,
    exercises: [
      { name: 'Puxada frontal', sets: 4, reps: '10-12' },
      { name: 'Remada curvada', sets: 4, reps: '8-10' },
      { name: 'Remada baixa (cabo)', sets: 3, reps: '12' },
      { name: 'Rosca direta', sets: 3, reps: '10-12' },
      { name: 'Rosca martelo', sets: 3, reps: '12' },
    ],
  },
  {
    id: 'premium-pernas-forca',
    title: 'Pernas — Força',
    level: 'Avançado',
    muscle_group: 'Pernas',
    duration_min: 55,
    exercises: [
      { name: 'Agachamento livre', sets: 5, reps: '5' },
      { name: 'Leg press', sets: 4, reps: '10' },
      { name: 'Cadeira extensora', sets: 3, reps: '12-15' },
      { name: 'Mesa flexora', sets: 3, reps: '12-15' },
      { name: 'Panturrilha em pé', sets: 4, reps: '15-20' },
    ],
  },
  {
    id: 'premium-gluteos',
    title: 'Glúteos e Posterior',
    level: 'Intermediário',
    muscle_group: 'Glúteos / Posterior',
    duration_min: 45,
    exercises: [
      { name: 'Elevação de quadril (hip thrust)', sets: 4, reps: '10-12' },
      { name: 'Stiff com halteres', sets: 3, reps: '12' },
      { name: 'Afundo búlgaro', sets: 3, reps: '10 cada lado' },
      { name: 'Abdução de quadril no cabo', sets: 3, reps: '15' },
    ],
  },
  {
    id: 'premium-ombros',
    title: 'Ombros Completo',
    level: 'Intermediário',
    muscle_group: 'Ombros',
    duration_min: 40,
    exercises: [
      { name: 'Desenvolvimento com halteres', sets: 4, reps: '10' },
      { name: 'Elevação lateral', sets: 4, reps: '12-15' },
      { name: 'Elevação frontal', sets: 3, reps: '12' },
      { name: 'Crucifixo inverso', sets: 3, reps: '12-15' },
    ],
  },
  {
    id: 'premium-hiit',
    title: 'HIIT Queima Gordura',
    level: 'Intermediário',
    muscle_group: 'Cardio',
    duration_min: 25,
    exercises: [
      { name: 'Burpee', sets: 5, reps: '40s / 20s descanso' },
      { name: 'Mountain climber', sets: 5, reps: '40s / 20s descanso' },
      { name: 'Agachamento com salto', sets: 5, reps: '40s / 20s descanso' },
      { name: 'Prancha com toque no ombro', sets: 5, reps: '40s / 20s descanso' },
    ],
  },
  {
    id: 'premium-core-avancado',
    title: 'Core Avançado',
    level: 'Avançado',
    muscle_group: 'Abdômen',
    duration_min: 30,
    exercises: [
      { name: 'Prancha com elevação de perna', sets: 4, reps: '30-40s' },
      { name: 'Abdominal bicicleta', sets: 4, reps: '20' },
      { name: 'Elevação de pernas na barra', sets: 3, reps: '10-12' },
      { name: 'Russian twist com peso', sets: 3, reps: '20' },
    ],
  },
  {
    id: 'premium-mobilidade',
    title: 'Mobilidade e Recuperação',
    level: 'Todos os níveis',
    muscle_group: 'Corpo todo',
    duration_min: 20,
    exercises: [
      { name: 'Alongamento de posterior de coxa', sets: 2, reps: '30s' },
      { name: 'Mobilidade de quadril (90/90)', sets: 2, reps: '10 cada lado' },
      { name: 'Rotação de tronco', sets: 2, reps: '10 cada lado' },
      { name: 'Respiração diafragmática', sets: 1, reps: '2min' },
    ],
  },
];

const premiumDietPlans = [
  {
    id: 'diet-emagrecimento',
    title: 'Emagrecimento',
    goal: 'Déficit calórico moderado, alta saciedade',
    meals: [
      'Café da manhã: ovos mexidos + fruta + café sem açúcar',
      'Almoço: proteína magra + salada à vontade + 4 col. de arroz/batata-doce',
      'Lanche: iogurte natural + castanhas',
      'Jantar: proteína magra + legumes cozidos/grelhados',
    ],
  },
  {
    id: 'diet-hipertrofia',
    title: 'Hipertrofia',
    goal: 'Superávit calórico controlado, foco em proteína',
    meals: [
      'Café da manhã: aveia + whey/ovo + banana',
      'Almoço: proteína + arroz + feijão + legumes',
      'Pré-treino: pão integral + pasta de amendoim',
      'Pós-treino: whey protein ou proteína magra + carboidrato',
      'Jantar: proteína + carboidrato + salada',
    ],
  },
  {
    id: 'diet-manutencao',
    title: 'Manutenção',
    goal: 'Calorias em equilíbrio, hábito sustentável',
    meals: [
      'Café da manhã: opção proteica + carboidrato + fruta',
      'Almoço: prato balanceado (proteína, carboidrato, legumes)',
      'Lanche: fruta ou iogurte',
      'Jantar: prato leve e balanceado',
    ],
  },
];

module.exports = { freeWorkouts, premiumWorkouts, premiumDietPlans };
