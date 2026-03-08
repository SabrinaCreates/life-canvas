// Frontend-only mock data so the demo always looks populated
// regardless of database state.

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split("T")[0];
}

export interface MockEntry {
  id: string;
  entry_date: string;
  mood: "very_positive" | "positive" | "neutral" | "stressed" | "sad";
  content: string;
  entry_type: "text" | "photo" | "voice";
  bucket_id: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
  transcript: string | null;
  buckets: { name: string } | null;
  entry_tags: { tag: string }[];
  people_mentions: { person_name: string }[];
}

const bucketMap: Record<string, { name: string }> = {
  health: { name: "Health" },
  career: { name: "Career" },
  family: { name: "Family" },
  travel: { name: "Travel" },
  friendships: { name: "Friendships" },
  growth: { name: "Personal Growth" },
};

export const mockEntries: MockEntry[] = [
  {
    id: "mock-01", entry_date: daysAgo(1), mood: "positive", content: "Met Sarah for coffee today. We talked about career goals and laughed about old college memories. It felt great reconnecting.", entry_type: "text", bucket_id: "b-friends", user_id: "demo", created_at: "", updated_at: "", transcript: null,
    buckets: bucketMap.friendships, entry_tags: [{ tag: "Friendships" }], people_mentions: [{ person_name: "Sarah" }],
  },
  {
    id: "mock-02", entry_date: daysAgo(2), mood: "very_positive", content: "Ran my first 5K without stopping! Legs are sore but the runner's high is real. Time to sign up for a 10K.", entry_type: "text", bucket_id: "b-health", user_id: "demo", created_at: "", updated_at: "", transcript: null,
    buckets: bucketMap.health, entry_tags: [{ tag: "Exercise" }], people_mentions: [],
  },
  {
    id: "mock-03", entry_date: daysAgo(3), mood: "positive", content: "Had a great team stand-up today. The project is ahead of schedule. Manager said my presentation deck was the best she'd seen.", entry_type: "text", bucket_id: "b-career", user_id: "demo", created_at: "", updated_at: "", transcript: null,
    buckets: bucketMap.career, entry_tags: [{ tag: "Career Growth" }], people_mentions: [],
  },
  {
    id: "mock-04", entry_date: daysAgo(4), mood: "neutral", content: "Quiet day at home. Read a few chapters of a new book about stoicism. Sometimes the best days are the ones with no plans.", entry_type: "text", bucket_id: "b-growth", user_id: "demo", created_at: "", updated_at: "", transcript: null,
    buckets: bucketMap.growth, entry_tags: [{ tag: "Mindfulness" }], people_mentions: [],
  },
  {
    id: "mock-05", entry_date: daysAgo(5), mood: "very_positive", content: "Dinner with Alex and David at the new Italian place downtown. The pasta was incredible. Friendship is medicine.", entry_type: "text", bucket_id: "b-friends", user_id: "demo", created_at: "", updated_at: "", transcript: null,
    buckets: bucketMap.friendships, entry_tags: [{ tag: "Friendships" }], people_mentions: [{ person_name: "Alex" }, { person_name: "David" }],
  },
  {
    id: "mock-06", entry_date: daysAgo(6), mood: "stressed", content: "Deadline crunch at work. Stayed late to finish the quarterly report. Need to find better ways to manage stress.", entry_type: "text", bucket_id: "b-career", user_id: "demo", created_at: "", updated_at: "", transcript: null,
    buckets: bucketMap.career, entry_tags: [{ tag: "Career Growth" }], people_mentions: [],
  },
  {
    id: "mock-07", entry_date: daysAgo(7), mood: "positive", content: "Morning walk through the botanical garden. The cherry blossoms are starting to bloom. Took some amazing photos.", entry_type: "photo", bucket_id: "b-growth", user_id: "demo", created_at: "", updated_at: "", transcript: null,
    buckets: bucketMap.growth, entry_tags: [{ tag: "Mindfulness" }], people_mentions: [],
  },
  {
    id: "mock-08", entry_date: daysAgo(8), mood: "very_positive", content: "Got the news today that I received a raise at work. It feels good to see the hard work paying off. Celebrated with coffee and took a moment to reflect on how far I've come.", entry_type: "text", bucket_id: "b-career", user_id: "demo", created_at: "", updated_at: "", transcript: null,
    buckets: bucketMap.career, entry_tags: [{ tag: "Career Growth" }], people_mentions: [],
  },
  {
    id: "mock-09", entry_date: daysAgo(9), mood: "positive", content: "Called Mom and Dad tonight. They're planning a trip to visit next month. Can't wait to show them around the city.", entry_type: "voice", bucket_id: "b-family", user_id: "demo", created_at: "", updated_at: "", transcript: "Called Mom and Dad tonight...",
    buckets: bucketMap.family, entry_tags: [{ tag: "Family" }], people_mentions: [{ person_name: "Mom" }, { person_name: "Dad" }],
  },
  {
    id: "mock-10", entry_date: daysAgo(10), mood: "positive", content: "Tried a new yoga class this morning. The instructor was great and the stretching really helped with my back pain from sitting all day.", entry_type: "text", bucket_id: "b-health", user_id: "demo", created_at: "", updated_at: "", transcript: null,
    buckets: bucketMap.health, entry_tags: [{ tag: "Exercise" }], people_mentions: [],
  },
  {
    id: "mock-11", entry_date: daysAgo(12), mood: "very_positive", content: "Sunset drive home from the coast. The sky was on fire with oranges and pinks. Sometimes the best moments are unplanned.", entry_type: "photo", bucket_id: "b-growth", user_id: "demo", created_at: "", updated_at: "", transcript: null,
    buckets: bucketMap.growth, entry_tags: [{ tag: "Travel" }], people_mentions: [],
  },
  {
    id: "mock-12", entry_date: daysAgo(14), mood: "positive", content: "Gym session with Alex. We pushed each other on deadlifts and bench press. Feeling stronger every week.", entry_type: "text", bucket_id: "b-health", user_id: "demo", created_at: "", updated_at: "", transcript: null,
    buckets: bucketMap.health, entry_tags: [{ tag: "Exercise" }], people_mentions: [{ person_name: "Alex" }],
  },
  {
    id: "mock-13", entry_date: daysAgo(15), mood: "neutral", content: "Reflective evening. Journaled about where I want to be in 5 years. Career trajectory feels right but I want more travel.", entry_type: "text", bucket_id: "b-growth", user_id: "demo", created_at: "", updated_at: "", transcript: null,
    buckets: bucketMap.growth, entry_tags: [{ tag: "Career Growth" }, { tag: "Travel" }], people_mentions: [],
  },
  {
    id: "mock-14", entry_date: daysAgo(17), mood: "sad", content: "Missing my college friends today. Everyone's scattered across the country. Made plans to video call this weekend.", entry_type: "text", bucket_id: "b-friends", user_id: "demo", created_at: "", updated_at: "", transcript: null,
    buckets: bucketMap.friendships, entry_tags: [{ tag: "Friendships" }], people_mentions: [],
  },
  {
    id: "mock-15", entry_date: daysAgo(18), mood: "very_positive", content: "Spent the afternoon at the zoo with my family. Watching the kids get excited about the giraffes and elephants reminded me how special simple days together can be.", entry_type: "photo", bucket_id: "b-family", user_id: "demo", created_at: "", updated_at: "", transcript: null,
    buckets: bucketMap.family, entry_tags: [{ tag: "Family" }], people_mentions: [{ person_name: "Mom" }, { person_name: "Dad" }],
  },
  {
    id: "mock-16", entry_date: daysAgo(20), mood: "positive", content: "Coffee with Sarah before work. She's thinking about switching careers. I shared my experience and we brainstormed ideas.", entry_type: "text", bucket_id: "b-friends", user_id: "demo", created_at: "", updated_at: "", transcript: null,
    buckets: bucketMap.friendships, entry_tags: [{ tag: "Career Growth" }, { tag: "Friendships" }], people_mentions: [{ person_name: "Sarah" }],
  },
  {
    id: "mock-17", entry_date: daysAgo(22), mood: "positive", content: "Booked flights to Japan for cherry blossom season! Been dreaming about this trip for years. Research mode: activated.", entry_type: "text", bucket_id: "b-travel", user_id: "demo", created_at: "", updated_at: "", transcript: null,
    buckets: bucketMap.travel, entry_tags: [{ tag: "Travel" }], people_mentions: [],
  },
  {
    id: "mock-18", entry_date: daysAgo(24), mood: "stressed", content: "Tough conversation at work about project priorities. I need to be better at saying no. Taking a walk to decompress.", entry_type: "voice", bucket_id: "b-career", user_id: "demo", created_at: "", updated_at: "", transcript: "Tough conversation at work...",
    buckets: bucketMap.career, entry_tags: [{ tag: "Career Growth" }], people_mentions: [],
  },
  {
    id: "mock-19", entry_date: daysAgo(26), mood: "positive", content: "Morning coffee on the balcony. Watched the sunrise and planned out my week. Small rituals make a big difference.", entry_type: "photo", bucket_id: "b-growth", user_id: "demo", created_at: "", updated_at: "", transcript: null,
    buckets: bucketMap.growth, entry_tags: [{ tag: "Mindfulness" }], people_mentions: [],
  },
  {
    id: "mock-20", entry_date: daysAgo(28), mood: "very_positive", content: "Family dinner at Mom's house. She made her famous lasagna. David surprised everyone by showing up early. Lots of laughter.", entry_type: "text", bucket_id: "b-family", user_id: "demo", created_at: "", updated_at: "", transcript: null,
    buckets: bucketMap.family, entry_tags: [{ tag: "Family" }], people_mentions: [{ person_name: "Mom" }, { person_name: "David" }],
  },
];
