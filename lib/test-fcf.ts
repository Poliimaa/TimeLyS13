import { getUpcomingMatches } from "./fcf";

async function main() {
  console.log("Obteniendo próximos partidos de la FCF...\n");

  const matches = await getUpcomingMatches();

  console.log("\n==============================");
  console.log("PRÓXIMOS PARTIDOS");
  console.log("==============================\n");

  console.dir(matches, {
    depth: null,
  });
}

main().catch(console.error);