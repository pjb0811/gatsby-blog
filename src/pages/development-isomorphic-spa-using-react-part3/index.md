---
title: React를 활용한 isomorphic SPA 개발하기 - 3부
date: '2018-12-24'
mainImage: './react-loadable.png'
tags: ['react']
---

> react 를 활용한 isomorphic SPA 개발에 대한 내용을 정리한 글이다. 이 번 글은 코드 스플리팅에 관한 내용이다. 이 번 포스팅을 포함한 SPA와 관련된 글 내용은 정리하는데 오래 걸리지 않는 내용이지만 다른 프로젝트에 대한 내용을 준비 중이라 글 작성이 늦어지는 것 같다. 최대한 빨리 정리해보도록 하자. 앞서 작성한 글대로 의식의 흐름대로 정리하는 내용이라 부족한 부분도 있을꺼 같은데, 그건 그때 그때 정리하면서 업데이트하려고 한다. 잘 모르는 부분은 모른다고 남겨놓자. 다른 사람에게 설명하기 보다는 스스로의 학습 내용을 정리하는 글이기 때문에 편한 말투로 작성했다.

우선 코드 스플리팅에 대해 간단히 정리하고 넘어가도록 하자. 앞서 설명한 대로 SPA 환경에서 페이지 호출 시 해당 앱과 관련된 모든 리소스를 호출하게 된다. 이는 페이지 호출 시 해당 라우팅과 관련없는 페이지의 리소스도 요청한다는 의미가 된다. 앱 규모가 작으면 상관없겠지만 규모가 큰 앱의 경우 불필요한 리소스 요청으로 인해 페이지 로딩 속도에 영향을 줄 수 있다.

코드 스플리팅은 페이지 요청 시 사용자가 요청한 라우팅 페이지와 관련된 코드만 분리해서 요청하도록 하는 방법으로 이해하면 될 것 같다.

해당 기법의 경우 특정 라이브러리의 도움 없이 구현할 수 있지만 라이브러리를 활용하도록 하자. 기본 문법을 활용한 코드 스플리팅 방법은 충분히 학습한 뒤 다시 정리해보도록 하자. React 개발 환경에서 코드 스플리팅을 지원해주는 여러가지 라이브러리가 있는데 그 중에서 `react-loadable`을 활용하도록 하자.

## react-loadable

![react-loadable](./react-loadable.png)

`react-loadable` 은 앞서 설명한 코드 스플리팅 구현을 쉽게 도와주는 라이브러리라 보면 된다. 컴포넌트 및 라우터 기반의 스플리팅을 제공하며 클라이언트 및 서버 사이드 렌더링 환경에 대한 구현 기능도 제공한다. 우선 클라이언트 영역 내 코드 스플리팅 방법에 대해 알아보자.

## Client

- `src/lib/routes.js`

```javascript
import React from 'react'
import loadData from './loadData'
import Loadable from 'react-loadable'

const loading = () => {
  return <div>loading...</div>
}

const Routes = [
  {
    path: '/',
    exact: true,
    component: Loadable({
      loader: () => import('../components/Home'),
      loading,
    }),
  },
  {
    path: '/about',
    component: Loadable({
      loader: () => import('../components/About'),
      loading,
    }),
  },
  {
    path: '/posts/:id',
    component: Loadable({
      loader: () => import('../components/Posts'),
      loading,
    }),
    loadData: async path => await loadData(path),
  },
  {
    path: '/posts',
    component: Loadable({
      loader: () => import('../components/Posts'),
      loading,
    }),
    loadData: async path => await loadData(path),
  },
  {
    path: '/post',
    component: Loadable({
      loader: () => import('../components/Redirect'),
      loading,
    }),
  },
  {
    path: '*',
    component: Loadable({
      loader: () => import('../components/NotFound'),
      loading,
    }),
  },
]

export default Routes
```

우선 라우팅 컴포넌트를 호출하는 코드를 수정하자. 기존에는 기본적인 import 문법으로 컴포넌트를 호출하여 `react-router-dom` 에서 제공하는 `Route` 컴포넌트의 매개변수로 라우팅 컴포넌트를 넘겨주었다. 코드 스플리팅 적용을 위해 `react-loadable` 라이브러리를 `Loadable`이라는 이름으로 설정한 뒤, 함수 호출 형식으로 `Route` 컴포넌트에 인자로 넘겨주도록 했다. es6 문법에서 제공되는 dynamic import 구문을 통해 라우팅 정보에 맞는 컴포넌트 및 impor 되기 전, 로딩 시점의 컴포넌트를 적용하도록 설정했다.

### 나중에 정리할 일

- `src/index.js`

```javascript
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import * as serviceWorker from './serviceWorker'
import { BrowserRouter } from 'react-router-dom'
import Loadable from 'react-loadable'

Loadable.preloadReady().then(() => {
  ReactDOM.render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
    document.getElementById('root')
  )
})
```

우선 `src/index.js`

## Server

### 나중에 정리할 일

## 다음 과제

지금까지 Isomorphic SPA 의 코트 스플리팅 구현에 대한 내용을 정리했다. 다음은 비동기 데이터에 대한 SSR설정에 대해 정리해 보도록 하자.
