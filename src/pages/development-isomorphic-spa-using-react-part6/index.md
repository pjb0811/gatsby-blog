---
title: React를 활용한 isomorphic SPA 개발하기 - 6부
date: '2019-02-12'
mainImage: './mobx.png'
tags: ['react']
---

> 이번 파트는 전역 상태 관리 라이브러리인 `mobx` 를 활용한 내용을 정리했다. SPA 환경에서 전역 상태로 관리되는 데이터를 서버와 클라이언트 영역에서 어떻게 처리했는지에 대한 내용을 정리했다. <!-- end --> 이번 글 역시 스스로의 학습 내용을 정리하는 글이기 때문에 편한 말투로 작성했다.

## mobx

이 전 포스트에서 다룬 `redux`와 마찬가지로 `mobx` 또한 JavaScript 개발 환경에서 대표적으로 사용되는 상태 관리 라이브러리이다. 또한 이 전 글과 마찬가지로 `mobx`의 간략한 개념정리 및 react 환경에서 `mobx`를 어떻게 활용했는지에 대한 내용만 정리하려 한다.

![mobx-cycle](./mobx-cycle.png)

`mobx`의 경우 `redux`와 비슷한 흐름으로 데이터를 관리한다고 볼 수 있지만 기본 설정 및 상태를 접근하는 방식에서 차이가 있다. 우선 객체지향적인 설계를 지원하기 때문에 `Class` 문법을 활용하여 생각보다 쉽게 설계와 구현이 가능했고, 컴포넌트와 상태값을 연결하기 위한 설정을 `Decorator` 문법을 활용하여 `redux`를 사용할때 보다 복잡한 과정을 거치지 않는다. 무엇보다 `observer`, `observable`이라는 개념을 통해 컴포넌트에서 요청하는 `action`에 따라 상태값의 변경하는 과정을 이해하는데 있어 `redux` 보다 좀 쉬웠다.

하지만 아직까지는 `mobx`에 대해 완벽히 이해하지 못했기 때문에 이쯤에서 개념 설명은 정리하도록 하고 `mobx`를 어떻게 활용했는지 정리해보자.

## mobx-react

![mobx-react](./mobx-react.jpg)

앞서 설명한대로 `mobx` 또한 JavaScript 환경에서 사용 가능하지만 react 개발 환경에서 좀 더 쉽게 사용할 수 있도록 `mobx-react`라는 라이브러리를 같이 사용했다. 그리고 `mobx` 의 경우 `redux`와 달리 여러개의 `store`를 생성하여 전역 상태를 관리할 수 있다. `redux` 처럼 `reducer`, `action`을 따로 분리하지 않고 `store` 내에서 설정할 수 있다. 그래서 `store`의 개념 또한 `redux`와 조금 다르다고 생각한다.

또한 앞서 설명한대로 `mobx`의 경우 기본적인 문법으로 구현 가능하지만 `Class` 문법을 통해 좀 더 쉽게 구현할 수 있으며, 나 역시 `Class` 및 `Decotator` 문법을 활용했다. 다만 `Decorator` 문법을 활용할 경우 `babel` 플러그인 설정이 필요하기 때문에 관련 라이브러리도 추가했다.

그럼 우선 라이브러리를 설치하자.

```bash
yarn add --dev mobx mobx-react @babel/plugin-proposal-decorators
```

우선 `Decorator` 문법을 사용하기 위해 `babel` 관련 파일들을 수정했다.

- `config-overrides.js`

```javascript
const { ReactLoadablePlugin } = require('react-loadable/webpack')
const { injectBabelPlugin } = require('react-app-rewired')

module.exports = function override(config, env) {
  // ...

  config = injectBabelPlugin(
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    config
  )

  return config
}
```

클라이언트 영역의 경우 `babel` 플러그인 설정 시 `webpack` 설정이 필요하기 때문에 이 전에 활용했던 `react-app-rewired`를 통해 `babel` 플러그인을 설정해주었다.

- `babel.config.js`

```javascript
module.exports = function(api) {
  // ...
  const plugins = [
    // ...
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    // ...
  ]

  // ...
}
```

