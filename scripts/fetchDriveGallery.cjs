const https = require("https");
const fs = require("fs");

const FOLDER_ID = "1m26Ty-fgW4g3WwOuyO4ajSVjlZOUNaLh";

const url = `https://drive.google.com/drive/folders/${FOLDER_ID}`;
https.get(url, (res) => {
  let data = "";
  res.on("data", chunk => data += chunk);
  res.on("end", () => {
    const regex = /<tr[^>]*data-id="([a-zA-Z0-9_-]+)"[^>]*>([\s\S]*?)<\/tr>/g;
    let match;
    const items = [];
    const seen = new Set();
    while ((match = regex.exec(data)) !== null) {
      const id = match[1];
      if (seen.has(id)) continue;
      seen.add(id);

      const rowContent = match[2];
      const labelMatch = rowContent.match(/aria-label="([^"]+?)(?:\s+Image|\s+Shared)?"/);
      let rawName = labelMatch ? labelMatch[1].trim() : "Photo";
      rawName = rawName.replace(/\s+(?:Image|Shared)$/i, "").trim();

      items.push({ id, rawName });
    }

    if (items.length === 0) {
      console.error("No images found in folder HTML.");
      process.exit(1);
    }

    // Sort natural number-wise by name (e.g. 1, 2, ... 9, 10, 11 ...)
    items.sort((a, b) => a.rawName.localeCompare(b.rawName, undefined, { numeric: true, sensitivity: "base" }));

    const lines = items.map((item, idx) => {
      const cleanName = item.rawName.replace(/\.[^/.]+$/, "").replace(/_/g, " ");
      return `  {
    id: ${idx + 1},
    driveId: '${item.id}',
    title: 'The Parkways Custom Residence - ${cleanName}',
    url: 'https://lh3.googleusercontent.com/d/${item.id}',
    thumbnailUrl: 'https://lh3.googleusercontent.com/d/${item.id}=w600',
    caption: 'Custom residence photography (${item.rawName}) - The Parkways, Dubai Hills Estate.',
    originalName: '${item.rawName}',
  },`;
    }).join("\n");

    const fileContent = `/**
 * Sourced directly from Google Drive Folder:
 * https://drive.google.com/drive/folders/${FOLDER_ID}
 * Total images: ${items.length}
 * Sorted in natural number-wise order by image name.
 */

export interface ParkwaysGalleryImage {
  id: number;
  driveId: string;
  title: string;
  url: string;
  thumbnailUrl: string;
  caption: string;
  originalName: string;
}

export const PARKWAYS_VILLA_GALLERY: ParkwaysGalleryImage[] = [
${lines}
];
`;

    fs.writeFileSync("./src/data/parkwaysDriveGallery.ts", fileContent, "utf8");
    console.log(`Successfully updated ./src/data/parkwaysDriveGallery.ts with ${items.length} images sorted number-wise.`);
  });
});
