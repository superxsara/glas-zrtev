import { getDB } from "./db.js";
import { anonymizeText, CATEGORIES } from "../src/lib/anonymize.js";

const SEED_TEXTS: { text: string; category: string; platform: string; gender: string; age: string; children: number; motive: string }[] = [
  { text: "████ ti si pa res ena neumna oseba, nehaj se delat pametnega", category: "zaljivka", platform: "Facebook", gender: "m", age: "25-34", children: 0, motive: "osebni_spor" },
  { text: "Pošlji nazaj od koder si prišel! Tu nimaš kaj iskati", category: "sovrazni_govor", platform: "X", gender: "f", age: "35-44", children: 1, motive: "narodnost" },
  { text: "Najd te pa te bo šlo tudi nekaj stanež", category: "groznja", platform: "Facebook", gender: "f", age: "45-54", children: 1, motive: "osebni_spor" },
  { text: "Spet ti bom napisal, da si bedak in da ti niče ne gre v glavo", category: "zaljivka", platform: "Instagram", gender: "m", age: "18-24", children: 0, motive: "osebni_spor" },
  { text: "Vse vas moramo spraviti ven iz države, nimate tu kaj iskati", category: "sovrazni_govor", platform: "X", gender: "f", age: "25-34", children: 0, motive: "narodnost" },
  { text: "Boš ti dobil, tako da se boš zavedal, koga si si izbral za sovražnika", category: "groznja", platform: "Facebook", gender: "m", age: "35-44", children: 2, motive: "osebni_spor" },
  { text: "Kva si ti sploh, ena Rounda od nekod, pojdi domov", category: "sovrazni_govor", platform: "Instagram", gender: "f", age: "18-24", children: 0, motive: "narodnost" },
  { text: "Naj ti bo jasno, če se sēbo se kdaj prebližnil, boš videl kaj boš videl", category: "groznja", platform: "X", gender: "f", age: "25-34", children: 1, motive: "osebni_spor" },
  { text: "Beden si, nimaš pojma o čem govoriš, nehaj se delat da ti je jasno", category: "zaljivka", platform: "Facebook", gender: "m", age: "55+", children: 0, motive: "osebni_spor" },
  { text: "Vse te ◼◼◼◼ treba pobrejsati, niso normalni", category: "sovrazni_govor", platform: "X", gender: "m", age: "25-34", children: 0, motive: "narodnost" },
  { text: "Ti bom j----- pred tvojo hišo, če se sē se kdaj prebližal", category: "groznja", platform: "Facebook", gender: "f", age: "35-44", children: 2, motive: "osebni_spor" },
  { text: "Spet ena ◼◼◼◼ ki misli da je pametna, pojdi pač zit travo brat", category: "zaljivka", platform: "Instagram", gender: "f", age: "18-24", children: 0, motive: "spol" },
  { text: "Takšni kot ti so uničevali Slovenijo, da vas ni več med nami", category: "sovrazni_govor", platform: "X", gender: "m", age: "45-54", children: 1, motive: "politicno_stalisce" },
  { text: "Najd te in te bo pa vse jasno, si ne upaj več pisat takšne neumnosti", category: "groznja", platform: "Facebook", gender: "m", age: "25-34", children: 0, motive: "osebni_spor" },
  { text: "Samo ◼◼◼◼ kot ti lahko tako mislijo, niste normalni", category: "sovrazni_govor", platform: "X", gender: "f", age: "35-44", children: 1, motive: "narodnost" },
  { text: "Ti si ena velika težava za vse nas, pojdi stran", category: "zaljivka", platform: "Facebook", gender: "m", age: "18-24", children: 0, motive: "osebni_spor" },
  { text: "Bodi previden, imamo tvoje podatke, vemo kje živiš", category: "groznja", platform: "Instagram", gender: "m", age: "35-44", children: 2, motive: "osebni_spor" },
  { text: "Vse vas je treba spraviti stran, tu nimate kaj iskati", category: "sovrazni_govor", platform: "X", gender: "m", age: "45-54", children: 0, motive: "narodnost" },
  { text: "Res si neumen, ne morem verjeti da tako kaj napišes", category: "zaljivka", platform: "Facebook", gender: "f", age: "25-34", children: 0, motive: "osebni_spor" },
  { text: "Če te sēbo se kdaj videl, boš dobil po glavi, da ti bo vse jasno", category: "groznja", platform: "X", gender: "m", age: "18-24", children: 0, motive: "osebni_spor" },
  { text: "Kva si si mislil, da ti bo slovo, takšen ◼◼◼◼ kot ti", category: "sovrazni_govor", platform: "Facebook", gender: "m", age: "35-44", children: 1, motive: "narodnost" },
  { text: "Nisi vreden da bi z tabo sploh govoril, en bedak si", category: "zaljivka", platform: "Instagram", gender: "m", age: "18-24", children: 0, motive: "osebni_spor" },
  { text: "Vse vas moramo spraviti ven, Slovencem ta država pripada", category: "sovrazni_govor", platform: "X", gender: "f", age: "35-44", children: 2, motive: "narodnost" },
  { text: "Najd te pa bos̄ videl kaj bos̄ videl, ne zezaj se več", category: "groznja", platform: "Facebook", gender: "m", age: "25-34", children: 0, motive: "osebni_spor" },
  { text: "Ena ◼◼◼◼ ki misli da je nekaj, pojdi nazaj od koder si prisla", category: "sovrazni_govor", platform: "X", gender: "f", age: "18-24", children: 0, motive: "narodnost" },
  { text: "Res si neumen, nimaš pojma o čem govoriš, nehaj se delat", category: "zaljivka", platform: "Facebook", gender: "f", age: "25-34", children: 1, motive: "osebni_spor" },
  { text: "Ti bom našel tvoj naslov in te bos̄ videl, misliš da si pametnejši", category: "groznja", platform: "Instagram", gender: "m", age: "35-44", children: 1, motive: "osebni_spor" },
  { text: "Vsi ◼◼◼◼ so enaki, goljufi in tatvice, vsi do zadnjega", category: "sovrazni_govor", platform: "X", gender: "m", age: "45-54", children: 0, motive: "narodnost" },
  { text: "Bedak si in vse kar napišeš je bedno, pojdi se solit", category: "zaljivka", platform: "Facebook", gender: "m", age: "55+", children: 0, motive: "osebni_spor" },
  { text: "Če sebo se še kdaj oglasil pri nas, bos̄ dobil tako, da bos̄ pozabil", category: "groznja", platform: "Facebook", gender: "f", age: "35-44", children: 2, motive: "osebni_spor" },
  { text: "Spet en ◼◼◼◼ ki misli da lahko pride sem in nam pove kaj moramo delati", category: "sovrazni_govor", platform: "X", gender: "m", age: "25-34", children: 0, motive: "narodnost" },
  { text: "Nisi normalen, pojdaj si zdravit, nekaj ti ni v redu", category: "zaljivka", platform: "Instagram", gender: "f", age: "18-24", children: 0, motive: "osebni_spor" },
  { text: "Poznam ljudi ki te bodo našli, nimaš pojma v kakšno težavo si se dal", category: "groznja", platform: "X", gender: "m", age: "35-44", children: 1, motive: "osebni_spor" },
  { text: "Vsi taki ste, ◼◼◼◼ eni, samo izkoriščate nas in našo državo", category: "sovrazni_govor", platform: "Facebook", gender: "f", age: "45-54", children: 1, motive: "narodnost" },
  { text: "Ena neumna ◼◼◼◼ kot ti ne more vedeti kaj pravno je in kaj ne", category: "zaljivka", platform: "X", gender: "m", age: "25-34", children: 0, motive: "spol" },
  { text: "Naj ti bo jasno, naslednjič te bom našel fizično, ne samo na spletu", category: "groznja", platform: "Facebook", gender: "m", age: "18-24", children: 0, motive: "osebni_spor" },
  { text: "Niste vredni da bi z vami sploh govorili, ena ◼◼◼◼ skupina", category: "sovrazni_govor", platform: "Instagram", gender: "f", age: "35-44", children: 0, motive: "narodnost" },
  { text: "Kva misliš da si, da ti je vse dovoljeno, bedak en", category: "zaljivka", platform: "Facebook", gender: "m", age: "25-34", children: 0, motive: "osebni_spor" },
  { text: "Tvoja ◼◼◼◼ rasa ne spada sem, pojdi domov", category: "sovrazni_govor", platform: "X", gender: "f", age: "25-34", children: 0, motive: "narodnost" },
  { text: "Bos̄ ti dobil kloč po glavi, če bos̄ se še kdaj oglasil", category: "groznja", platform: "Instagram", gender: "m", age: "35-44", children: 2, motive: "osebni_spor" },
];

