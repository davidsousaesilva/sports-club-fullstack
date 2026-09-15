export interface StatisticTypeResponseDto {
  id: number;
  version: number;
  name: string;
  unit: string;
  mandatory: boolean;
}

export interface CreateStatisticTypeRequestDto {
  name: string;
  unit: string;
  mandatory: boolean;
}

export interface UpdateStatisticTypeRequestDto {
  version: number;
  name: string;
  unit: string;
  mandatory: boolean;
}

export interface ComplexResponseDto {
  id: number;
  version: number;
  name: string;
  address: string;
  phone: string;
}

export interface CreateComplexRequestDto {
  name: string;
  address: string;
  phone: string;
}

export interface UpdateComplexRequestDto {
  version: number;
  name: string;
  address: string;
  phone: string;
}

export interface StatisticType {
  id: number;
  version: number;
  name: string;
  unit: string;
  mandatory: boolean;
}

export interface StatisticTypeFormValues {
  name: string;
  unit: string;
  mandatory: boolean;
}

export interface ClubComplex {
  id: number;
  version: number;
  name: string;
  address: string;
  phone: string;
}

export interface ComplexFormValues {
  name: string;
  address: string;
  phone: string;
}