import Controller from 'react-router-controller';
import LayoutComponent from '../view/layout/main';
import { t } from 'mvc-react';

export default class MainController extends Controller {
  LayoutComponent = LayoutComponent;
  indexView(params) {
    return this.render(
      {
        title: t('主页'),
        breadcrumbs: [],
      },
      params
    );
  }
  aboutView(params, config) {
    if (!this.checkParams(params, ['id'])) {
      return false;
    }
    return this.render(
      {
        title: t('关于'),
        breadcrumbs: [],
      },
      params
    );
  }
}
