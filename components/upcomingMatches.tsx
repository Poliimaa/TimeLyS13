import { getUpcomingMatches } from "@/lib/fcf";

export default async function UpcomingMatches() {
  const matches = await getUpcomingMatches();

  return (
    <main className="w-5xl justify-center items-center flex-col m-auto h-screen">
      {/* Título */}
      <h1 className="mb-6 text-xl text-center font-bold uppercase tracking-wide text-[#2436ff] md:text-3xl">
        Próximos partidos
      </h1>

      {/* Partidos */}
      <div className="flex flex-col gap-6">
        {matches.map((match) => (
          <article
            key={match.matchUrl}
            className="relative min-h-[140px] overflow-hidden rounded-[10px] border-2 border-[#C6C6C8] bg-white pt-[36px] pb-4 shadow-sm"
          >
            {/* Cabecera del partido */}
            <div className="absolute top-0 right-0 left-0 flex h-[30px] items-center bg-[#3a4af0] px-4">
              <span className="truncate text-xs font-bold uppercase tracking-widest text-white/90">
                GRUP 1 · Jornada {match.jornada}
              </span>
            </div>

            {/* Contenido */}
            <div className="flex min-h-[100px] items-center justify-between gap-2 px-3 sm:px-5 md:gap-4 md:px-6">
              
              {/* EQUIPO LOCAL */}
              <div className="flex min-w-0 flex-1 items-center justify-center gap-2 md:justify-start md:gap-4">
                <div className="flex min-w-0 flex-1 justify-end">
                  <span className="text-center text-sm font-bold uppercase leading-tight text-[#333333] sm:text-base md:text-lg lg:text-xl">
                    {match.homeTeam}
                  </span>
                </div>

                <div className="relative h-14 w-14 shrink-0 sm:h-16 sm:w-16 md:h-20 md:w-20">
                  <img
                    src={match.homeLogo}
                    alt={match.homeTeam}
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>

              {/* INFORMACIÓN DEL PARTIDO */}
              <a
                href={match.matchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex shrink-0 flex-col items-center justify-center gap-1 px-1 transition-opacity hover:opacity-75 sm:px-3"
              > <br />
                {/* Fecha */}
                <div className="rounded-lg bg-[#F4F4F4] px-2 py-1 sm:px-4">
                  <span className="whitespace-nowrap text-xs font-bold text-[#333333] sm:text-sm md:text-base">
                    {match.date}
                  </span>
                </div>

                {/* Hora */}
                <span className="m-2 text-lg font-bold leading-none text-[#0eff36] sm:text-xl md:text-2xl">
                  {match.time}
                </span>

                {/* Estadio */}
                <span className="mt-1 max-w-[100px] text-center text-[9px] leading-tight text-[#666666] sm:max-w-[130px] sm:text-[10px] md:max-w-[180px] md:text-xs">
                  {match.stadium}
                </span>
              </a>

              {/* EQUIPO VISITANTE */}
              <div className="flex min-w-0 flex-1 items-center justify-center gap-2 md:justify-end md:gap-4">
                <div className="relative order-1 h-14 w-14 shrink-0 sm:h-16 sm:w-16 md:h-20 md:w-20">
                  <img
                    src={match.awayLogo}
                    alt={match.awayTeam}
                    className="h-full w-full object-contain"
                  />
                </div>

                <div className="order-2 flex min-w-0 flex-1 justify-start">
                  <span className="text-center text-sm font-bold uppercase leading-tight text-[#333333] sm:text-base md:text-lg lg:text-xl">
                    {match.awayTeam}
                  </span>
                </div>
              </div>

            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