서버 영역에서 사용할 빌드 파일 생성시에도 플러그인 설정을 해주었다. 주의할 점은 `@babel/plugin-proposal-decorators` 플러그인 설정 시 기존에 설정되어있는 `@babel/plugin-proposal-class-properties` 플러그인 앞에 추가해줘야 한다. 그렇지 않을 경우 빌드 시 에러가 발행하니 참고하도록 하자.

이제 클라이언트/서버 영역에 대한 `babel` 설정이 완료되었으니 `mobx` 를 이용한 `store`들을 생성해보자.

- `src/mobx/Counter.js`

```javascript
import { observable, action } from 'mobx'

class Counter {
  @observable
  count = 1

  @action
  increment = () => {
    this.count += 1
  }

  @action
  decrement = () => {
    this.count -= 1
  }
}

export default Counter
```

우선 `Counter` 컴포넌트에서 사용할 `Class`를 생성했다. 해당 `Class`를 하나의 `store`로 볼 수 있으며 이 후 `mobx`에서 제공하는 `decorator`을 통해 `Class`의 정의된 프로퍼티를 관리하도록 설정했다. 해당 `decorator`를 통해 `action`으로 명시된 메서드 호출 시 `observable`로 명시된 프로퍼티의 변경 상태를 감지할 수 있도록 구현했다.

- `src/mobx/Posts.js`

```javascript
import { observable, action, computed, toJS } from 'mobx'
import loadData from '../lib/loadData'

class Post {
  @observable
  state = {
    loading: false,
    error: false,
    data: [],
  }

  constructor(props) {
    this.state = props.post ? props.post.state : this.state
  }

  @action
  getPost = async path => {
    this.state = {
      ...this.state,
      loading: true,
      data: [],
    }

    try {
      const data = await loadData(path)
      this.state.loading = false
      this.state.data = Array.isArray(data) ? data : [data]
    } catch (e) {
      this.state.error = true
    }
  }

  @computed
  get data() {
    return toJS(this.state.data)
  }
}

export default Post
```

`Posts` 컴포넌트에서 사용할 `Post Class` 를 구현했다. 앞서 구현한 `Counter Class` 와 같이 `action`, `observable`를 활용했다. 액션 함수인 `getPost`의 경우 비동기 요청을 위해 `async/await` 문법을 활용했다.

그리고 생성자 함수 호출 시 전달받은 인자값에 따라 `state` 값을 변경할 수 있도록 했다. 생성자 함수 설정의 경우 비동기 응답 데이터에 대한 상태값을 전달받기 위한 작업이며 이 후 컴포넌트 영역에서의 `store` 설정과 연결되는 부분이다. 이 전에 `redux-thunk`를 활용하여 비동기 데이터를 처리할때와 비슷한 구조로 생각해도 되지 않을까 싶다.

또한 감시대상으로 설정된 `state` 객체 내 프로퍼티를 확인히기 위해 `computed`, `toJS` 함수를 사용했다. `mobx`의 경우 `observable`로 명시된 객체의 경우 자체적으로 **불변성(immutable)**을 관리해주기 때문에 일반 객체로 치환이 필요하다. 사실 `redux`를 사용할 때도 객체의 불변성을 관리해주어야 하지만 따로 구현하지 않았다. 해당 내용에 관해서는 나중에 따로 포스팅할 수 있도록 하자.

- `src/mobx/Store.js`

```javascript
import Counter from './Counter'
import Post from './Post'

class Store {
  constructor(props) {
    this.counter = new Counter()
    this.post = new Post(props)
  }
}

export function initStore(initState = {}) {
  return new Store(initState)
}
```

앞서 구현한 `store` 들에 대한 `root store`를 구현했다. 생성자 함수 실행 시 클래스 프로퍼터로 앞서 구현한 `store`들을 추가했으며 이 후 `initStore` 함수를 통해 `Store` 클래스의 인스턴스를 반환할 수 있도록 구현했다. 또한 인자로 초기 상태 값을 전달받아 프로퍼티로 설정된 `store` 호출 시 해당 값을 넘겨주도록 했다. 그럼 이제 구현된 코드를 클라이언트 환경부터 적용해보도록 하자.

