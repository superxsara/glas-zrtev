/**
 * Text anonymization for #GlasŽrtev reports.
 * Replaces identifying information (names, emails, phones, handles, URLs)
 * with ████ blocks while keeping the offensive text visible.
 * The original text is NEVER stored — only the anonymized version.
 */

const BLOCK = "████";

/** Replace email addresses */
function redactEmails(text: string): string {
  return text.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, BLOCK);
}

/** Replace phone numbers (Slovenian and international formats) */
function redactPhones(text: string): string {
  return text.replace(/(\+386\s?\d{2}\s?\d{3}\s?\d{3})|(0\d{2}\s?\d{3}\s?\d{3})|(\+?\d[\d\s]{8,14}\d)/g, BLOCK);
}

/** Replace @handles (social media usernames) */
function redactHandles(text: string): string {
  return text.replace(/@[A-Za-z0-9_]{3,}/g, BLOCK);
}

/** Replace URLs */
function redactUrls(text: string): string {
  return text.replace(/https?:\/\/[^\s]+/gi, BLOCK);
}

/** Replace common Slovenian first names (partial list — extended as needed) */
const SLOVENE_NAMES = [
  "Matej", "Mateja", "Janez", "Jožef", "Jožefa", "Marija", "Ana", "Ivan",
  "Frančišek", "Ana", "Anton", "Barbara", "Barb", "Petra", "Peter", "Marko",
  "Tomaž", "Tadej", "Nina", "Maja", "Sara", "Sara", "Eva", "Luka", "Nejc",
  "Anže", "Žan", "Tim", "Jan", "Žiga", "Jakob", "David", "Aleksander", "Aleks",
  "Katarina", "Katja", "Mojca", "Tanja", "Sonja", "Irena", "Maja", "Polona",
  "Urška", "Špela", "Tjaša", "Alja", "Pia", "Neža", "Klara", "Eva",
];

function redactNames(text: string): string {
  let result = text;
  for (const name of SLOVENE_NAMES) {
    // Match name as a whole word (case-insensitive), not at the start of a common word
    const regex = new RegExp(`\\b${name}\\b`, "gi");
    result = result.replace(regex, BLOCK);
  }
  return result;
}

/**
 * Anonymize report text: replace all identifying info with ████ blocks.
 * Keeps the offensive content visible for statistical context.
 * Truncates to maxLen characters.
 */
export function anonymizeText(text: string, maxLen = 280): string {
  let result = text.trim();

  // Redact in order: URLs first (before handles), then emails, phones, handles, names
  result = redactUrls(result);
  result = redactEmails(result);
  result = redactPhones(result);
  result = redactHandles(result);
  result = redactNames(result);

  // Collapse multiple consecutive blocks
  result = result.replace(/(████\s*){2,}/g, "████ ");

  // Trim and truncate
  result = result.trim();
  if (result.length > maxLen) {
    result = result.slice(0, maxLen - 1).trimEnd() + "…";
  }

  return result;
}

/** Categories with labels and colors */
export const CATEGORIES = [
  {
    value: "zaljivka",
    label: "Žaljivka",
    color: "#e67e22",
    description: "Nesramno/žaljivo besedilo, ni nujno pravno relevantno.",
  },
  {
    value: "sovrazni_govor",
    label: "Sovražni govor",
    color: "#c0392b",
    description: "Izražanje usmerjeno proti osebni okoliščini (narodnost, vera, spol, spolna usmerjenost ipd.), ki lahko ogrozi javni red ali vsebuje grožnjo/zmerjanje. Opomba: 'sovražni govor' ni uraden pravni izraz v Sloveniji — najbližji zakonski okvir je 297. člen KZ-1 ('javno spodbujanje sovraštva, nasilja ali nestrpnosti').",
  },
  {
    value: "groznja",
    label: "Grožnja",
    color: "#8e44ad",
    description: "Neposredna grožnja z nasiljem ali škodo.",
  },
] as const;

export const PLATFORMS = ["X", "Facebook", "Instagram", "TikTok", "YouTube", "Drugo"] as const;

export const AGE_GROUPS = ["18-24", "25-34", "35-44", "45-54", "55+"] as const;

export const GENDERS = [
  { value: "m", label: "Moški" },
  { value: "f", label: "Ženska" },
  { value: "d", label: "Drugo" },
] as const;

export const ATTACK_MOTIVES = [
  { value: "videz", label: "Videz" },
  { value: "narodnost", label: "Narodnost / poreklo" },
  { value: "spol", label: "Spol" },
  { value: "spolna_usmerjenost", label: "Spolna usmerjenost" },
  { value: "vera", label: "Vera" },
  { value: "politicno_stalisce", label: "Politično stališče" },
  { value: "osebni_spor", label: "Osebni spor" },
  { value: "drugo", label: "Drugo" },
] as const;

/** Slovenian month names for display */
export const MONTH_NAMES_SL = [
  "Jan", "Feb", "Mar", "Apr", "Maj", "Jun",
  "Jul", "Avg", "Sep", "Okt", "Nov", "Dec",
];

export const MONTH_NAMES_FULL_SL = [
  "Januar", "Februar", "Marec", "April", "Maj", "Junij",
  "Julij", "Avgust", "September", "Oktober", "November", "December",
];
