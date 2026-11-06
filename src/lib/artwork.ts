export const artwork = {
  hero: { path: "hero/hero-main", alt: "Marble figure beneath the colonnades of a classical Greek hall" },
  heroClean: { path: "hero/hero-clean-assembly", alt: "A grand classical marble assembly hall with sculptural tiers and gold architectural details" },
  heroAlternative: { path: "hero/hero-alternative", alt: "A marble statesman in a monumental classical assembly" },
  marbleEye: { path: "hero/marble_eye_and_face", alt: "Close study of an antique marble face" },
  assembly: { path: "architecture/assembly_hall", alt: "A semicircular marble assembly hall prepared for debate" },
  arch: { path: "architecture/greek_arch", alt: "Sculpted marble arch with gilded classical ornament" },
  relief: { path: "architecture/Greek_Sculptural_relief", alt: "Classical marble relief depicting a civic gathering" },
  column: { path: "architecture/Ornate_greek_column", alt: "Carved Corinthian marble column capital" },
  staircase: { path: "architecture/staircase", alt: "Grand marble staircase within a purple-lit classical palace" },
  unga: { path: "committees/unga", alt: "A winged marble figure in a vaulted assembly chamber" },
  planning: { path: "committees/planning-commission", alt: "Two marble figures in discussion over a civic table" },
  press: { path: "committees/international-press", alt: "Marble messenger holding a scroll in a classical hall" },
  reykjavik: { path: "committees/reykjavik-summit", alt: "Marble envoys in a formal diplomatic exchange" },
  aippm: { path: "committees/aippm", alt: "A marble political assembly in a circular chamber" },
  unhrc: { path: "committees/unhrc", alt: "Classical figures gathered beneath a laurel sculpture" },
  laurel: { path: "ornaments/goldgreek_laurel_wreath", alt: "Antique gold laurel wreath on veined marble" },
  hand: { path: "ornaments/marbled_hand", alt: "A sculpted marble hand raised in deliberation" },
  wingOrnament: { path: "ornaments/wing_sculpture", alt: "Carved marble wing with antique gold details" },
  portrait: { path: "sculptures/portrait", alt: "Marble portrait in a dark classical interior" },
  wingedFigure: { path: "sculptures/winged_figure", alt: "Winged marble figure beneath an architectural dome" },
} as const;

export type ArtworkKey = keyof typeof artwork;
export const committeeArtwork: Record<string, ArtworkKey> = {
  unga: "unga",
  "planning-commission": "planning",
  "international-press": "press",
  "reykjavik-summit": "reykjavik",
  aippm: "aippm",
  unhrc: "unhrc",
};
