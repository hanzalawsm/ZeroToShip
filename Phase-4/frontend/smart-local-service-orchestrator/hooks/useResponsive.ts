import { useWindowDimensions } from 'react-native';

/**
 * Responsive layout hook. On mobile everything is full-width.
 * On wider screens content fills more space with sensible max-widths.
 */
export const useResponsive = () => {
  const { width } = useWindowDimensions();
  const isWide = width >= 768;
  const isDesktop = width >= 768;
  const availableWidth = isDesktop ? width - 240 : width;

  return {
    isMobile: width < 768,
    isWide,
    isDesktop,
    screenWidth: width,
    // Allow content to use full available width on tablet/smaller desktop screens
    // Cap at reasonable maximums only for very wide screens
    chatWidth: width >= 1200 ? 840 : availableWidth,
    listWidth: width >= 1200 ? 1000 : availableWidth,
    articleWidth: width >= 1200 ? 840 : availableWidth,
    // Switch to 2 columns only when there is enough space for the cards
    gridColumns: availableWidth >= 650 ? 2 : 1,
  };
};
