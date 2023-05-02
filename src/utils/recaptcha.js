import { RECAPTCHA_SITEKEY } from '../config';

export const getRecaptchaToken = () =>
  new Promise((resolve) => {
    window.grecaptcha.ready(() => {
      window.grecaptcha.execute(RECAPTCHA_SITEKEY, { action: 'submit' }).then((token) => {
        resolve(token);
      });
    });
  });
