import type { ClubComplex, StatisticType } from "./club-settings.types";

const mockStatisticTypes: StatisticType[] = [
  {
    id: 1,
    name: "Goals scored",
    unit: "goals",
    mandatory: true,
  },
  {
    id: 2,
    name: "Assists",
    unit: "assists",
    mandatory: false,
  },
  {
    id: 3,
    name: "Average speed",
    unit: "km/h",
    mandatory: false,
  },
];

const mockComplexes: ClubComplex[] = [
  {
    id: 1,
    name: "Municipal Sports Complex",
    address: "Rua do Estádio 123, Porto",
    phone: "+351 220 000 000",
  },
  {
    id: 2,
    name: "North Training Center",
    address: "Avenida do Clube 45, Maia",
    phone: "+351 229 111 222",
  },
  {
    id: 3,
    name: "River Indoor Arena",
    address: "Travessa das Modalidades 8, Gondomar",
    phone: "+351 224 333 444",
  },
];

export { mockStatisticTypes, mockComplexes };