### Client

- `src/index.js`

```javascript
// ...

import { Provider } from 'mobx-react'
import { initStore } from './mobx/Store'

ReactDOM.render(
  <BrowserRouter>
    <Provider {...initStore(window.__INIT_DATA__)}>
      <App />
    </Provider>
  </BrowserRouter>,
  document.getElementById('root')
)

// ...
```

`redux`와 마찬가지로 최상위 컴포넌트에 초기 상태값을 연결하기 위해 `mobx-react`에서 제공하는 `Provider` 컴포넌트를 활용했다. `redux`와 달리 `store` 라는 props를 기본 인자로 받지 않고 `root store`에 정의된 프로퍼티를 props로 넘겨주면 된다. 그럼 이제 `store`로 전달받은 상태 데이터를 컴포넌트에 적용할 수 있도록 수정해 보자

- `src/components/Counter.jsx`

```javascript
import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'

@inject('counter')
@observer
class Counter extends Component {
  componentDidMount() {
    if (window.__INIT_DATA__) {
      window.__INIT_DATA__ = null
    }
  }

  render() {
    const { counter } = this.props

    return (
      <div>
        <h1>{counter.count}</h1>
        <button
          onClick={() => {
            counter.increment()
          }}
        >
          +
        </button>
        <button
          onClick={() => {
            counter.decrement()
          }}
        >
          -
        </button>
      </div>
    )
  }
}

export default Counter
```

`redux`를 사용할때와 달리 컴포넌트 영역에서도 `decorator` 문법을 활용하여 상태 데이터를 컴포넌트에 주입하도록 수정했다. 이 전과 달리 컴포넌트를 `export`할때 `HoC` 패턴을 통해 상태 정보와 `action` 정보를 따로 설정하지 않아도 된다. 대신 `mobx-react` 에서 제공하는 `inject` 함수를 통해 `root store`로부터 전달받은 프로퍼티 중 `counter store`만을 사용할 수 있도록 명시해주었다. 이 후 해당 컴포넌트를 `observer`로 명시해줌으로써 `counter store` 에서 `observable`로 설정된 데이터의 상태를 감지할 수 있도록 설정했다.

- `src/components/Posts.jsx`

```javascript
import React, { Component } from 'react'
import withLayout from './withLayout'
import { observer, inject } from 'mobx-react'

@inject('post')
@observer
class Posts extends Component {
  componentDidMount() {
    const { post, match } = this.props
    if (window.__INIT_DATA__) {
      window.__INIT_DATA__ = null
    } else {
      post.getPost(match.url)
    }
  }

  render() {
    const { post } = this.props

    return (
      <div>
        {post.state.loading && '...loading'}
        {post.state.error && 'error!'}
        {post.data.map((item, i) => (
          <div key={i}>{item.title}</div>
        ))}
      </div>
    )
  }
}

export default withLayout(Posts)
```

`Posts` 컴포넌트 역시 `inject`, `observer`를 활용하여 컴포넌트에 필요한 상태 정보 및 `action` 요청 시 변경된 데이터를 감지할 수 있도록 수정했다. 이 후 비동기로 요청된 데이터에 대한 렌더링 과정 역시 이 전과 크게 다르지 않지만 `observable`로 명시된 객체에 접근할 경우 자체적으로 객체 불변성을 관리해주기 때문에 앞서 `computed`로 명시된 함수를 통해 해당 데이터에 접근할 수 있도록 수정했다.

위와 같이 클라이언트 영역에 대한 설정은 완료한 후 개발 서버를 실행해보면 정상적으로 페이지가 동작하는 것을 확인할 수 있다. 이제 서버 측 렌더링에 필요한 작업을 진행하도록 하자.

### Server

`mobx`를 활용한 서버 측 렌더링의 경우 의 경우 이 전과 같이 `async/await` 문법을 통해 비동기 데이터를 전달받기 때문에 이 전에 `redux-saga`를 테스트하면서 구현했던 내용들을 기존에 사용했던 방법대로 구조 변경이 필요하다. 우선 렌더링 데이터을 반환하는 `renderer` 함수부터 수정해보자.

