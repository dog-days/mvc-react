import React from 'react';
import PropTypes from 'prop-types';

//中转作用
let __Locale__;
//切换后的语言列表
let changedLanguageList;
//后面会赋值
let getLanguageSpecificListTemp;
export function switchLanguage(language) {
  if (!getLanguageSpecificListTemp) {
    console.error('switchLanguage 先执行getLanguageSpecificListTemp为undefined.');
    return;
  }
  const languageListPromise =
    getLanguageSpecificListTemp && getLanguageSpecificListTemp(language);
  if (!languageListPromise.then && !languageListPromise.catch) {
    console.error('"getLanguageSpecificList" should return promise!');
    return;
  }
  return languageListPromise.then(languageList => {
    if (!languageList) {
      return false;
    }
    //兼容es6语法
    languageList = languageList.default || languageList;
    //记录当前的language
    localStorage.currentLanguage = language;
    changedLanguageList = languageList;
    return languageList;
  });
}

export function t(str) {
  if (changedLanguageList) {
    var o = changedLanguageList[__Locale__[str]];
    if (o) {
      return o;
    }
  }
  return str;
}

/**
 * @prop { function } getLanguageSpecificList 获取指定的语言列表，返回promise对象
 * 参数为各种语言的标识字符串，返回指定语言的数组列表（promise对象）
 */
export default class I18nProvider extends React.Component {
  static propTypes = {
    getLanguageSpecificList: PropTypes.func.isRequired,
    defaultLanguageList: PropTypes.array.isRequired,
    I18nLoading: PropTypes.element,
  };
  displayName = 'I18nProvider';
  state = {};
  componentDidMount() {
    const { getLanguageSpecificList, defaultLanguageList = [] } = this.props;
    getLanguageSpecificListTemp = getLanguageSpecificList;
    if (!__Locale__) {
      __Locale__ = {};
      defaultLanguageList.forEach((v, k) => {
        __Locale__[v] = k;
      });
    }
    if (localStorage.currentLanguage) {
      let switchLanguagePromise = switchLanguage(localStorage.currentLanguage);
      if (switchLanguagePromise && switchLanguagePromise.then) {
        switchLanguagePromise.then(languageList => {
          this.setState({
            canRender: true,
          });
        });
      }
    }
  }

  render() {
    const { children, I18nLoading } = this.props;
    const { canRender } = this.state;
    if (!canRender) {
      if (I18nLoading) {
        return <I18nLoading />;
      }
      return false;
    } else {
      return (
        <span>
          {children}
        </span>
      );
    }
  }
}
