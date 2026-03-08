import friendsCoffee from "@/assets/demo/friends-coffee.jpg";
import dogPark from "@/assets/demo/dog-park.jpg";
import coffeeMorning from "@/assets/demo/coffee-morning.jpg";
import sunset from "@/assets/demo/sunset.jpg";
import walkingTrail from "@/assets/demo/walking-trail.jpg";
import dinnerFriends from "@/assets/demo/dinner-friends.jpg";
import botanicalGarden from "@/assets/demo/botanical-garden.jpg";
import running from "@/assets/demo/running.jpg";
import zooFamily from "@/assets/demo/zoo-family.jpg";
import careerCelebration from "@/assets/demo/career-celebration.jpg";

export const demoPhotos = {
  friendsCoffee,
  dogPark,
  coffeeMorning,
  sunset,
  walkingTrail,
  dinnerFriends,
  botanicalGarden,
  running,
  zooFamily,
  careerCelebration,
};

// Map entry content keywords to demo photos
export function getPhotoForEntry(content: string, entryType: string): string | null {
  const lower = content.toLowerCase();
  
  // Specific keyword matches first
  if (lower.includes("zoo") || lower.includes("giraffe") || lower.includes("elephant")) return zooFamily;
  if (lower.includes("raise") || lower.includes("promotion") || lower.includes("celebrated with coffee")) return careerCelebration;
  if (lower.includes("botanical") || lower.includes("garden") || lower.includes("cherry blossom")) return botanicalGarden;
  if (lower.includes("italian place") || lower.includes("dinner with")) return dinnerFriends;
  if (lower.includes("coffee") && lower.includes("sarah")) return friendsCoffee;
  if (lower.includes("morning coffee") || lower.includes("coffee on the balcony")) return coffeeMorning;
  if (lower.includes("5k") || lower.includes("ran") || lower.includes("gym") || lower.includes("deadlift")) return running;
  if (lower.includes("sunset") || lower.includes("drive home") || lower.includes("sky was on fire")) return sunset;
  if (lower.includes("walk") && lower.includes("morning")) return walkingTrail;
  if (lower.includes("dog")) return dogPark;
  
  // For photo entries without specific matches
  if (entryType === "photo") return sunset;
  
  return null;
}