- `src/lib/renderer.js`

```javascript
// ...
import { toJS } from 'mobx'
import { Provider } from 'mobx-react'
import { initStore } from '../mobx/Store'

const renderer = async ({ req, html }) => {
  const currentRoute = routes.find(route => matchPath(req.url, route)) || {}
  const initState = currentRoute.loadData
    ? await currentRoute.loadData(req.url)
    : {}

  const store = initStore(toJS(initState))
  const context = {}
  let modules = []

  const app = renderToString(
    <Loadable.Capture report={moduleName => modules.push(moduleName)}>
      <StaticRouter location={req.url} context={context}>
        <Provider {...store}>
          <App />
        </Provider>
      </StaticRouter>
    </Loadable.Capture>
  )

  const bundles = getBundles(stats, modules)
  const renderHTML = html.replace(
    '<div id="root"></div>',
    `<div id="root">${app}</div>
    <script>window.__INIT_DATA__ = ${serialize(toJS(store))}</script>
    ${bundles
      .filter(bundle => !bundle.file.includes('.map'))
      .map(bundle => `<script src="${bundle.publicPath}"></script>`)
      .join('\n')}
    `
  )

  return {
    html: renderHTML,
    context,
  }
}

// ...
```

이 전에 `redux-thunk`를 활용하여 서버 렌더링을 구현했던 구조로 다시 변경했다. 이 전에 설명했던 내용과 같은 방식으로 구성되어 있으며 `store` 생성 함수 및 `Provider` 컴포넌트만 `mobx`를 사용하도록 변경되어있다. `store` 함수 호출 시 인자로 전달받을 초기 데이터 및 `window.__INIT_DATA__` 객체의 경우 `toJS` 함수를 통해 일반 객체 타입으로 변경해주었다.

위와 같이 수정된 `renderer` 함수의 구조에 서버 실행 및 라우터 설정 파일만 수정해주면 된다.

- `src/lib/routes.js`

```javascript
// ...
import { initStore } from '../mobx/Store'

// ...

const store = initStore()

const Routes = [
  // ...
  {
    path: '/posts/:id',
    component: Loadable({
      loader: () => import('../components/Posts'),
      loading,
    }),
    loadData: async path => {
      const { post } = store
      await post.getPost(path)
      return { ...store }
    },
  },
  {
    path: '/posts',
    component: Loadable({
      loader: () => import('../components/Posts'),
      loading,
    }),
    loadData: async path => {
      const { post } = store
      await post.getPost(path)
      return { ...store }
    },
  },
  // ...
]

export default Routes
```

라우팅 컴포넌트에서 접근 시 호출하는 `loadData` 함수 역시 이 전과 같이 `async/await` 문법을 통해 비동기 데이터를 처리할 수 있도록 설정했다. 다만 이 전에 `redux-thunk`를 사용했을때와 달리 외부에 분리된 `action`을 `dispatch`할 필요없이 `store`에 설정된 `action` 함수를 호출한 후 전역 데이터를 반환하도록 설정했다.

- `server/index.js`

```javascript
// ...

app.all('*', async (req, res) => {
  const { html, context } = await renderer({ req, html: indexHTML })

  if (context.status === 404) {
    res.status(404)
  }

  if (context.status === 301) {
    res.redirect(301, context.url)
  }

  res.send(pretty(html))
})

// ...
```

서버 실행 시 코드 구조 또한 이 전에 `redux-thunk`를 사용했을때와 같은 방식으로 변경했다. 서버 측 영역도 모두 수정이 완료했고 서버를 실행해보면 비동기 데이터에 대한 서버 측 렌더링도 정상적으로 동작하는 것을 확인했다.

## 다음 과제

지금까지 SPA 개발환경에서 `redux` 및 `mobx`를 활용하여 전역 상태 데이터를 처리하는 방법에 대한 내용들을 정리했다. 다음은 `<head/>` 태그 내에서 사용되는 여러가지 요소를 관리해 줄 수 있는 라이브러리인 `react-helmet`를 SPA 환경에서 활용하는 방법에 대한 내용을 정리하고자 한다.
