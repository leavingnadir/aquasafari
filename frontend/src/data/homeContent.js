// All static content for the homepage lives here, so Home.jsx only has to
// import data instead of mixing content with layout code.


// Featured boats
import bowrider from "../assets/images/bowrider.jpg";
import catamaran from "../assets/images/catamaran.webp";
import cuddy from "../assets/images/cuddy.jpg";
import yacht from "../assets/images/yacht.jpeg";

// Destinations + activities
import destBentota from "../assets/images/dest-bentota.jpg";
import destTrinco from "../assets/images/dest-trincomalee.jpg";
import destMirissa from "../assets/images/dest-mirissa.jpg";
import destKalpitiya from "../assets/images/dest-kalpitiya.jpg";
import actSnorkel from "../assets/images/act-snorkel.jpg";
import actHiking from "../assets/images/act-hiking.jpg";
import actMountains from "../assets/images/act-mountains.jpg";


export const BOATS = [
  {
    img: bowrider,
    name: "Bowrider",
    place: "Bentota, Sri Lanka",
    people: 2,
    cabins: 1,
    length: "12.8 m",
    price: "Rs 15,500",
    rating: 4.9,
    dates: "Sep 12 – 19",
  },
  {
    img: catamaran,
    name: "Catamaran",
    place: "Trincomalee, Sri Lanka",
    people: 6,
    cabins: 2,
    length: "14.2 m",
    price: "Rs 19,800",
    rating: 5.0,
    dates: "Sep 3 – 10",
  },
  {
    img: cuddy,
    name: "Cuddy",
    place: "Kalpitiya, Sri Lanka",
    people: 7,
    cabins: 2,
    length: "16.3 m",
    price: "Rs 30,200",
    rating: 4.8,
    dates: "Sep 5 – 8",
  },
  {
    img: yacht,
    name: "Yacht",
    place: "Mirissa, Sri Lanka",
    people: 12,
    cabins: 4,
    length: "8.4 m",
    price: "Rs 80,000",
    rating: 4.9,
    dates: "Sep 20 – 24",
  },
];

export const DESTINATIONS = {
  Bentota: {
    img: destBentota,
    tagline: "River & Lagoon Safari",
    copy: "A calm river delta made for slow safaris — glide past mangroves, spot kingfishers, then dock for a beachside lunch.",
    spots: ["Bentota River Mouth", "Madu Ganga Wetlands"],
  },
  Trincomalee: {
    img: destTrinco,
    tagline: "Whale Watching Bay",
    copy: "Deep natural harbour waters bring blue whales and spinner dolphins close to shore between May and September.",
    spots: ["Pigeon Island", "Marble Bay"],
  },
  Mirissa: {
    img: destMirissa,
    tagline: "South Coast Whale Route",
    copy: "The island's best-known whale watching launch point, with short reef hops and sunset speedboat runs.",
    spots: ["Mirissa Harbour", "Coconut Tree Hill"],
  },
  Kalpitiya: {
    img: destKalpitiya,
    tagline: "Dolphin & Lagoon Kite Coast",
    copy: "Pods of spinner dolphins in the open sea by morning, flat lagoon water for kite safaris by afternoon.",
    spots: ["Kalpitiya Lagoon", "Dutch Bay"],
  },
};

export const ACTIVITIES = [
  { img: actSnorkel, label: "Try snorkelling" },
  { img: actHiking, label: "or coastal hiking" },
  { img: actMountains, label: "between safari days" },
];

export const TESTIMONIALS = [
  { quote: "The booking flow was simple and our guide was better than the photos suggested.", name: "N. Fernando", align: "left" },
  { quote: "Fast, friendly, and completely stress-free from booking to boarding.", name: "T. Silva", align: "right" },
  { quote: "Our skipper knew the lagoon by heart — support helped us plan the whole route.", name: "A. Perera", align: "left" },
  { quote: "Everything from payment to boarding just worked, first try.", name: "R. Jayasuriya", align: "right" },
];

export const FAQS = [
  {
    q: "How do I book a boat safari?",
    a: "Search by departure point, date and boat type, choose a boat from the results, then confirm and pay securely to lock in your slot.",
  },
  {
    q: "Do I need experience to join a safari?",
    a: "No — every trip is run by a licensed skipper and guide. You just need to be able to board and follow onboard safety instructions.",
  },
  { q: "What payment methods do you accept?", a: "Card, bank transfer and mobile wallet payments are all supported at checkout." },
  { q: "Are children allowed on board?", a: "Yes, most boats welcome children with a guardian; life vests in child sizes are provided on request." },
  { q: "What happens if the weather turns bad?", a: "Trips affected by unsafe weather are rescheduled or fully refunded — you'll be notified as early as possible." },
  { q: "What is your cancellation policy?", a: "Free cancellation up to 48 hours before departure; see the full policy for later changes." },
];