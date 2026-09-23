export interface FeatureItem {
  id: string;
  iconName: string;
  title: string;
  description: string;
  tag?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  location: string;
  avatar: string;
  rating: number;
  quote: string;
}

export const FEATURES_DATA: FeatureItem[] = [
  {
    id: 'live-tracking',
    iconName: 'MapPin',
    title: 'Sub-Second Live GPS Telemetry',
    description: 'Track your child\'s school van position on an interactive live map with instant position updates powered by Socket.io websockets.',
    tag: 'Real-Time'
  },
  {
    id: 'offline-resilience',
    iconName: 'WifiOff',
    title: 'Resilient Connection Drop Fallback',
    description: 'When cell reception fails, KidsRoute preserves the last known GPS location and reverse-geocodes the city name via Nominatim so parents are never left guessing.',
    tag: 'Patent-Pending'
  },
  {
    id: 'instant-alerts',
    iconName: 'BellRing',
    title: 'Boarding & Drop-Off Alerts',
    description: 'Parents receive push and WebSocket notifications the exact moment their child steps onto the van or alights at the school gate.',
    tag: 'Instant'
  },
  {
    id: 'sos-panic',
    iconName: 'AlertTriangle',
    title: 'One-Tap Emergency SOS Trigger',
    description: 'Drivers can instantly trigger a high-priority emergency panic signal that alerts all parents and school dispatchers with one tap.',
    tag: 'Safety'
  },
  {
    id: 'absence-mgr',
    iconName: 'CalendarX',
    title: 'One-Tap Absence Management',
    description: 'Notify drivers early when your child is sick or absent, automatically optimizing pickup routes and preventing unnecessary delays.',
    tag: 'Efficiency'
  },
  {
    id: 'fee-tracking',
    iconName: 'CreditCard',
    title: 'Integrated Transport Dues & Receipts',
    description: 'Parents can view monthly transport fees, upload payment receipts, and receive digital confirmation from van operators seamlessly.',
    tag: 'Finance'
  }
];

export const TESTIMONIALS_DATA: TestimonialItem[] = [
  {
    id: '1',
    name: 'Dilani Perera',
    role: 'Parent of 2 Students',
    location: 'Kandy, Sri Lanka',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    quote: 'Knowing exactly when van #04 approaches our lane means no more waiting in the rain. The instant boarding alert gives me total peace of mind every morning!'
  },
  {
    id: '2',
    name: 'Kavinda Jayasinghe',
    role: 'School Van Driver (12 Yrs Exp)',
    location: 'Peradeniya Fleet',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    quote: 'The digital student roster on my smartphone simplifies morning pickups. Parents love getting live updates when heavy morning traffic delays the route.'
  },
  {
    id: '3',
    name: 'Dr. Nimal Wickramasinghe',
    role: 'School Principal',
    location: 'Hillwood College Region',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    quote: 'KidsRoute transformed our school transport administration. We have complete oversight over 15 vans, emergency response readiness, and total parent trust.'
  }
];

export const FAQ_DATA: FAQItem[] = [
  {
    question: 'Does the driver need expensive specialized GPS hardware?',
    answer: 'No! Drivers simply use any standard Android or iOS smartphone with the KidsRoute Mobile App. The app runs low-power background location services to broadcast telemetry.',
    category: 'Hardware'
  },
  {
    question: 'What happens when the driver enters a cellular dead zone?',
    answer: 'KidsRoute features Resilient Offline Mode. When connection drops, parents see an offline indicator along with the van\'s last recorded GPS coordinates and the reverse-geocoded city name (e.g. "Last Known: Kandy City Center").',
    category: 'Connectivity'
  },
  {
    question: 'How is student location data secured?',
    answer: 'We enforce enterprise JWT authentication and strict Role-Based Access Control (RBAC). Only verified parents can track the specific van carrying their registered children.',
    category: 'Security'
  },
  {
    question: 'Can parents mark a child absent for multiple days?',
    answer: 'Yes! Parents can mark single-day or multi-day absences directly from the mobile or web app. The driver\'s pickup roster updates instantly.',
    category: 'Features'
  },
  {
    question: 'How do school van operators get started?',
    answer: 'School administrators or independent fleet owners can request a free demo or register their account in minutes. Drivers and parents receive simple invite links to join their assigned routes.',
    category: 'Setup'
  }
];
