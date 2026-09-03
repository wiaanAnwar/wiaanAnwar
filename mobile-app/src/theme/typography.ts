export type Weight = 300 | 400 | 500 | 600 | 700;

// Poppins for Latin copy, Cairo for Arabic — swapped automatically with language,
// matching the source design's font system.
export function fontFamily(weight: Weight, isArabic: boolean): string {
  if (isArabic) {
    switch (weight) {
      case 300: return 'Cairo_300Light';
      case 400: return 'Cairo_400Regular';
      case 500: return 'Cairo_600SemiBold'; // Cairo has no 500; nearest available
      case 600: return 'Cairo_600SemiBold';
      case 700: return 'Cairo_700Bold';
    }
  }
  switch (weight) {
    case 300: return 'Poppins_300Light';
    case 400: return 'Poppins_400Regular';
    case 500: return 'Poppins_500Medium';
    case 600: return 'Poppins_600SemiBold';
    case 700: return 'Poppins_700Bold';
  }
}

// Headings use tight negative letter-spacing; small labels/eyebrows use wide
// positive letter-spacing and uppercase — the two recurring type moves from the
// source design. Arabic drops letter-spacing entirely (reads badly on the glyphs).
export function tracking(px: number, isArabic: boolean): number {
  return isArabic ? 0 : px;
}
