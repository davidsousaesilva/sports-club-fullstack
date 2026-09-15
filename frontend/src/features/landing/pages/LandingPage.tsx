import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock3,
  Facebook,
  Instagram,
  LogIn,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Target,
  Trophy,
  Users,
} from "lucide-react";

import { Button, Card } from "../../../shared/components/ui";
import { Link } from "react-router-dom";

type Sport = {
  name: string;
  description: string;
  accentClassName: string;
  stats: string;
};

type EventItem = {
  category: string;
  title: string;
  date: string;
  location: string;
  Icon: typeof Trophy;
};

type ValueItem = {
  title: string;
  description: string;
};

const sports: Sport[] = [
  {
    name: "Futebol",
    description:
      "Percursos de treino para desenvolvimento jovem e equipas competitivas.",
    accentClassName: "bg-emerald-500",
    stats: "Academia e equipas de jogo",
  },
  {
    name: "Voleibol",
    description:
      "Sessões estruturadas com foco na técnica, ritmo e trabalho de equipa.",
    accentClassName: "bg-orange-500",
    stats: "Torneios regionais e grupos de treino",
  },
  {
    name: "Ténis",
    description:
      "Treino para iniciantes, atletas em progressão e jogadores competitivos.",
    accentClassName: "bg-amber-500",
    stats: "Progressão individual por nível",
  },
  {
    name: "Natação",
    description:
      "Aprendizagem, condição física e apoio ao rendimento num ambiente seguro.",
    accentClassName: "bg-sky-500",
    stats: "Da iniciação ao rendimento",
  },
  {
    name: "Fitness",
    description:
      "Rotinas de força e condição física adaptadas ao dia a dia do clube.",
    accentClassName: "bg-violet-500",
    stats: "Planos funcionais e de ginásio",
  },
  {
    name: "Ténis de mesa",
    description:
      "Sessões dinâmicas para atletas que valorizam precisão e competição.",
    accentClassName: "bg-rose-500",
    stats: "Prática recreativa e competitiva",
  },
];

const events: EventItem[] = [
  {
    category: "Competição",
    title: "Campeonato Regional Sub-17",
    date: "15 de abril de 2026",
    location: "Pavilhão Municipal de Braga",
    Icon: Trophy,
  },
  {
    category: "Treino aberto",
    title: "Sessão aberta de futebol",
    date: "05 de abril de 2026",
    location: "Campo principal do Codfish United",
    Icon: Target,
  },
  {
    category: "Evento do clube",
    title: "Dia de portas abertas",
    date: "01 de abril de 2026",
    location: "Instalações do clube",
    Icon: Users,
  },
];

const values: ValueItem[] = [
  {
    title: "Espírito de equipa",
    description: "Crescemos juntos, competimos juntos e celebramos juntos.",
  },
  {
    title: "Excelência",
    description: "Trabalhamos com disciplina e ambição em todos os escalões.",
  },
  {
    title: "Respeito",
    description: "O fair play orienta o comportamento dentro e fora do campo.",
  },
  {
    title: "Inclusão",
    description:
      "O desporto deve ser acessível, acolhedor e significativo para todos.",
  },
];

