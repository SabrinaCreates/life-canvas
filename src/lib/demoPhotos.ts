import friendsCoffee from "@/assets/demo/friends-coffee.jpg";
import dogPark from "@/assets/demo/dog-park.jpg";
import coffeeMorning from "@/assets/demo/coffee-morning.jpg";
import sunset from "@/assets/demo/sunset.jpg";
import walkingTrail from "@/assets/demo/walking-trail.jpg";
import dinnerFriends from "@/assets/demo/dinner-friends.jpg";
import botanicalGarden from "@/assets/demo/botanical-garden.jpg";
import running from "@/assets/demo/running.jpg";

export const demoPhotos = {
  friendsCoffee,
  dogPark,
  coffeeMorning,
  sunset,
  walkingTrail,
  dinnerFriends,
  botanicalGarden,
  running,
};

// Map entry content keywords to demo photos
export function getPhotoForEntry(content: string, entryType: string): string | null {
  if (entryType === "photo") {
    if (content.includes("botanical") || content.includes("garden") || content.includes("nature")) return botanicalGarden;
    return sunset;
  }
  const lower = content.toLowerCase();
  if (lower.includes("coffee") || lower.includes("morning coffee")) return friendsCoffee;
  if (lower.includes("dinner") || lower.includes("italian place")) return dinnerFriends;
  if (lower.includes("walk") && lower.includes("morning")) return walkingTrail;
  if (lower.includes("5k") || lower.includes("ran") || lower.includes("gym")) return running;
  if (lower.includes("sunset") || lower.includes("drive home")) return sunset;
  if (lower.includes("dog")) return dogPark;
  return null;
}
