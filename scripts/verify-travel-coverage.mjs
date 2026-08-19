import { getCountryDataList } from "countries-list";
import travelData from "../src/data/travel-destinations.generated.json" with { type: "json" };
import { getTravelSuggestionIssue } from "./travel-content-rules.mjs";

const expectedCodes = getCountryDataList()
  .filter((country) => country.iso2 !== "CN")
  .map((country) => country.iso2.toLowerCase())
  .sort();
const actualCodes = Object.keys(travelData.destinations).sort();
const errors = [];
const commonTraditionalCharacters = /[語國亞陸鄰邊緬蘭馬積擁億僅風氣與為異這個後裡臺灣區門東學體會開發數長時無處]/u;

if (actualCodes.length !== expectedCodes.length) {
  errors.push(`Expected ${expectedCodes.length} destinations, found ${actualCodes.length}.`);
}

for (const code of expectedCodes) {
  const destination = travelData.destinations[code];

  if (!destination) {
    errors.push(`${code}: missing destination data.`);
    continue;
  }

  if (destination.introduction.trim().length < 24) {
    errors.push(`${code}: introduction is missing or too short.`);
  }
  const traditionalCharacter = destination.introduction.match(commonTraditionalCharacters)?.[0];
  if (traditionalCharacter) {
    errors.push(`${code}: introduction contains the traditional character ${traditionalCharacter}.`);
  }
  if (destination.attractions.length < 1) {
    errors.push(`${code}: no representative attraction or destination.`);
  }
  const attractionNames = new Set();
  for (const attraction of destination.attractions) {
    const normalizedName = attraction.name.trim().toLocaleLowerCase("en");
    const issue = getTravelSuggestionIssue(attraction);
    if (issue) errors.push(`${code}: ${attraction.name} is unsafe (${issue}).`);
    if (attractionNames.has(normalizedName)) {
      errors.push(`${code}: duplicate travel suggestion ${attraction.name}.`);
    }
    attractionNames.add(normalizedName);
  }
  if (destination.images.length < 2) {
    errors.push(`${code}: expected at least two travel images, found ${destination.images.length}.`);
  }
  if (!destination.source.url.startsWith("https://")) {
    errors.push(`${code}: travel introduction source is missing.`);
  }

  const imageUrls = new Set();
  for (const image of destination.images) {
    if (imageUrls.has(image.url)) errors.push(`${code}: duplicate image ${image.url}.`);
    imageUrls.add(image.url);

    if (image.width < 1000 && image.height < 1000) {
      errors.push(`${code}: image is below the 1000px quality floor (${image.width}×${image.height}).`);
    }
    if (!image.sourceUrl.startsWith("https://commons.wikimedia.org/")) {
      errors.push(`${code}: image source is not a Commons file page.`);
    }
    if (!image.artist || !image.license) {
      errors.push(`${code}: image attribution is incomplete.`);
    }
  }
}

if (travelData.destinations.tw?.introduction.startsWith("中国台湾") !== true) {
  errors.push("tw: introduction must use the name 中国台湾.");
}

if (errors.length) {
  console.error(`Travel coverage verification failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  const imageCount = actualCodes.reduce(
    (total, code) => total + travelData.destinations[code].images.length,
    0,
  );
  const attractionCount = actualCodes.reduce(
    (total, code) => total + travelData.destinations[code].attractions.length,
    0,
  );
  console.log(
    `Travel coverage verified: ${actualCodes.length} destinations, ` +
      `${imageCount} attributed HD images, ${attractionCount} representative places.`,
  );
}
