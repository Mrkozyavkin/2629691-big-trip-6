const eventTypes = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
const destinations = [
  {
    id: 1,
    name: 'Amsterdam',
    description: 'Amsterdam is the Netherlands’ capital, known for its artistic heritage, elaborate canal system and narrow houses with gabled facades.',
    photos: [
      {
        src: 'img/photos/1.jpg',
        description: 'Amsterdam street view',
      },
      {
        src: 'img/photos/2.jpg',
        description: 'Amsterdam city view',
      },
      {
        src: 'img/photos/3.jpg',
        description: 'Amsterdam canal view',
      },
    ],
  },
  {
    id: 2,
    name: 'Chamonix',
    description: 'Chamonix-Mont-Blanc is a resort area near the junction of France, Switzerland and Italy. At the base of Mont Blanc, it is renowned for its skiing.',
    photos: [
      {
        src: 'img/photos/1.jpg',
        description: 'Chamonix landscape',
      },
      {
        src: 'img/photos/2.jpg',
        description: 'Chamonix city view',
      },
      {
        src: 'img/photos/3.jpg',
        description: 'Chamonix street view',
      },
      {
        src: 'img/photos/4.jpg',
        description: 'Chamonix nature view',
      },
      {
        src: 'img/photos/5.jpg',
        description: 'Chamonix mountain view',
      },
    ],
  },
  {
    id: 3,
    name: 'Geneva',
    description: 'Geneva is a city in Switzerland that lies at the southern tip of expansive Lac Léman. Surrounded by the Alps and Jura mountains, the city has views of dramatic Mont Blanc.',
    photos: [
      {
        src: 'img/photos/1.jpg',
        description: 'Geneva landscape',
      },
      {
        src: 'img/photos/2.jpg',
        description: 'Geneva city view',
      },
      {
        src: 'img/photos/3.jpg',
        description: 'Geneva street view',
      },
      {
        src: 'img/photos/4.jpg',
        description: 'Geneva nature view',
      },
      {
        src: 'img/photos/5.jpg',
        description: 'Geneva mountain view',
      },
    ],
  },
];

const offers = [
  {
    id: 1,
    type: 'taxi',
    title: 'Order Uber',
    price: 20,
  },
  {
    id: 2,
    type: 'flight',
    title: 'Add luggage',
    price: 50,
  },
  {
    id: 3,
    type: 'flight',
    title: 'Switch to comfort',
    price: 80,
  },
  {
    id: 4,
    type: 'flight',
    title: 'Add meal',
    price: 15,
  },
  {
    id: 5,
    type: 'flight',
    title: 'Choose seats',
    price: 5,
  },
  {
    id: 6,
    type: 'flight',
    title: 'Travel by train',
    price: 40,
  },
  {
    id: 7,
    type: 'drive',
    title: 'Rent a car',
    price: 200,
  },
];

const points = [
  {
    id: 1,
    type: 'taxi',
    destinationId: 1,
    date: 'MAR 18',
    dateTime: '2019-03-18',
    startTime: '10:30',
    endTime: '11:00',
    startDateTime: '2019-03-18T10:30',
    endDateTime: '2019-03-18T11:00',
    duration: '30M',
    price: 20,
    offerIds: [1],
    isFavorite: true,
  },
  {
    id: 2,
    type: 'flight',
    destinationId: 2,
    date: 'MAR 18',
    dateTime: '2019-03-18',
    startTime: '12:25',
    endTime: '13:35',
    startDateTime: '2019-03-18T12:25',
    endDateTime: '2019-03-18T13:35',
    duration: '01H 10M',
    price: 160,
    offerIds: [2, 3],
    isFavorite: false,
  },
  {
    id: 3,
    type: 'drive',
    destinationId: 2,
    date: 'MAR 18',
    dateTime: '2019-03-18',
    startTime: '14:30',
    endTime: '16:05',
    startDateTime: '2019-03-18T14:30',
    endDateTime: '2019-03-18T16:05',
    duration: '01H 35M',
    price: 160,
    offerIds: [7],
    isFavorite: true,
  },
];

const newPoint = {
  id: 4,
  type: 'flight',
  destinationId: 3,
  startTime: '19/03/19 00:00',
  endTime: '19/03/19 00:00',
  price: '',
  offerIds: [2, 3],
};

const editPoint = {
  id: 5,
  type: 'flight',
  destinationId: 2,
  startTime: '18/03/19 12:25',
  endTime: '18/03/19 13:35',
  price: 160,
  offerIds: [2, 3],
};

export {destinations, eventTypes, offers, points, newPoint, editPoint};