export function seedDatabase() {
  const db = getDB();
  const count = db.prepare("SELECT COUNT(*) as c FROM reports").get() as { c: number };
  if (count.c > 0) { console.log(`Baza že vsebuje ${count.c} prijav.`); return; }

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const insert = db.prepare(
    `INSERT INTO reports (id, anonymized_text, category, platform, gender, age_group, has_children, attack_motive, year, month, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );

  let id = 1;
  for (let offset = 7; offset >= 0; offset--) {
    const d = new Date(year, month - 1 - offset, 1);
    const y = d.getFullYear(); const m = d.getMonth() + 1;
    const count = 12 + Math.floor(Math.random() * 8);
    for (let i = 0; i < count; i++) {
      const seed = SEED_TEXTS[(id - 1) % SEED_TEXTS.length];
      const day = Math.floor(Math.random() * 28) + 1;
      const hour = Math.floor(Math.random() * 24);
      const min = Math.floor(Math.random() * 60);
      insert.run(
        `seed-${String(id).padStart(4, "0")}`,
        anonymizeText(seed.text), seed.category, seed.platform,
        seed.gender, seed.age, seed.children, seed.motive,
        y, m, `${y}-${String(m).padStart(2,"0")}-${String(day).padStart(2,"0")} ${String(hour).padStart(2,"0")}:${String(min).padStart(2,"0")}:00`,
      );
      id++;
    }
  }
  console.log(`Seeded ${id - 1} prijav.`);
}

if (process.argv[1]?.includes("seed")) { seedDatabase(); process.exit(0); }
