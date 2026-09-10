export default {
  slug: 'go2-pro-energy-planner',
  title: 'Go2 PRO Energy Planner',
  group: 'Unitree Go2 PRO',
  color: '#966013',
  tagline: {
    en: 'Make mission energy assumptions and return reserves visible.',
    pt: 'Torne visíveis as hipóteses de energia e a reserva para retorno.',
  },
  description:
    'EN: Mission energy and reserve prototype for Unitree Go2 PRO planning. PT: Protótipo de planejamento de energia e reserva de missões relacionadas ao Unitree Go2 PRO.',
  topics: ['unitree-go2', 'robotics', 'energy', 'mission-planning', 'simulation', 'javascript'],
  setting: {
    key: 'reservePct',
    label: {
      en: 'Reserve (%)',
      pt: 'Reserva (%)',
    },
    min: 0,
    max: 100,
    step: 1,
  },
};
