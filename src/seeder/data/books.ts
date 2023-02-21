import { AdminBookDto } from 'src/book/dtos/book.dto';

export const books: AdminBookDto[] = [
  {
    title: 'The 7 Habits of Highly Effective People',
    Author: 'Stephen R. Covey',
    loaned: true,
    loanedDate: new Date(2023, 1, 1, 10, 30, 0),
    returnDate: new Date(2023, 4, 1, 0, 0, 0),
  },
  {
    title: 'Atomic Habits',
    Author: 'James Clear',
    loaned: false,
  },
  {
    title: 'The Power of Now',
    Author: 'Eckhart Tolle',
    loaned: true,
    loanedDate: new Date(2022, 11, 2, 11, 30, 0),
    returnDate: new Date(2023, 3, 1, 0, 0, 0),
  },
  {
    title: 'Mindset',
    Author: 'Carol Dweck',
    loaned: false,
  },
  {
    title: 'The Subtle Art of Not Giving a F*ck',
    Author: 'Mark Manson',
    loaned: true,
    loanedDate: new Date(2023, 2, 1, 9, 30, 0),
    returnDate: new Date(2023, 5, 4, 0, 0, 0),
  },
  {
    title: 'Zero to One',
    Author: 'Blake Masters and Peter Thiel',
    loaned: false,
  },
];
