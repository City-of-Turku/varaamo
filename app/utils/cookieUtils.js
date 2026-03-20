import constants from 'constants/AppConstants';

/**
 * Add event listener that overrides the image served by cookiebot.
 */
export function cookieBotAddListener() {
  if (constants.TRACKING) {
    window.addEventListener('CookiebotOnDialogDisplay', cookieBotImageOverride);
  }
}

/**
 * Remove event listener that overrides the image served by cookiebot.
 */
export function cookieBotRemoveListener() {
  if (constants.TRACKING) {
    window.removeEventListener('CookiebotOnDialogDisplay', cookieBotImageOverride);
  }
}

/**
 * Sets the cookiebot banner's header <img> src to empty string,
 * so the image specified by the style rules is shown instead.
 */
export function cookieBotImageOverride() {
  document.getElementById('CybotCookiebotDialogPoweredbyImage').src = '';
}
