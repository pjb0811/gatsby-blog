---
title: React를 활용한 isomorphic SPA 개발하기 - 2부
date: '2018-12-02'
mainImage: './spa.jpeg'
tags: ['react']
---

> react 를 활용한 isomorphic SPA 개발에 대한 내용을 정리한 글입니다. 이 전 글에 이어 라우팅 설정 및 비동기 데이터에 대한 SSR 설정 내용을 정리했습니다.

## Routing

이 전 작업한 글에서 기본적인 Isomorphic SPA 설정은 해주었지만 미처 작업하지 못한 내용들이 많이 있습니다. 그 중에서 저는 라우팅 설정부터 먼저 진행하려고 합니다.

이 후 작업 내용을 보시면 이해하실 수 있으시겠지만 라우팅 설정과 관련된 서드파티 라이브러리를 통해 기본적인 라우팅 설정 및 비동기 데이터에 대한 정적 데이터 렌더링까지 처리하기 위해서입니다.

React 개발 환경에서 라우팅 설정을 지원해주는 여러가지 라이브러리가 있는데 그 중에서 저는 `react-router-dom`을 활용하도록 하겠습니다.

`react-router-dom`은 `react-router`라는 라이브러리에서 DOM 바인딩과 관련된 라우팅 설정 기능만 간추린 라이브러리로 보시면 될 것 같습니다.

`react-router`는 React 에서 공식적으로 제공하는 라이브러리는 아니지만 이 전부터 React 환경의 SPA 개발 시에 많은 분들이 사용해왔던 라우팅 설정에 필요한 패키지입니다.

버전이 업데이트되면서 `react-router` 내에서 필요한 기능에 따라 `react-router-dom` 뿐만 아니라 `react-router-native`, `react-router-config` 등의 라이브러리가 제공되는데 저는 `react-react-dom`을 활용해보도록 하겠습니다.

`react-react-dom` 대한 자세한 사용법은 해당 [링크](https://reacttraining.com/react-router/web/guides/quick-start)를 통해 살펴보시면 좋을 것 같습니다.

### Client Routing

### 기본 설정

그럼 해당 패키지를 사용하기 위해선 설치부터 진행하도록 하겠습니다.

```bash
yarn add --dev react-router-dom
```

우선 클라이언트 영역의 컴포넌트 라우팅 설정을 위해 기본적인 프로젝트 구조를 살짝 변경하도록 하겠습니다.

우선 클라이언트 영역에서 사용했던 기본 컴포넌트를 렌더링 시 라우팅 정보를 전달받을 수 있도록 `react-router-dom`에서 제공하는 `BrowserRouter` 컴포넌트로 감싸도록 합니다.

- `src/index.js`

```javascript
...
import { BrowserRouter } from 'react-router-dom'

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
)
...
```

이후 기존에 사용했던 기본 컴포넌트를 라우팅 처리를 담당하는 메인 컴포넌트로 사용할 수 있도록 수정하도록 하겠습니다.

- `src/App.js`

```javascript
import React, { Component } from 'react'
import { Switch, Route, NavLink } from 'react-router-dom'
import Home from './components/Home'
import About from './components/About'

class App extends Component {
  render() {
    return (
      <div>
        <ul>
          <li>
            <NavLink to="/">home</NavLink>
          </li>
          <li>
            <NavLink to="/about">about</NavLink>
          </li>
        </ul>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/about" component={About} />
        </Switch>
      </div>
    )
  }
}

export default App
```

기본 프로젝트 생성 시 만들어진 코드들은 사용하지 않기 때문에 지우도록 하겠습니다. 대신 라우팅 설정을 위한 링크 및 라우팅 정보에 맞게 컴포넌트 렌더링을 처리할 수 있도록 컴포넌트를 수정했습니다.

`NavLink` 컴포넌트를 통해 링크 클릭 시 `Route` 컴포넌트에서 해당 라우팅 정보를 읽어 `Switch` 영역 내에서 라우팅 정보와 연결된 컴포넌트를 렌더링 할 수 있도록 수정했습니다.

이제 `Route` 컴포넌트에 전달할 `Home`, `About` 컴포넌트를 만들어 주면 될 것 같습니다.

이 후 `src/components` 폴더를 생성하고 해당 경로에 라우팅 주소와 연결할 컴포넌트를 만들도록 하겠습니다.

- `src/components/Home.jsx`

```javascript
import React from 'react'

const Home = () => {
  return <div>home</div>
}

export default Home
```

- `src/components/About.jsx`

```javascript
import React from 'react'

const About = () => {
  return <div>about</div>
}

export default About
```

라우팅을 통해 연결되는 컴포넌트에서 아직까지 특별히 처리해줄 기능은 없기 때문에 기본적인 구조로 생성했습니다.

우선 지금까지 작업한 클라이언트 라우팅 설정이 잘 동작하는지 확인해보기 위해 개발 서버를 실행해도록 하겠습니다.

```bash
yarn start
```

![client-routing](./client-routing.gif)

실행 후 화면에서 상딘 링크 클릭 시 라우팅 정보에 맞게 컴포넌트가 정상적으로 렌더링되는 것을 확인하실 수 있으실 겁니다.

### url 매개변수

라우팅 설정을 통한 페이지 렌더링 시 라우팅 내 url 매개변수를 활용하여 동일한 컴포넌트에서 여려가지 기능을 처리해 줄 수도 있습니다. 우선 url 매개변수 처리를 위한 컴포넌트를 생성하고 라우팅 목록에 추가하도록 하겠습니다.

- `src/App.js`

```javascript
...
import Posts from './components/Posts'

class App extends Component {
  render() {
    return (
      <div>
        <ul>
          ...
          <li>
            <NavLink to="/posts">posts</NavLink>
          </li>
          <li>
            <NavLink to="/posts/1">posts/1</NavLink>
          </li>
        </ul>
        <Switch>
          ...
          <Route path="/posts/:id" component={Posts} />
          <Route path="/posts" component={Posts} />
        </Switch>
      </div>
    )
  }
}
```

라우팅 설정 목록에 `/posts` 라는 링크와 해당 주소에 대한 라우팅 영역을 추가했습니다. 두 개의 url 를 전달받도록 추가하였고 첫 번째는 `post/:id` 라는 형식으로 라우트 정보를 받을 수 있도록 하였고, 두 번째는 매개변수를 받지 않는 기본 영역을 추가했습니다. 중요한 점은 같은 url 정보를 가지는 라우팅 컴포넌트들을 여러개 설정할 경우 기본

- `src/components/Posts.jsx`

```javascript
import React from 'react'

const Posts = ({ match }) => {
  return <div>{JSON.stringify(match)}</div>
}

export default Posts
```

### Redirect, 404 페이지

## Server Routing

## 비동기 데이터 처리
