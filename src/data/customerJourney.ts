// src/data/customerJourney.ts

export type JourneyTouchPointId =
  | "thank-you-text"
  | "thank-you-email"
  | "ss-1-week"
  | "second-vehicle"
  | "ss-1-month"
  | "ss-3-months"
  | "ss-6-months"
  | "newsletter-monthly"
  | "reminder-1"
  | "reminder-2"
  | "reminder-3"
  | "reminder-4"
  | "reactivation-12"
  | "reactivation-18"
  | "reactivation-24";

export type JourneyTouchPoint = {
  id: JourneyTouchPointId;
  name: string;         // touch point name (no timing)
  interval: string;     // timing description
  channel: string;      // channel mix
  sent: number;
  vehicles: number;     // responses / vehicles
  responseRate: number; // %
  roas: number;         // x
};

export const JOURNEY_TOUCH_POINTS: JourneyTouchPoint[] = [
  {
    id: "thank-you-text",
    name: "Thank You Text",
    interval: "1 day after Service",
    channel: "Text Message",
    sent: 1850,
    vehicles: 420,
    responseRate: 22.7,
    roas: 9.5,
  },
  {
    id: "thank-you-email",
    name: "Thank You",
    interval: "1 day after Service",
    channel: "Email",
    sent: 1850,
    vehicles: 420,
    responseRate: 22.7,
    roas: 9.5,
  },
  {
    id: "ss-1-week",
    name: "Suggested Services",
    interval: "1 week after Service",
    channel: "Email",
    sent: 1760,
    vehicles: 310,
    responseRate: 17.6,
    roas: 12.1,
  },
  {
    id: "second-vehicle",
    name: "2nd Vehicle Invitation",
    interval: "10 days after Service",
    channel: "Email",
    sent: 900,
    vehicles: 150,
    responseRate: 16.7,
    roas: 10.3,
  },
  {
    id: "ss-1-month",
    name: "Suggested Services",
    interval: "1 month after Service",
    channel: "Email",
    sent: 1640,
    vehicles: 240,
    responseRate: 14.6,
    roas: 11.2,
  },
  {
    id: "ss-3-months",
    name: "Suggested Services",
    interval: "3 months after Service",
    channel: "Email",
    sent: 1520,
    vehicles: 230,
    responseRate: 15.1,
    roas: 10.9,
  },
  {
    id: "ss-6-months",
    name: "Suggested Services",
    interval: "6 months after Service",
    channel: "Email",
    sent: 1380,
    vehicles: 210,
    responseRate: 15.2,
    roas: 10.8,
  },
  {
    id: "newsletter-monthly",
    name: "Monthly Newsletter",
    interval: "Once a month",
    channel: "Email",
    sent: 4200,
    vehicles: 520,
    responseRate: 12.4,
    roas: 7.8,
  },
  {
    id: "reminder-1",
    name: "Reminder 1",
    interval: "5k after last Service",
    channel: "Postcard + Email + Text Message",
    sent: 1380,
    vehicles: 280,
    responseRate: 20.3,
    roas: 16.4,
  },
  {
    id: "reminder-2",
    name: "Reminder 2",
    interval: "30 days after Reminder 1",
    channel: "Postcard + Email + Text Message",
    sent: 980,
    vehicles: 142,
    responseRate: 14.5,
    roas: 10.7,
  },
  {
    id: "reminder-3",
    name: "Reminder 3",
    interval: "10k after last Service",
    channel: "Postcard + Email + Text Message",
    sent: 860,
    vehicles: 120,
    responseRate: 14.0,
    roas: 9.8,
  },
  {
    id: "reminder-4",
    name: "Reminder 4",
    interval: "15k after last Service",
    channel: "Postcard + Email + Text Message",
    sent: 740,
    vehicles: 105,
    responseRate: 14.2,
    roas: 9.4,
  },
  {
    id: "reactivation-12",
    name: "Reactivation",
    interval: "12 months after Service",
    channel: "Email",
    sent: 620,
    vehicles: 86,
    responseRate: 13.9,
    roas: 8.2,
  },
  {
    id: "reactivation-18",
    name: "Reactivation",
    interval: "18 months after Service",
    channel: "Email",
    sent: 480,
    vehicles: 64,
    responseRate: 13.3,
    roas: 7.5,
  },
  {
    id: "reactivation-24",
    name: "Reactivation",
    interval: "24 months after Service",
    channel: "Email",
    sent: 360,
    vehicles: 46,
    responseRate: 12.8,
    roas: 7.1,
  },
];

export const getJourneyTouchPointById = (id: string) =>
  JOURNEY_TOUCH_POINTS.find((tp) => tp.id === id);
