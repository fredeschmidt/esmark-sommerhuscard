# Esmark – Sommerhuscard (listevisning)

Genanvendelig kort-komponent til en kategoriside med sommerhuse, fx
`esmark.de/blaavand`. Bygget med **Next.js (App Router) + TypeScript + Tailwind CSS**.

## Kør projektet

```bash
npm install
npm run dev      # http://localhost:3000  (viser ALLE kvalificerede huse)
npm run build    # produktionsbuild
```

Forsiden `/` viser alle huse, der opfylder kriterierne (på tværs af byer).
By-sider filtrerer yderligere på lokation, fx `/blaavand`, `/hvide-sande`,
`/ringkoebing`, `/roemoe`.

## Valg af framework

**Next.js + Tailwind** opfylder kravene direkte:

- **SEO** – siderne renderes server-side til færdig HTML og pre-genereres
  statisk pr. by (`generateStaticParams`). `generateMetadata` giver unikke
  title/description, og hver kategoriside indlejrer `schema.org`-struktureret
  data (`ItemList` af `LodgingBusiness`).
- **Performance** – `next/image` leverer responsive billeder med korrekte
  dimensioner (ingen layout shift); hero-billedet prioriteres for bedre LCP.
- **Lokalt datasæt** – `data/sommerhuse.json` importeres direkte; filtrering
  sker server-side. Ingen runtime-API nødvendig.
- **Mobile first** – Tailwind-breakpoints: 1 kolonne på mobil → 2 (sm) → 3 (lg).

## Opfyldelse af kravene

| Krav | Løsning |
| --- | --- |
| Filter: min. 6 personer + hund tilladt | `meetsListingCriteria()` i [`lib/houses.ts`](lib/houses.ts) (`NumberOfPersons >= 6 && PetsAllowed`). 13 af 15 huse vises; 2 frasorteres. |
| Gæster = `NumberOfPersons` | Bruges som "X gæster" på kortet. |
| Responsivt, mobile first | Tailwind grid + breakpoints. |
| Semantisk/tilgængelig HTML | `<main>`/`<h1>` → `<ul>`/`<li>`/`<article>` → `<h3>`; alt-tekster pr. billede; "spring til indhold"-link; brødkrumme. |
| Tastaturnavigation | Karrusellens knapper og prikker er rigtige `<button>` med `aria-label`; piletaster skifter billede; synlige fokus-states. |
| Dansk sprog | `lang="da"`, alle tekster og tal (`Intl` `da-DK`) på dansk. |
| Datasæt fra lokal fil | `data/sommerhuse.json`. |

## Bemærkninger om data

- **Tegnkodning:** Den oprindelige fil er dobbelt-kodet (UTF-8 gemt som
  Latin-1), så fx "Blåvand" optræder som "BlÃ¥vand". Filen bevares som leveret,
  og teksten normaliseres ved indlæsning i `fixMojibake()`
  ([`lib/houses.ts`](lib/houses.ts)).
- **Felter:** Datasættet er reduceret til de felter, listevisningen bruger
  (alle 15 huse er med, så filteret kører reelt).
- **Billeder:** Datasættets billed-URL'er peger på Esmarks CDN. Som aftalt
  bruges placeholder-fotos af danske sommerhuse — lokale billeder i
  `public/placeholders/` (`dansk-sommerhus-N.jpg`). `lib/placeholders.ts`
  scanner mappen ved build-tid (skalerer automatisk, hvis der lægges flere
  ind) og tildeler hvert kort et billedsæt ud fra dets position, så **intet
  kort deler hero-billede (billede #1)** så længe antal kort ≤ antal fotos. I
  produktion udskiftes pool'en med Esmarks rigtige CDN-stier.

## Struktur

```
app/
  layout.tsx              # <html lang="da">, metadata, skip-link
  page.tsx                # forside: ALLE kvalificerede huse
  [location]/page.tsx     # by-side: samme liste filtreret på lokation
  not-found.tsx
components/
  HouseListing.tsx        # delt liste-layout (grid + JSON-LD + header)
  HouseCard.tsx           # genanvendeligt kort (server component)
  ImageCarousel.tsx       # billedkarrusel (client component)
  icons.tsx               # inline SVG-faciliteter-ikoner
lib/
  houses.ts               # typer, indlæsning, encoding-fix, filter, slugs
  format.ts               # pris/afstand-formatering
  placeholders.ts         # scanner /public/placeholders, unik billedtildeling
data/
  sommerhuse.json         # datasættet
```
