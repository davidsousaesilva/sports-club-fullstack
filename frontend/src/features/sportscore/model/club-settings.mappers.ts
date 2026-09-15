import type {
  ClubComplex,
  ComplexFormValues,
  ComplexResponseDto,
  CreateComplexRequestDto,
  CreateStatisticTypeRequestDto,
  StatisticType,
  StatisticTypeFormValues,
  StatisticTypeResponseDto,
  UpdateComplexRequestDto,
  UpdateStatisticTypeRequestDto,
} from "./club-settings.types";

export function mapStatisticTypeResponse(
  dto: StatisticTypeResponseDto,
): StatisticType {
  return {
    id: dto.id,
    version: dto.version,
    name: dto.name,
    unit: dto.unit,
    mandatory: dto.mandatory,
  };
}

export function mapCreateStatisticTypeRequest(
  values: StatisticTypeFormValues,
): CreateStatisticTypeRequestDto {
  return {
    name: values.name.trim(),
    unit: values.unit.trim(),
    mandatory: values.mandatory,
  };
}

export function mapUpdateStatisticTypeRequest(
  values: StatisticTypeFormValues,
  version: number,
): UpdateStatisticTypeRequestDto {
  return {
    version,
    name: values.name.trim(),
    unit: values.unit.trim(),
    mandatory: values.mandatory,
  };
}

export function mapComplexResponse(dto: ComplexResponseDto): ClubComplex {
  return {
    id: dto.id,
    version: dto.version,
    name: dto.name,
    address: dto.address,
    phone: dto.phone,
  };
}

export function mapCreateComplexRequest(
  values: ComplexFormValues,
): CreateComplexRequestDto {
  return {
    name: values.name.trim(),
    address: values.address.trim(),
    phone: values.phone.trim(),
  };
}

export function mapUpdateComplexRequest(
  values: ComplexFormValues,
  version: number,
): UpdateComplexRequestDto {
  return {
    version,
    name: values.name.trim(),
    address: values.address.trim(),
    phone: values.phone.trim(),
  };
}