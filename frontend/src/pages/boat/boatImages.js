import yachtImage from "../../assets/images/yacht.jpeg";
import catamaranImage from "../../assets/images/catamaran.webp";
import bowriderImage from "../../assets/images/bowrider.jpg";
import cuddyImage from "../../assets/images/cuddy.jpg";

export function getBoatFallbackImage(boatType) {
  const type = String(boatType ?? "").toLowerCase();

  if (type.includes("catamaran")) return catamaranImage;
  if (type.includes("speedboat")) return bowriderImage;
  if (type.includes("cruiser") || type.includes("yacht")) return yachtImage;
  return cuddyImage;
}

export function getBoatImage(boat) {
  return boat.imageUrl?.trim() || getBoatFallbackImage(boat.boatType);
}