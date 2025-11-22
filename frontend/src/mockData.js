export const mockEvents = [
  {
    id: 'e1',
    name: 'Командный митап Planora',
    date: '25.11.2025',
    time: '18:30',
    location: 'Минск, офис, зал A',
    status: 'active',
    description: 'Митап для команды с обзором продукта и мини–ретроспективой.',
    rsvpAccepted: 18,
    rsvpPending: 7,
    rsvpDeclined: 3,
  },
  {
    id: 'e2',
    name: 'Новогодний корпоратив',
    date: '27.12.2025',
    time: '19:00',
    location: 'Минск, ресторан «Aurora»',
    status: 'draft',
    description: 'Подготовка к новогоднему корпоративу компании.',
    rsvpAccepted: 0,
    rsvpPending: 45,
    rsvpDeclined: 0,
  },
];

export const mockGuests = [
  {
    id: 'g1',
    name: 'Анастасия Ковальчук',
    email: 'a.kovalchuk@example.com',
    status: 'accepted',
  },
  {
    id: 'g2',
    name: 'Илья Борисов',
    email: 'i.borisov@example.com',
    status: 'pending',
  },
  {
    id: 'g3',
    name: 'Мария Левченко',
    email: 'm.levchenko@example.com',
    status: 'accepted',
  },
  {
    id: 'g4',
    name: 'Никита Орлов',
    email: 'n.orlov@example.com',
    status: 'declined',
  },
];

export const mockAdminUsers = [
  {
    id: 'u1',
    name: 'Анна Сергеева',
    email: 'anna.sergeeva@company.com',
    role: 'admin',
    status: 'active',
    eventsCount: 0,
    lastLogin: 'сегодня, 10:24',
  },
  {
    id: 'u2',
    name: 'Дмитрий Петров',
    email: 'd.petrov@company.com',
    role: 'coordinator',
    status: 'active',
    eventsCount: 7,
    lastLogin: 'вчера, 17:05',
  },
  {
    id: 'u3',
    name: 'Екатерина Новик',
    email: 'e.novik@company.com',
    role: 'reception',
    status: 'active',
    eventsCount: 12,
    lastLogin: 'на этой неделе',
  },
  {
    id: 'u4',
    name: 'Игорь Климов',
    email: 'i.klimov@company.com',
    role: 'coordinator',
    status: 'blocked',
    eventsCount: 2,
    lastLogin: 'месяц назад',
  },
];
