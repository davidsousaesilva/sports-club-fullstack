import type {
  Person,
  PersonFilterValues,
  PersonRoleItem,
} from "./person.types";

function createRole(
  id: number,
  personId: number,
  role: PersonRoleItem["role"],
  startDate: string,
  primaryRole: boolean,
  endDate: string | null = null,
  endJustification: string | null = null,
): PersonRoleItem {
  return {
    id,
    version: 0,
    role,
    startDate,
    endDate,
    primaryRole,
    endJustification,
    personId,
  };
}

const personMocks: Person[] = [
  {
    id: 1,
    version: 0,
    name: "Joao Ribeiro",
    gender: "MALE",
    email: "joao.ribeiro@club.local",
    phone: "+351912345101",
    address: "Rua de Santo Antonio, Guimaraes",
    birthDate: "2003-04-14",
    entryDate: "2022-09-01",
    active: true,
    activeRoles: [createRole(1, 1, "ATHLETE", "2022-09-01", true)],
  },
  {
    id: 2,
    version: 0,
    name: "Marta Ferreira",
    gender: "FEMALE",
    email: "marta.ferreira@club.local",
    phone: "+351912345102",
    address: "Avenida Dom Joao IV, Braga",
    birthDate: "1998-11-02",
    entryDate: "2021-01-10",
    active: true,
    activeRoles: [createRole(2, 2, "COACH", "2021-01-10", true)],
  },
  {
    id: 3,
    version: 0,
    name: "Ricardo Sousa",
    gender: "MALE",
    email: "ricardo.sousa@club.local",
    phone: "+351912345103",
    address: "Largo do Toural, Guimaraes",
    birthDate: "1987-06-21",
    entryDate: "2020-03-15",
    active: true,
    activeRoles: [createRole(3, 3, "EMPLOYEE", "2020-03-15", true)],
  },
  {
    id: 4,
    version: 0,
    name: "Ana Costa",
    gender: "FEMALE",
    email: "ana.costa@club.local",
    phone: "+351912345104",
    address: "Rua de Sao Marcos, Braga",
    birthDate: "1984-01-19",
    entryDate: "2019-05-06",
    active: true,
    activeRoles: [createRole(4, 4, "MANAGER", "2019-05-06", true)],
  },
  {
    id: 5,
    version: 0,
    name: "Tiago Almeida",
    gender: "MALE",
    email: "tiago.almeida@club.local",
    phone: "+351912345105",
    address: "Rua Rainha Dona Maria II, Porto",
    birthDate: "2001-08-30",
    entryDate: "2023-01-12",
    active: true,
    activeRoles: [
      createRole(6, 5, "COACH", "2024-09-01", false),
      createRole(5, 5, "ATHLETE", "2023-01-12", true),
    ],
  },
  {
    id: 6,
    version: 0,
    name: "Beatriz Moreira",
    gender: "FEMALE",
    email: "beatriz.moreira@club.local",
    phone: "+351912345106",
    address: "Rua Nova de Santa Cruz, Braga",
    birthDate: "1995-03-08",
    entryDate: "2022-02-01",
    active: true,
    activeRoles: [
      createRole(8, 6, "MANAGER", "2024-01-01", false),
      createRole(7, 6, "EMPLOYEE", "2022-02-01", true),
    ],
  },
  {
    id: 7,
    version: 0,
    name: "Pedro Carvalho",
    gender: "MALE",
    email: "pedro.carvalho@club.local",
    phone: "+351912345107",
    address: "Rua da Liberdade, Vila Nova de Famalicao",
    birthDate: "1992-12-17",
    entryDate: "2018-09-03",
    active: false,
    activeRoles: [],
  },
  {
    id: 8,
    version: 0,
    name: "Ines Martins",
    gender: "FEMALE",
    email: "ines.martins@club.local",
    phone: "+351912345108",
    address: "Rua de Camoes, Guimaraes",
    birthDate: "2005-07-11",
    entryDate: "2024-02-05",
    active: true,
    activeRoles: [createRole(9, 8, "ATHLETE", "2024-02-05", true)],
  },
  {
    id: 9,
    version: 0,
    name: "Luis Goncalves",
    gender: "MALE",
    email: "luis.goncalves@club.local",
    phone: "+351912345109",
    address: "Rua do Raio, Braga",
    birthDate: "1979-10-09",
    entryDate: "2017-04-18",
    active: true,
    activeRoles: [
      createRole(10, 9, "MANAGER", "2017-04-18", true),
      createRole(17, 9, "EMPLOYEE", "2020-09-01", false),
      createRole(11, 9, "COACH", "2020-09-01", false),
      createRole(16, 9, "ATHLETE", "2020-09-01", false),
    ],
  },
  {
    id: 10,
    version: 0,
    name: "Carla Teixeira",
    gender: "FEMALE",
    email: "carla.teixeira@club.local",
    phone: "+351912345110",
    address: "Rua da Boavista, Porto",
    birthDate: "1990-05-25",
    entryDate: "2021-11-08",
    active: true,
    activeRoles: [createRole(12, 10, "COACH", "2021-11-08", true)],
  },
  {
    id: 11,
    version: 0,
    name: "Andre Pereira",
    gender: "MALE",
    email: "andre.pereira@club.local",
    phone: "+351912345111",
    address: "Rua Padre Benjamim Salgado, Joane",
    birthDate: "1999-09-13",
    entryDate: "2020-08-24",
    active: false,
    activeRoles: [],
  },
  {
    id: 12,
    version: 0,
    name: "Sofia Neves",
    gender: "FEMALE",
    email: "sofia.neves@club.local",
    phone: "+351912345112",
    address: "Rua de Sao Damaso, Guimaraes",
    birthDate: "2000-02-28",
    entryDate: "2022-06-13",
    active: true,
    activeRoles: [
      createRole(14, 12, "EMPLOYEE", "2025-01-15", false),
      createRole(13, 12, "ATHLETE", "2022-06-13", true),
    ],
  },
];

function filterPersonMocks(filters: PersonFilterValues): Person[] {
  const normalizedSearch = filters.personNameOrEmail.trim().toLowerCase();

  return personMocks.filter((person) => {
    const matchesSearch =
      normalizedSearch.length === 0 ||
      person.name.toLowerCase().includes(normalizedSearch) ||
      person.email.toLowerCase().includes(normalizedSearch);

    const matchesRole =
      filters.role === "ALL" ||
      person.activeRoles.some((role) => role.role === filters.role);

    const matchesActive =
      filters.active === "ALL" ||
      (filters.active === "ACTIVE" && person.active) ||
      (filters.active === "INACTIVE" && !person.active);

    return matchesSearch && matchesRole && matchesActive;
  });
}

export { personMocks, filterPersonMocks };