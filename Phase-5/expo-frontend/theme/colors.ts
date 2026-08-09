/**
 * Design tokens for Smart Local Service Orchestrator.
 *
 * Palette grounded in the subject: local tradespeople in Karachi.
 * Warm stone neutrals for surfaces and text. A single confident
 * teal for interactive elements. Amber for ratings (stars are amber).
 * Everything else is quiet.
 */

export const ColorPalette = {
  // Interactive
  primary: '#0D9488',
  primaryHover: '#0E7490',
  primaryMuted: '#F0FDFA',

  // Ratings & highlights
  amber: '#B45309',
  amberLight: '#FEF3C7',

  // Verification / success
  green: '#15803D',
  greenLight: '#DCFCE7',

  // Light theme — warm stone neutrals
  light: {
    bg: '#FAFAF9',
    surface: '#FFFFFF',
    surfaceRaised: '#F5F5F4',
    border: '#E7E5E4',
    borderStrong: '#D6D3D1',
    textPrimary: '#1C1917',
    textSecondary: '#57534E',
    textMuted: '#A8A29E',
    chatUser: '#0D9488',
    chatUserText: '#FFFFFF',
    chatAI: '#FFFFFF',
    chatAIText: '#1C1917',
  },

  // Dark theme — same stone family, inverted
  dark: {
    bg: '#0C0A09',
    surface: '#1C1917',
    surfaceRaised: '#292524',
    border: '#44403C',
    borderStrong: '#57534E',
    textPrimary: '#FAFAF9',
    textSecondary: '#E2E8F0',
    textMuted: '#CBD5E1',
    chatUser: '#0D9488',
    chatUserText: '#FFFFFF',
    chatAI: '#1C1917',
    chatAIText: '#FAFAF9',
  },
};
