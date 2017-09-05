/**这个plugin需要配合，I18nProvider使用**/
import { t, switchLanguage as switchLanguageOrigin } from '../i18n-provider';

let routeControllerObj;
export function switchLanguage(language, reload = true) {
  switchLanguageOrigin(language).then(languageList => {
    if (reload) {
      location.reload();
    } else {
      routeControllerObj.reRender();
    }
  });
}
export default function i18n(routeController) {
  routeControllerObj = routeController;
  return {
    displayName: 'i18n',
    switchLanguage,
    t,
  };
}
