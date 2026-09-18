import { chromium } from "playwright";

const TEAM_URL =
  "https://www.fcf.cat/ca/clubs/1018/categories/33719";

export interface UpcomingMatch {
  jornada: number;
  date: string;
  time: string;
  stadium: string;
  homeTeam: string;
  awayTeam: string;
  homeLogo: string;
  awayLogo: string;
  matchUrl: string;
}

export async function getUpcomingMatches(): Promise<UpcomingMatch[]> {
  const browser = await chromium.launch({
    headless: true,
  });

  try {
    const page = await browser.newPage();

    console.log("Abriendo página de la FCF...");

    await page.goto(TEAM_URL, {
      waitUntil: "networkidle",
      timeout: 30_000,
    });

    // Esperamos a que cargue el contenido dinámico
    await page.waitForTimeout(3000);

    console.log("Página cargada.");

    /*
     * Buscamos directamente los enlaces de las actas.
     *
     * Cada partido tiene:
     *
     * <a href="/ca/competicio/acta/4157497">
     *
     * y ese enlace está dentro de la tarjeta del partido.
     */
    const matchLinks = page.locator(
      'a[href*="/competicio/acta/"]'
    );

    const count = await matchLinks.count();

    console.log(`Enlaces de partidos encontrados: ${count}`);

    const matches: UpcomingMatch[] = [];

    for (let i = 0; i < count; i++) {
      const matchLink = matchLinks.nth(i);

      /*
       * El enlace del acta es hijo directo de la tarjeta.
       * Subimos un nivel para obtener la tarjeta completa.
       */
      const card = matchLink.locator("xpath=..");

      /*
       * Las 5 etiquetas span son:
       *
       * 0 → equipo local
       * 1 → fecha
       * 2 → hora
       * 3 → estadio
       * 4 → equipo visitante
       */
      const spans = await card.locator("span").allInnerTexts();

      console.log(`\nPartido ${i + 1}:`);
      console.log(spans);

      if (spans.length < 5) {
        console.warn(
          `No se pudieron extraer todos los datos del partido ${i + 1}`
        );

        continue;
      }

      const homeTeam = spans[0].trim();
      const date = spans[1].trim();
      const time = spans[2].trim();
      const stadium = spans[3].trim();
      const awayTeam = spans[4].trim();

      /*
       * Convertimos la fecha de la FCF:
       *
       * 20.09.2026
       *
       * a un objeto Date para comprobar si ya ha pasado.
       */
      const [day, month, year] = date
        .split(".")
        .map(Number);

      const matchDate = new Date(
        year,
        month - 1,
        day
      );

      /*
       * Fecha actual.
       *
       * Ponemos las horas a 00:00 para comparar solamente
       * el día y no la hora.
       */
      const today = new Date();

      today.setHours(0, 0, 0, 0);

      /*
       * Si el partido es anterior a hoy, lo descartamos.
       */
      if (matchDate < today) {
        console.log(
          `❌ Partido pasado: ${date} - ${homeTeam} vs ${awayTeam}`
        );

        continue;
      }

      console.log(
        `✅ Próximo partido: ${date} - ${homeTeam} vs ${awayTeam}`
      );

      /*
       * Jornada
       */
      const jornadaLink = card.locator(
        'a[href*="grupId="]'
      );

      let jornada = 0;

      if ((await jornadaLink.count()) > 0) {
        const jornadaText =
          await jornadaLink.first().innerText();

        const jornadaMatch =
          jornadaText.match(/Jornada\s+(\d+)/i);

        if (jornadaMatch) {
          jornada = Number(jornadaMatch[1]);
        }
      }

      /*
       * Escudos
       */
      const images = card.locator("img");

      const imageCount = await images.count();

      let homeLogo = "";
      let awayLogo = "";

      if (imageCount >= 1) {
        homeLogo =
          (await images.nth(0).getAttribute("src")) ?? "";
      }

      if (imageCount >= 2) {
        awayLogo =
          (await images.nth(1).getAttribute("src")) ?? "";
      }

      /*
       * URL del acta
       */
      const relativeMatchUrl =
        await matchLink.getAttribute("href");

      const matchUrl = relativeMatchUrl
        ? new URL(
            relativeMatchUrl,
            TEAM_URL
          ).href
        : "";

      /*
       * Guardamos el partido.
       */
      matches.push({
        jornada,
        date,
        time,
        stadium,
        homeTeam,
        awayTeam,
        homeLogo,
        awayLogo,
        matchUrl,
      });

      /*
       * Solo queremos los 2 próximos partidos.
       */
      if (matches.length >= 2) {
        break;
      }
    }

    console.log(
      `\nPartidos próximos encontrados: ${matches.length}`
    );

    return matches;
  } finally {
    await browser.close();
  }
}