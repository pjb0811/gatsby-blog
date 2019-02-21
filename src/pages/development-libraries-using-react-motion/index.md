---
title: react-motion을 활용한 라이브러리 개발
date: '2019-02-19'
mainImage: './react-motion.jpg'
tags: ['react', 'css']
---

> 이 글은 react 환경에서 애니메이션 효과를 쉽게 사용할 수 있도록 도와주는 `react-motion`를 사용하면서 배웠던 내용들을 정리했다. 이번 글 역시 스스로의 학습 내용을 정리하는 글이기 때문에 편한 말투로 작성했다.

기본적으로 웹에서 애니메이션을 다루는 방법은 굉장히 다양하다. `CSS`를 활용한 기본적인 애니메이션부터 `canvas`를 활용한 애니메이션, `DOM` 기반의 `Web Animations` 등 다양한 방법을 통해 애니메이션을 사용할 수 있다.

물론 react 환경에서도 위에 언급할 방법들로 애니메이션을 사용할 수 있지만 `react-motion`이라는 라이브러리를 활용하여 react 환경에서 좀 더 쉽고 간편하게 원하는 애니메이션을 구현할 수 있었다. 이제 해당 라이브러리를 활용하여 개인적인 프로젝트에 사용할 써드파티 라이브러리를 만들면서 느꼈던 내용들을 정리하려고 한다.

## react-motion

react를 사용하여 개인적인 프로젝트를 진행하다보니 컴포넌트에 애니메이션을 활용하고자 하는 부분이 필요했다. 그래서 관련된 내용을 찾다보니 `react-motion`이란 라이브러리를 찾았고, 기타 다른 애니메이션 관련 라이브러리와 비교했을때 제일 잘 만들어진 라이브러리가 판단되었다. 그래서 해당 라이브러리를 사용하여 내가 필요로 하는 애니메이션을 쉽게 구현할 수 있었다.

기본적인 사용법은 해당 라이브러리에서 제공하는 `Motion`, `StaggeredMotion`, `TransitionMotion` 등의 트랜지션 컴포넌트들을 활용하며 기본적으로 `style` 이라는 prop를 통해 애니메이션과 관련된 state를 주입하게 된다. 이 과정에서 `spring` 이라는 함수를 활용하여 스타일 변경에 대한 애니메이션 효과를 설정해줄 수 있다.

이 후 렌더링 시 `Function as children` 패턴을 통해 전달받은 함수의 인자를 활용하여 실제 애니메이션이 적용될 요소에 대한 `css` 속성을 적용하여 애니메이션 효과를 표현할 수 있다.

<figure>
  <iframe src="https://codesandbox.io/embed/01q1voo3jl?codemirror=1&fontsize=14" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>
</figure>

`react-motion`을 활용한 예제 코드로서 버튼 클릭 시 `animate` 함수를 실행하여 state에 설정된 `height` 값을 변경해주는 간단한 구조의 컴포넌트이다. 변경된 상태 값은 `Motion` 컴포넌트 렌더링 시 props로 전달해주며 이후 해당 상태 값을 통해 요소의 높이값 변경에 대한 애니메이션을 표현하게 된다.

실행 화면을 확인해보면 위와 같이 요소에 대한 높이값 변경 시 정적으로 처리되지 않고 애니메이션 효과를 통해 동적으로 변경되는 것을 확인할 수 있다.

그럼 이제 `react-motion`을 활용하여 만든 써드파티 라이브러리의 일부 내용을 정리해 보도록 하자.

## Carousel

기존의 작업했던 프로젝트 중 `carousel` 형태의 배너 서비스를 애니메이션 효과를 입혀 새롭게 리팩토링하고 싶었다. 그래서 관련 라이브러리를 찾아보던 중 마땅한 라이브러리를 찾지 못했고 앞서 언급한 `react-motion`을 활용하여 내가 원하는 기능을 표현해줄 수 있는 컴포넌트를 만들게 되었다.

```javascript
import React, { Component } from 'react'
import Carousel from './Carousel'

class App extends Component {
  state = {
    index: 0,
  }

  move = index => {
    this.setState({
      index,
    })
  }

  render() {
    const defaultStyle = {
      width: 300,
      height: 300,
      margin: '0 auto',
    }

    return (
      <div
        style={{
          ...defaultStyle,
        }}
      >
        <Carousel
          index={0}
          width={300}
          height={300}
          direction={'horizontal'}
          effect={'3d'}
          onClick={() => {}}
          onChange={index => {
            this.move(index)
          }}
        >
          <div>1</div>
          <div>2</div>
          <div>3</div>
        </Carousel>
      </div>
    )
  }
}
```

우선 기본적인 사용법에 대한 예제 코드를 정리했다. `Carousel`이라는 컴포넌트를 구현했고 자식에 추가된 요소들의 애니메이션 효과를 가지는 컴포넌트를 구현했다. 컴포넌트 사용 시 props 로 전달하는 값의 통해 여러 옵션들을 추가해줄 수 있도록 했다.

`index`라는 props의 경우 렌더링 시

처음 기능들을 구현하면서 제일 고려했던 사항은 `CSS3`의 `transform`을 활용한 `3D` 효과를 표현하는 것이었다. 그래서 처음에는 `3D`효과의 애니메이션으로 `carousel`를 구현했는데 이 후 `effect`라는 props에 `2d` 또는 `3d`라는 값을 설정해줌으로써 원하고자하는 이펙트를 설정할 수 있도록 수정했다.

<figure>
<iframe src="https://codesandbox.io/embed/x7jv6oj8lo?codemirror=1&fontsize=14" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>
</figure>

## Cube

## Windows
