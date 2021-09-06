
export enum BodyParts {
  CORE = 1,
  ARMS = 2,
  BACK = 4,
  CHEST = 8,
  LEGS = 16,
  SHOULDERS = 32,
  OTHER = 64,
  OLYMPIC = 128,
  FULL_BODY = 256,
  CARDIO = 512,
}

export enum ExerciseType {
  BARBELL = 0,
  DUMBBELL = 1,
  MACHINE = 2,
  WEIGHTED_BODYWEIGHT = 3,
  ASSISTED_BODYWEIGHT = 4,
  REPS = 5,
  CARDIO = 6,
  DURATION = 7,
}

export function getExerciseType(value: number): ExerciseType {
  const [key] = Object.entries(ExerciseType).find(([, v]) => v === value) ?? [];

  return key as any;
}

export function getBodyParts(value: number): BodyParts {
  const [key] = Object.entries(BodyParts).find(([, v]) => v === value) ?? [];

  return key as any;
}
