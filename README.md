# Esmark – Sommerhuscard (listevisning)

Genanvendelig kort-komponent til en kategoriside med sommerhuse, fx
`esmark.de/blaavand`. Bygget med **Next.js (App Router) + TypeScript + Tailwind CSS**.

## Kør projektet

```bash
node -v 24.16.0
```

```bash
npm install
npm run dev      # http://localhost:3000
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


## Kendte begrænsninger

- **Statisk datasæt** – data læses fra `data/sommerhuse.json` ved build-tid.
  Der er ingen runtime-API, så nye/ændrede huse kræver et nyt build.

