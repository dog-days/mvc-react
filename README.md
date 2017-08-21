# mvc-react

在  `react` 、`redux` 、`router` 的基础上实现新一代 MVC 的一套解决方案，可以摆脱大量繁杂的配置过程。



## 初览-第一印象

```jsx
import React from 'react';
import { render } from 'react-dom';
import { BrowserMVC as MVC, Controller } from 'mvc-react';

function modelRegister(register) {
	//register model or else
}

function renderApp() {
  render(<MVC modelRegister={modelRegister} />, document.getElementById('root'));
}

// start
renderApp();
```



## install

```bash
$ npm i mvc-react
```

or

```bash
$ yarn add mvc-react
```



## 角色

首先我们将传统的 MVC 模式与我们的 MVC 模式进行对比。

传统的 MVC 模式：

> [MVC](https://baike.baidu.com/item/MVC)全名是Model View Controller，是模型(model)－视图(view)－控制器(controller)的缩写，一种软件设计典范，用一种业务逻辑、数据、界面显示分离的方法组织代码，将业务逻辑聚集到一个部件里面，在改进和个性化定制界面及用户交互的同时，不需要重新编写业务逻辑。

![](https://raw.githubusercontent.com/tomsonTang/mvc-react/assets/assets/traditional-mvc.jpeg)

mvc-react 与传统的 MVC 模式相比较有几点不同：

1. 传统的 view 不负责交互逻辑，由 controller 处理交互逻辑并更新 model 数据。
   而我们使用了 react 作为我们的 view 层，完全可以在 react 组件中写与用户的交互逻辑。
2. 传统的 model 与 view 一样不负责交互逻辑，只负责数据的维护，这里我们使用了 [redux-saga-model](https://github.com/tomsonTang/redux-saga-model) 的思想，将其作为 model 层。由于 model 中的 saga 拥有极强的流程控制能力( 底层使用的是 redux-saga )，所以我们完全可以把比较复杂的交互逻辑抽取放在 model 层，此时我们的 model 即具有数据维护的能力也具备实现复杂交互逻辑的能力，再进一步的细分我们还可以将 model 细分成两部分[( dataModel、viewModel)](https://github.com/tomsonTang/redux-saga-model-tutorial/blob/master/dividing.md)。
3. 传统的 controller 除了实现交互逻辑还负责路由的控制，mvc-react 的 Controller 只实现路由功能不参与其他逻辑 。

mvc-react 与传统的 MVC 模式比较的相同点：

1. 当 model 的数据发生了变化时通知 view 进行及时更新。
2. 一样是 model 层对数据负责，不同的 model 负责不同纬度亦或不同业务逻辑相关的数据。

### mvc-react 的组件交互图：

![](https://raw.githubusercontent.com/tomsonTang/mvc-react/assets/assets/mvc.jpg)



## 如何使用

### Controller

在开发中我们最常做的就是区分模块，Controller 也一样，你可以根据你的需要来划分 controller 的纬度。

在 mvc-react 中，controller 实际上是对路由的高阶抽象，在 controller  中，你可以选择对外开放什么页面以及开放哪些页面。

mvc-react 底层封装了 [react-router-controller](https://github.com/dog-days/react-router-controller) ，该组件实现了 URL 与 controller 以及对应d的 View 的动态映射规则。

使用该功能只需要提供一个参数对象给 Controller 的静态 set 方法即可：

```jsx
  Controller.set({
    readViewFile(viewId) {
      //view可以异步载入
      return import(`./view/${viewId}/index.jsx`).then(component => {
        return component.default;
      });
    },
    readControllerFile(controllerId) {
      //webpackMode: eager是使import变为不异步，跟require一样，
      return import(/* webpackMode: "eager" */
      `./controller/${controllerId}.js`)
        .then(controller => {
          return controller.default;
        })
    },
    //设置首页path（跳转路径，即react-router path='/'时，会跳转到indexPath）
    indexPath: '/main/index',
  });
```

这样当每次 URL 发生变更时，只要符合映射规则就会执行上述通用流程，并获取对应的 controller ，以及 View 然后展示给用户。

controller 的配置规则如下：

```javascript
import Controller from 'react-router-controller';

export default class MainController extends Controller {
  indexView(params) {
    return this.render(
      {
        title: '主页',
        breadcrumbs: [],
      },
      params
    );
  }
}
```

很明显这里采用了类的写法，首先引入基类 `Controller` 然后写下对外开放的 viewId 对应的方法名，譬如这里对外开放的 viewId 为 index，则对应的方法名为 indexView。更多细节查看该框架的[使用入门](https://github.com/dog-days/react-router-controller#使用入门)



### Model

mvc-react 底层封装了 [redux-saga-model](https://github.com/tomsonTang/redux-saga-model) ,每个 model 内都有 `reducers` 和 `sagas` ，reducers 中的 reducer 维护 redux 的 model namespace 下的数据块，每个 reducer 都输纯函数，不包括副作用，而 sagas 中的每个 saga 都可以写复杂的副作用。

```javascript
{
  namespace:'index',
  state:{
    name:'Tim'
  },
  reducers:{
    update:function(state,{payload}){
      return{ ...state,name:payload.name };
    }
  },
  sagas:{
    *updateName({payload},effects){
      yield effects.put({
          type:'update',
          payload,
        });
    }
  }
}
```

篇幅有限，这里不对 model 进行细入的[讲解](https://github.com/tomsonTang/redux-saga-model-tutorial)，重点讲如何在 mvc-react 中使用上述的这些 model。

我们回看[初栏-第一印象](#初览-第一印象)中的代码:

```jsx
import React from 'react';
import { render } from 'react-dom';
import { BrowserMVC as MVC, Controller } from 'mvc-react';
import model from 'model/index/db.js'

function modelRegister(register) {
	//register model or else
  	register(model);
}

function renderApp() {
  render(<MVC modelRegister={modelRegister} />, document.getElementById('root'));
}

// start
renderApp();
```

我们只需要在 mvc 组件中注入一个 modelRegister 回调，即可拿到入参，注册 model 的方法 `register` 对 model 进行注册。

结合 [Controller](#controller) 中的介绍，我们可以写出动态加载 controller 以及 view 组件的同时动态注册 model 的代码。

```jsx
import React from 'react';
import { render } from 'react-dom';
import { BrowserMVC as MVC, Controller } from 'mvc-react';

function modelRegister(register) {
  
  // Controller.set 设置如何读取指定模块的过程
  // 譬如如何根据一个 controllerID 加载一个 controller 组件,如何根据一个 viewID 加载一个 view 组件

  Controller.set({
    readViewFile(viewId, firstLoad) {
      if (firstLoad) {
        import(/* webpackMode: "eager" */
        `./model/${viewId}.js`)
          .then(model => {
            //注册sagaModel
            register(model.default);
          });
      }
      //view 可以异步载入
      return import(`./view/${viewId}/index.jsx`).then(component => {
        return component.default;
      });
    },
    readControllerFile(controllerId) {
      //webpackMode: eager是使import变为不异步，跟require一样，
      return import(/* webpackMode: "eager" */
      `./controller/${controllerId}.js`)
        .then(controller => {
          return controller.default;
        });
    },
    //设置首页path（跳转路径，即 react-router path='/'时，会跳转到indexPath）
    indexPath: '/main/index',
  });
}

function renderApp() {
  render(<MVC modelRegister={modelRegister} />, document.getElementById('root'));
}

// start
renderApp();
```



### View

有了上面强大的 Controller 和 Model ，对于 View 而言，我么可以写出非常轻量级的组件，在 react 组件中，当需要触发对应的后续处理时，只需要分发对应的 action 即可，对应 namespace 的 model 会对其进行捕获，并更新数据，重新触发 view 的渲染更新。

```jsx
import React from 'react';
import { connect } from 'react-redux';

@connect(state => {
  return {
    display: state.index,
  };
})
export default class AboutView extends React.Component {
  showToggleEvent = e => {
    const { dispatch, display } = this.props;
    if (display) {
      dispatch({
        type: 'index/toggleShow',
        payload: false,
      });
    } else {
      dispatch({
        type: 'index/toggleShow',
        payload: true,
      });
    }
  };
  render() {
    const { display } = this.props;
    return (
      <div>
        当前位置主页页面：
        <button onClick={this.showToggleEvent}>
          {display ? '隐藏' : '显示'}
        </button>
        {display && <div>我被显示了</div>}
      </div>
    );
  }
}
```

