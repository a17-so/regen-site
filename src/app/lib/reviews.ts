/**
 * Member stories.
 *
 * ⚠️ STILL NOT REAL REVIEWS, read this before launch.
 *
 * The names, ages and regions below are invented to make the layout readable.
 * They are written as ordinary members with ordinary experiences, and every
 * one of them stops short of a medical claim. Two rules were applied and
 * should stay applied to anything that replaces them:
 *
 *   1. No credentialed clinicians. The previous build had "Dr. Lena K.,
 *      Longevity coach" and "Claire D., Anti-aging clinician" endorsing a
 *      health product. A fabricated professional endorsement is the single
 *      riskiest kind of invented review, and those are not coming back.
 *   2. No outcome claims. Nothing here says a compound cured, treated, or
 *      reliably produced a result, only what the person did and noticed.
 *
 * `REVIEWS_ARE_PLACEHOLDER` stays true until these are real App Store or
 * Trustpilot reviews, used with permission and attributed as written. The
 * on-page banner was removed at the user's request; this flag is the rail.
 */
export const REVIEWS_ARE_PLACEHOLDER = true;

export interface Review {
  id: string;
  body: string;
  name: string;
  age: number;
  region: string;
  /** How long they've been a member. */
  status: string;
  /** Renewal state, the "re-tested" chip in the reference, in our language. */
  renewal?: "Renewed" | "Yearly";
  /** Longer stories anchor the stagger. */
  long?: boolean;
}

export const REVIEWS: Review[] = [
  {
    id: "r1",
    body: "I had three vials going and a notes app that made sense to nobody but me. Putting it in one place was the whole fix, I stopped re-deriving the same math every Sunday just to work out what I was drawing.",
    name: "Marcus T",
    age: 34,
    region: "Austin, TX",
    status: "Since Feb",
    renewal: "Yearly",
    long: true,
  },
  {
    id: "r2",
    body: "The reconstitution calculator caught that my draw didn't fit the syringe I'd picked. I'd have found that out the awkward way.",
    name: "Priya M",
    age: 29,
    region: "London, UK",
    status: "Since May",
  },
  {
    id: "r3",
    body: "Uploading old panels and seeing them charted against what I was actually running was the first time any of it connected.",
    name: "Jordan A",
    age: 41,
    region: "Toronto, CA",
    status: "Since Jan",
    renewal: "Renewed",
  },
  {
    id: "r4",
    body: "What sold me was the app telling me the evidence behind something I'd already bought was thin. I did not expect the thing I was paying for to argue with me, and I've trusted the rest of it more since.",
    name: "Sasha R",
    age: 37,
    region: "Berlin, DE",
    status: "Since Mar",
    long: true,
  },
  {
    id: "r5",
    body: "Logging meals against the dose window changed how I titrated. The pattern was obvious once it was in one view instead of two apps.",
    name: "Ben H",
    age: 45,
    region: "Manchester, UK",
    status: "Since Apr",
    renewal: "Renewed",
  },
  {
    id: "r6",
    body: "It flagged a marker drifting inside its normal range across three panels. Every individual reading was technically fine, so nobody had mentioned it. That's the part I'd never have caught on my own.",
    name: "Aisha O",
    age: 32,
    region: "Chicago, IL",
    status: "Since Dec",
    renewal: "Yearly",
    long: true,
  },
  {
    id: "r7",
    body: "Expiry tracking stopped me using a vial I'd reconstituted and completely forgotten about.",
    name: "Tom Z",
    age: 38,
    region: "San Diego, CA",
    status: "Since Jun",
  },
  {
    id: "r8",
    body: "Asked it about an interaction and it gave me the citation. I went and read the paper. It was real, and it said what the app said it said.",
    name: "Ravi P",
    age: 30,
    region: "Singapore",
    status: "Since Feb",
    renewal: "Renewed",
  },
  {
    id: "r10",
    body: "I stopped guessing what was worth retesting. The app tells me when enough time has passed that a new panel would actually say something different.",
    name: "Nadia F",
    age: 36,
    region: "Lisbon, PT",
    status: "Since Apr",
    renewal: "Renewed",
  },
  {
    id: "r9",
    body: "I came in wanting one number to go up. I left with a much better sense of which numbers were worth watching at all.",
    name: "Elena K",
    age: 43,
    region: "Amsterdam, NL",
    status: "Since Mar",
  },
];

/**
 * ⚠️ PLACEHOLDER STATISTICS. A percentage on a health site is a claim, and an
 * unsourced one is a liability, so these render as em-dashes rather than
 * invented numbers. Compute them from the real member base before publishing;
 * the footnote beneath them on the page already describes what they must be.
 */
export const REVIEW_STATS = [
  { value: "·", unit: "%", label: "of members find something a standard panel missed" },
  { value: "·", unit: "%", label: "log a protocol change after their first panel" },
  { value: "·", unit: "%", label: "are still tracking after three months" },
];
