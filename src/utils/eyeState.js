/**
 * Decides how the login "password eyes" should look.
 *  - closed: password field (or its show/hide button) has focus AND the password is hidden
 *  - look:   where the pupils point ('center' | 'up' | 'down')
 * When the password is visible the eyes stay open and glance down at it, so show/hide still makes sense.
 */
export function getEyeState({ passwordFocused = false, showPassword = false, emailFocused = false } = {}) {
  const closed = passwordFocused && !showPassword;
  let look = 'center';
  if (passwordFocused) look = showPassword ? 'down' : 'center';
  else if (emailFocused) look = 'up';
  return { closed, look };
}