function LandingPage() {
  return (
    <div className="bg-white text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:gap-6 sm:px-6 lg:px-8">
          <a href="#hero" className="flex shrink-0 items-center gap-3">
            <img
              src="/club-mark.png"
              alt="Emblema do Codfish United"
              className="h-10 w-auto object-contain sm:h-12"
            />
          </a>

          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 lg:flex">
            <a className="transition-colors hover:text-slate-900" href="#about">
              Sobre
            </a>
            <a
              className="transition-colors hover:text-slate-900"
              href="#sports"
            >
              Modalidades
            </a>
            <a
              className="transition-colors hover:text-slate-900"
              href="#events"
            >
              Eventos
            </a>
            <a className="transition-colors hover:text-slate-900" href="#join">
              Junta-te
            </a>
            <a
              className="transition-colors hover:text-slate-900"
              href="#contact"
            >
              Contacto
            </a>
          </nav>

          <Link
            to="/login"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-black/90 px-3 py-2 text-sm font-semibold text-white transition hover:bg-black/80 sm:px-5 sm:py-3"
          >
            <LogIn className="h-5 w-5" />
            <span>Área de membro</span>
          </Link>
        </div>
      </header>

      <main>
        <section id="hero" className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-sky-50 via-white to-slate-50" />
          <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
            <div className="flex flex-col justify-center">
              <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-medium text-sky-700">
                <MapPin className="h-4 w-4" />
                Braga, Portugal
              </div>

              <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Codfish United
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
                O Codfish United aproxima atletas, equipa técnica e famílias do
                clube. Descubra modalidades, eventos e uma experiência de membro
                estruturada para crescer com o clube.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="bg-black/90 hover:bg-black/80"
                >
                  <a href="#join">
                    Junta-te ao clube
                    <ArrowRight />
                  </a>
                </Button>

                <Button asChild size="lg" variant="outline">
                  <a href="#sports">Explorar modalidades</a>
                </Button>
              </div>

              <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Card className="rounded-2xl border-slate-200 bg-white p-5">
                  <p className="text-3xl font-bold text-slate-950">500+</p>
                  <p className="mt-1 text-sm text-slate-600">Atletas ativos</p>
                </Card>
                <Card className="rounded-2xl border-slate-200 bg-white p-5">
                  <p className="text-3xl font-bold text-slate-950">6</p>
                  <p className="mt-1 text-sm text-slate-600">Modalidades</p>
                </Card>
                <Card className="rounded-2xl border-slate-200 bg-white p-5">
                  <p className="text-3xl font-bold text-slate-950">15</p>
                  <p className="mt-1 text-sm text-slate-600">
                    Anos de atividade
                  </p>
                </Card>
              </div>
            </div>

            <div className="flex items-center">
              <div className="relative w-full overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-xl shadow-slate-200/60">
                <img
                  src="/hero-banner.png"
                  alt="Treinos e vida do clube no Codfish United"
                  className="h-full min-h-[320px] w-full rounded-[20px] object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">
                Sobre o clube
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Um clube local com estrutura, ambição e espírito de comunidade.
              </h2>
              <p className="mt-5 text-lg leading-8 text-slate-600">
                O Codfish United afirma-se como um clube multidesportivo onde
                treino, competição e experiência de membro funcionam em
                conjunto. A página pública oferece a famílias e atletas um
                primeiro contacto claro com o clube.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {values.map((value) => (
                <Card
                  key={value.title}
                  className="h-full rounded-2xl border-slate-200 bg-white p-6"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-slate-950">
                    {value.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {value.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="sports" className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex max-w-3xl flex-col gap-4">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">
                Modalidades
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Programas para diferentes idades, objetivos e níveis de
                rendimento.
              </h2>
              <p className="text-lg leading-8 text-slate-600">
                A landing page apresenta a oferta do clube de forma simples e
                ajuda novos visitantes a perceber onde se enquadram antes de
                entrarem em contacto com o clube.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {sports.map((sport) => (
                <Card
                  key={sport.name}
                  className="group rounded-2xl border-slate-200 bg-slate-50 p-6 transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${sport.accentClassName}`}
                  >
                    <ShieldCheck className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-slate-950">
                    {sport.name}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {sport.description}
                  </p>
                  <p className="mt-4 text-sm font-medium text-slate-500">
                    {sport.stats}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="events" className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex max-w-3xl flex-col gap-4">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">
                Eventos
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Próximos momentos que mantêm o clube ativo e visível.
              </h2>
              <p className="text-lg leading-8 text-slate-600">
                Competições, sessões abertas e atividades do clube ajudam a
                comunicar ritmo, cultura e oportunidades de participação.
              </p>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {events.map((event) => (
                <Card
                  key={event.title}
                  className="rounded-2xl border-slate-200 bg-white p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sky-700">
                      {event.category}
                    </span>
                    <event.Icon className="h-6 w-6 text-sky-600" />
                  </div>

                  <h3 className="mt-5 text-xl font-semibold text-slate-950">
                    {event.title}
                  </h3>

                  <div className="mt-5 space-y-3 text-sm text-slate-600">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="join" className="bg-slate-950 py-20 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">
                  Junta-te ao clube
                </p>
                <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                  Uma entrada mais clara para atletas, famílias e futuros
                  membros.
                </h2>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
                  Esta secção funciona como ponto de conversão para visitantes
                  públicos. Reforça o valor do clube e cria um caminho natural
                  para a área de membro quando a autenticação estiver pronta.
                </p>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <Button
                    asChild
                    size="lg"
                    className="bg-white text-slate-950 hover:bg-slate-100"
                  >
                    <Link to="/login">
                      <LogIn />
                      Aceder à área de membro
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-slate-700 bg-transparent text-white hover:bg-slate-900"
                  >
                    <a href="#contact">Falar com o clube</a>
                  </Button>
                </div>
              </div>

              <Card className="rounded-3xl border border-slate-800 bg-slate-900 p-8 text-white shadow-none">
                <div className="grid gap-6">
                  <div className="flex items-start gap-4">
                    <div className="rounded-2xl bg-slate-800 p-3 text-sky-300">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        Integração estruturada
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        Os visitantes percebem rapidamente a oferta do clube
                        antes de entrarem na experiência autenticada.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="rounded-2xl bg-slate-800 p-3 text-sky-300">
                      <Target className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        Pontos de conversão claros
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        Os convites à ação estão distribuídos pela descoberta,
                        pelos eventos e pelo contacto.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="rounded-2xl bg-slate-800 p-3 text-sky-300">
                      <Trophy className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        Posicionamento centrado no clube
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        A página comunica confiança, identidade local e ambição
                        desportiva.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        <section id="contact" className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">
                  Contacto
                </p>
                <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                  Uma forma direta de chegar ao clube.
                </h2>
                <p className="mt-5 text-lg leading-8 text-slate-600">
                  Os contactos mantêm-se visíveis e fáceis de consultar, com
                  espaço para futuramente integrar um mapa interativo ou um
                  formulário real.
                </p>

                <div className="mt-10 space-y-4">
                  <Card className="rounded-2xl border-slate-200 p-6">
                    <div className="flex items-start gap-4">
                      <div className="rounded-2xl bg-sky-50 p-3 text-sky-700">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-950">Morada</h3>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          Rua do Desporto, 123
                          <br />
                          4710-243 Braga
                          <br />
                          Portugal
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card className="rounded-2xl border-slate-200 p-6">
                    <div className="flex items-start gap-4">
                      <div className="rounded-2xl bg-sky-50 p-3 text-sky-700">
                        <Phone className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-950">
                          Telefone
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          +351 253 123 456
                          <br />
                          +351 912 345 678
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card className="rounded-2xl border-slate-200 p-6">
                    <div className="flex items-start gap-4">
                      <div className="rounded-2xl bg-sky-50 p-3 text-sky-700">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-950">Email</h3>
                        <div className="mt-2 space-y-1 text-sm leading-6 text-slate-600">
                          <p>general@codfishunited.pt</p>
                          <p>members@codfishunited.pt</p>
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card className="rounded-2xl border-slate-200 p-6">
                    <div className="flex items-start gap-4">
                      <div className="rounded-2xl bg-sky-50 p-3 text-sky-700">
                        <Clock3 className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-950">
                          Horário de funcionamento
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          Segunda a sexta: 09:00 - 22:00
                          <br />
                          Sábado: 09:00 - 20:00
                          <br />
                          Domingo: 09:00 - 14:00
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Button asChild variant="outline" size="lg">
                    <a
                      href="https://facebook.com"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Facebook />
                      Facebook
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Instagram />
                      Instagram
                    </a>
                  </Button>
                </div>
              </div>

              <Card className="flex min-h-[520px] rounded-3xl border-slate-200 bg-slate-50 p-6">
                <div className="flex flex-1 flex-col items-center justify-center rounded-[20px] border border-dashed border-slate-300 bg-white text-center">
                  <MapPin className="h-12 w-12 text-slate-400" />
                  <h3 className="mt-4 text-xl font-semibold text-slate-950">
                    Espaço reservado para mapa
                  </h3>
                  <p className="mt-3 max-w-sm text-sm leading-6 text-slate-600">
                    Substitua este bloco mais tarde por um mapa incorporado real
                    ou por um componente de interação de contacto dedicado.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-8 lg:flex-row">
            <div className="max-w-md">
              <div className="flex items-center gap-3">
                <div>
                  <p className="font-semibold text-slate-950">Codfish United</p>
                  <p className="text-sm text-slate-500">Braga, Portugal</p>
                </div>
              </div>
            </div>

            <div className="grid gap-8 sm:grid-cols-2">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-950">
                  Navegação
                </p>
                <div className="mt-4 flex flex-col gap-3 text-sm text-slate-600">
                  <a href="#about" className="hover:text-slate-950">
                    Sobre
                  </a>
                  <a href="#sports" className="hover:text-slate-950">
                    Modalidades
                  </a>
                  <a href="#events" className="hover:text-slate-950">
                    Eventos
                  </a>
                  <a href="#contact" className="hover:text-slate-950">
                    Contacto
                  </a>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-950">
                  Acesso
                </p>
                <div className="mt-4 flex flex-col gap-3 text-sm text-slate-600">
                  <a href="#join" className="hover:text-slate-950">
                    Junta-te ao clube
                  </a>
                  <a href="#contact" className="hover:text-slate-950">
                    Contactar o clube
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-4 border-t border-slate-200 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center">
            <p>© 2026 Codfish United. Todos os direitos reservados.</p>
            <a
              href="#join"
              className="inline-flex items-center gap-2 font-medium text-slate-700 hover:text-slate-950"
            >
              <LogIn className="h-4 w-4" />
              Área de membro
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export { LandingPage };
