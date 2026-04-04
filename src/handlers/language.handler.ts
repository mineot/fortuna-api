import { ApiMessage } from 'src/api-message';
import { app } from 'electron';

export async function registerLanguageHandler(): ApiMessage<string[]> {
  try {
    const preferred = app.getPreferredSystemLanguages();
    const lang = preferred.length > 0 ? preferred : [app.getLocale()];
    return { type: 'success', data: lang };
  } catch (err) {
    throw Promise.reject({
      type: 'error',
      message: 'error_get_language',
      throwable: err,
    });
  }
}
