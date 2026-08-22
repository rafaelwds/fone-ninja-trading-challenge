export const motion = {
  fast: 150,
  base: 250,
  slow: 400,
} as const;

export type Motion = typeof motion;
export type MotionToken = keyof Motion;
