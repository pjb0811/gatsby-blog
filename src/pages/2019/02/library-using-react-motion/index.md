---
title: react-motion을 활용한 라이브러리 개발
date: '2019-02-19'
mainImage: './react-motion.jpg'
tags: ['react', 'css']
---

> 이 글은 react 환경에서 애니메이션 효과를 쉽게 사용할 수 있도록 도와주는 `react-motion`를 사용하면서 배웠던 내용들을 정리했다. 이번 글 역시 스스로의 학습 내용을 정리하는 글이기 때문에 편한 말투로 작성했다.<!-- end -->

기본적으로 웹에서 애니메이션을 다루는 방법은 굉장히 다양하다. `CSS`를 활용한 기본적인 애니메이션부터 `canvas`를 활용한 애니메이션, `DOM` 기반의 `Web Animations` 등 다양한 방법을 통해 애니메이션을 사용할 수 있다.

물론 react 환경에서도 위에 언급할 방법들로 애니메이션을 사용할 수 있지만 `react-motion`이라는 라이브러리를 활용하여 react 환경에서 좀 더 쉽고 간편하게 원하는 애니메이션을 구현할 수 있었다. 이제 해당 라이브러리를 활용하여 개인적인 프로젝트에 사용할 써드파티 라이브러리를 만들면서 느꼈던 내용들을 정리하려고 한다.

## react-motion

react를 사용하여 개인적인 프로젝트를 진행하다보니 컴포넌트에 애니메이션을 활용하고자 하는 부분이 필요했다. 그래서 관련된 내용을 찾다보니 `react-motion`이란 라이브러리를 찾았고, 기타 다른 애니메이션 관련 라이브러리와 비교했을때 제일 잘 만들어진 라이브러리가 판단되었다. 그래서 해당 라이브러리를 사용하였고, 결과적으로 내가 필요로 하는 애니메이션을 쉽게 구현할 수 있었다.

기본적인 사용법은 해당 라이브러리에서 제공하는 `Motion`, `StaggeredMotion`, `TransitionMotion` 등의 트랜지션 컴포넌트들을 활용하며 기본적으로 `style` 이라는 prop를 통해 애니메이션과 관련된 state를 주입하게 된다. 이 과정에서 `spring` 이라는 함수를 활용하여 스타일 변경에 대한 애니메이션 효과를 설정해줄 수 있다.

이 후 렌더링 시 `Function as children` 패턴을 통해 전달받은 함수의 인자를 활용하여 실제 애니메이션이 적용될 요소에 대한 `css` 속성을 적용하여 애니메이션 효과를 표현할 수 있다.

<figure>
  <iframe src="https://codesandbox.io/embed/01q1voo3jl?codemirror=1&fontsize=14" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>
</figure>

`react-motion`을 활용한 예제 코드로서 버튼 클릭 시 `animate` 함수를 실행하여 state에 설정된 `height` 값을 변경해주는 간단한 구조의 컴포넌트이다. 변경된 상태 값은 `Motion` 컴포넌트 렌더링 시 props로 전달해주며 이후 해당 상태 값을 통해 요소의 높이값 변경에 대한 애니메이션을 표현하게 된다.

실행 화면을 확인해보면 위와 같이 요소에 대한 높이값 변경 시 정적으로 처리되지 않고 애니메이션 효과를 통해 동적으로 변경되는 것을 확인할 수 있다.

이제 `react-motion`의 소개 및 자세한 사용법보다는 해당 라이브러리를 활용하여 만들었던 개인적인 써드파티 라이브러리의 내용들을 설명하려한다. 기본 소개 및 자세한 사용법의 경우 해당 라이브러리의 `API`에 잘 정리되어 있으며 해당 라이브러리를 통해 만들어 낼 수 있었던 기능들에 대해 정리하려 한다. 그럼 이제 `react-motion`을 활용하여 만든 써드파티 라이브러리의 일부 내용을 정리해 보도록 하자.

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

`index`라는 props의 경우 렌더링 시 처음 화면에 보여줄 요소의 순서값을 설정해줄 수 있도록 했다. 그리고 `width` 와 `height`를 해당 컴포넌트의 사이즈를 설정해줄 수 있도록 했다. 다만 해당 props를 통해 사이즈를 설정해주더라도 `Carousel` 컴포넌트를 감싸는 요소에 추가적인 스타일 설정이 필요하긴 하다. 이 부분은 구현하면서 고민했던 부분이며 해당 컴포넌트를 감싸는 부모 요소에 경우 `Carousel` 컴포넌트에서 추가적인 부모 요소를 생성하지 않도록 하기 위해 구현했으며, 그렇게 때문에 `Carousel` 컴포넌트를 감싸는 요소에 대한 크기 지정이 필요하다.

그리고 처음 기능들을 구현하면서 제일 고려했던 사항은 `CSS3`의 `transform`을 활용한 `3D` 효과를 표현하는 것이었다. 그래서 처음에는 `3D`효과의 애니메이션으로 요소들을 회전시킬 수 있도록 구현했는데 이 후 `effect`라는 props에 `2d` 또는 `3d`라는 값을 설정해줌으로써 원하고자 하는 이펙트를 설정할 수 있도록 수정했다.

그 외에도 `direction`이라는 props를 통해 자식 요소들이 움직이는 방향을 설정해줄 수 있도록 했다. `onClick` props의 경우 해당 컴포넌트에 대한 클릭 이벤트를 설정해 주기 위한 기능이다(사실 이벤트 설정의 경우 자식 요소에 직접 설정해줘도 되기 때문에 굳이 필요한 기능인지는 모르겠다. 나중에 수정할 수 있도록 하자). `onChange` 의 경우 콜백 함수 타입으로 설정 가능하며 인자값으로 현재 표시되는 자식 요소의 순서값을 전달해주게 된다.

그럼 이제 구현한 `Carousel` 컴포넌트에서 `react-motion`을 활용한 내용을 확인해보자. 사실 컴포넌트 전체에 대한 내용을 정리하고 싶지만 내용을 너무 길어질 것 같아 렌더링 시점 시 `Motion` 컴포넌트를 활용한 내용만 정리했다.

```javascript
import * as React from 'react'
import { Motion, spring } from 'react-motion'
import styles from './carousel.css'
// ...

class Carousel extends React.Component<Props, State> {
  // ...

  render() {
    // ...

    return (
      <div className={styles.carouselWrapper}>
        <Motion
          style={{
            rotateDeg: spring(carousel.rotate.deg),
          }}
        >
          {({ rotateDeg }) => {
            return (
              <div
                className={styles.carousel}
                style={{
                  transform: `translate3d(${carousel.translate.x}px, ${
                    carousel.translate.y
                  }px, ${carousel.translate.z}px) ${
                    is2dEffect
                      ? ''
                      : `rotate3d(${carousel.rotate.x}, ${carousel.rotate.y}, ${
                          carousel.rotate.z
                        }, ${rotateDeg}deg)`
                  }`,
                }}
              >
                {children.map((child, key) => {
                  const cell = cells[key]

                  if (!cells.length) {
                    return null
                  }

                  return (
                    <Motion
                      key={key}
                      style={{
                        translateX: spring(cell.translate.x),
                        translateY: spring(cell.translate.y),
                      }}
                    >
                      {({ translateX, translateY }) => {
                        return (
                          <div
                            className={styles.carouselCell}
                            style={{
                              transform: `${
                                is2dEffect
                                  ? ''
                                  : `rotate3d(${cell.rotate.x}, ${
                                      cell.rotate.y
                                    }, ${cell.rotate.z}, ${cell.rotate.deg}deg)`
                              }${`translate3d(${translateX}px,${translateY}px, ${
                                cell.translate.z
                              }px)`}`,
                              opacity: cell.opacity,
                              width,
                              height,
                              zIndex: cell.zIndex,
                            }}
                            onMouseDown={e => {
                              this.handleMouseDown(e)
                            }}
                            onClick={e => {
                              this.handleClick(e)
                            }}
                            onMouseMove={e => {
                              this.handleMouseMove(e)
                            }}
                            onMouseLeave={() => {
                              this.handleMouseUp()
                            }}
                            onMouseUp={() => {
                              this.handleMouseUp()
                            }}
                          >
                            {child}
                          </div>
                        )
                      }}
                    </Motion>
                  )
                })}
              </div>
            )
          }}
        </Motion>
      </div>
    )
  }
}
```

해당 컴포넌트의 경우 자식 요소를 감싸는 상위 요소와 각 자식 요소에 대한 두개의 `Motion` 컴포넌트를 활용했다. 자식 요소에 설정된 `Motion` 컴포넌트의 `2D` 효과의 애니메이션 설정 시 사용되며 상위 요소의 경우 `3d` 효과의 애니메이션 표현 시 사용하도록 구현되어있다.

각 요소에 대한 `CSS` 설정의 경우 `rotate3d`, `translate3d` 속성을 활용하였고, 자식요소에 설정된 이벤트 관련 함수를 통해 마우스의 움직임에 따라 애니메이션 효과가 반응하도록 설정했다.

<figure>
  <iframe src="https://codesandbox.io/embed/x7jv6oj8lo?codemirror=1&fontsize=14" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>
</figure>

지금까지 구현된 컴포넌트에 대한 샘플 코드이다. 아직 부족한 점도 많고 수정해야 할 부분도 많기 때문에 꾸준히 업데이트할 수 있도록 하자.

## Cube

두번째로 만들어 본 컴포넌트는 `Cube` 형태의 애니메이션 컴포넌트이다. 프로젝트를 진행하면서 특정 상품에 대한 여러 방향의 이미지를 화면에 표현하고 싶었다. 앞서 만든 `Carousel` 컴포넌트를 통해서도 상품 이미지에 대한 입체적인 표현이 가능했지만 `Cube` 형태의 애니메이션을 통해 좀 더 다양한 UX를 제공하고 싶었다.

```javascript
import React from 'react'
import Cube from './Cube'

class App extends React.Component {
  render() {
    const defaultStyle = {
      width: 300,
      height: 300,
      margin: '50px auto',
    }

    return (
      <div>
        <h1>Cube</h1>
        <div
          style={{
            ...defaultStyle,
          }}
        >
          <Cube size={300} index="front">
            <div>front</div>
            <div>right</div>
            <div>back</div>
            <div>left</div>
            <div>top</div>
            <div>bottom</div>
          </Cube>
        </div>
      </div>
    )
  }
}
```

`Cube` 컴포넌트의 경우 앞서 설정한 `Carousel` 컴포넌트보다는 좀 더 단순하다. 현재까지 구현된 내용의 경우 기본적으로 정육면체의 큐브형태의 UI를 제공하기 때문에 일정한 높이와 너비를 설정하기 위한 `size` 값을 props로 전달받도록 했다. 이 후에 높이와 너비를 다르게 설정해 줄 수 있도록 수정할 계획이다.

그리고 화면에 처음 표시될 영역에 대한 요소를 설정하기 위해 `index`라는 props를 활용했다. `front`, `right`, `back`, `left`, `top`, `bottom` 이라는 값을 통해 처음 표시될 영역에 대한 설정이 가능하도록 했다.

컴포넌트의 자식 요소 역시 순서대로 `front`, `right`, `back`, `left`, `top`, `bottom` 위치에 설정되면 최대 6개의 요소만이 추가될 수 있다. 자식 요소가 없는 경우 기본적으로 설정한 UI를 표시하도록 구현했다.

```javascript
import * as React from 'react'
import { Motion, spring } from 'react-motion'
// ...

class Cube extends React.Component<Props, State> {
  // ...

  render() {
    const { cube, faces, children } = this.state
    return (
      <div className={styles.cubeWrapper}>
        <Motion
          style={{
            rotateX: spring(cube.rotateX),
            rotateY: spring(cube.rotateY),
            rotateZ: spring(cube.rotateZ),
          }}
        >
          {({ rotateX, rotateY, rotateZ }) => {
            return (
              <div
                className={styles.cube}
                style={{
                  transform: `translate3d(${cube.translate.x}px, ${
                    cube.translate.y
                  }px, ${
                    cube.translate.z
                  }px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`,
                }}
              >
                {Object.keys(faces).map((face, key) => {
                  const { translate, rotate } = faces[face]

                  return (
                    <div
                      className={`${styles.cubeFace} ${styles[face]}`}
                      key={key}
                      style={{
                        transform: `translate3d(${translate.x}px, ${
                          translate.y
                        }px, ${translate.z}px) rotate3d(${rotate.x}, ${
                          rotate.y
                        }, ${rotate.z}, ${rotate.deg}deg)`,
                        width: cube.width,
                        height: cube.height,
                      }}
                      onMouseDown={e => {
                        this.handleMouseDown(e)
                      }}
                      onMouseMove={e => {
                        this.handleMouseMove(e)
                      }}
                      onMouseLeave={() => {
                        this.handleMouseUp()
                      }}
                      onMouseUp={() => {
                        this.handleMouseUp()
                      }}
                    >
                      {children[key]}
                    </div>
                  )
                })}
              </div>
            )
          }}
        </Motion>
      </div>
    )
  }
}
```

`Cube` 컴포넌트에서 `react-motion`을 활용한 부분이다. 앞서 설명한 `Carousel` 컴포넌트와는 달리 하나의 `Motion` 컴포넌트만을 활용한다. `CSS3` 에서 제공하는 `translate3d`, `rotate3d` 속성을 활용하였고, 큐브 형태의 요소를 감싸는 부모 요소에 설정된 이벤트를 통해 마우스의 움직임에 따라 애니메이션 효과를 나타낼 수 있도록 구현했다.

<figure>
  <iframe src="https://codesandbox.io/embed/x3l8xzv0w4?fontsize=14" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>
</figure>

지금까지 구현된 컴포넌트에 대한 샘플 코드이다. 앞서 구현한 `Carousel` 컴포넌트와 마찬가지로 필요한 기능은 계속 추가해줄 수 있도록 하자.

## Window

앞서 설명한 기능들 이외에도 여러가지 기능들을 제공하는 컴포넌트를 구현했지만 그 중에서도 가장 노력을 기울였던 `Window` 컴포넌트에 대한 내용을 정리하려고 한다.

이 또한 프로젝트를 진행하면서 브라우저 영역 내에서 새로운 레이어 팝업을 사용하기 위해 구현한 컴포넌트이다. 다만 기존에 사용했던 레이어 팝업과는 달리 `Windows 탐색기`와 같이 `최소/최대화` 및 `창 크기 조절`, 드래그 이벤트를 통한 `창 위치 변경` 과 같이 기능들을 제공하는 컴포넌트가 필요했다. 다만 위와 같은 기능들을 제공하는 컴포넌트의 경우 애니메이션을 활용하지 않더라도 충분히 구현할 수 있지만, 실제 데스크탑 환경에서 사용하는 윈도우 창과 같이 동적인 움직임을 표현해 줄 수 있도록 하고 싶었다.

```javascript
import React from 'react'
import Window from './Window'

class App extends React.Component {
  state = {
    window: {
      isOpen: false,
    },
  }

  render() {
    return (
      <div>
        <Window
          width={300}
          height={300}
          minWidth={300}
          minHeight={300}
          position="top"
          direction="top"
          titlebar={{
            use: true,
            height: 50,
            component: props => <Titie {...props} />,
          }}
          resize={true}
          open={this.state.window.isOpen}
          onClose={() => {
            this.setState({
              window: {
                isOpen: false,
              },
            })
          }}
        >
          window
        </Window>
      </div>
    )
  }
}
```

`Window` 컴포넌트를 사용하는 기본적인 코드이다. `width`, `height` props를 통해 컴포넌트 사이즈 및 `minWidth`, `minHeight` 값을 통해 최소 사이즈를 설정할 수 있다. `position`의 경우 화면 중심을 기준으로 컴포넌트 호출 시 최종적으로 나타나는 위치를 설정할 수 있으며 `direction`의 경우 컴포넌트 노출 시 해당 컴포넌트가 움직이는 뱡향을 설정해 줄 수 있다. `position`, `direction`의 경우 `top`, `bottom`, `left`, `right`라는 값을 통해 위치 및 방향을 설정할 수 있으며 `position`의 경우 `center` 값이 추가되어 화면 중심에 위치할 수 있다.

`titlebar` 옵션의 경우 상단 타이틀 영역에 대한 옵션으로, 타이틀바가 필요한 컴포넌트를 추가로 설정할 수 있도록 구현했다. `titlebar` 옵션 설정 시 객체타입으로 설정 가능하며, `component`라는 콜백 함수를 통해 해당 영역에 대한 UI를 추가적으로 설정해줄 수 있도록 했으며
콜백 함수 사용 시 전달받는 인자를 통해 상단 타이틀 영역에 필요한 여러가지 이벤트를 전달받을 수 있도록 했다.

`resize` 옵션의 경우 해당 컴포넌트의 크기를 변경 여부를 설정할 수 있으며, `open` props을 통해 해당 컴포넌트의 표시 여부를 설정할 수 있도록 구현했다. `onClose` 함수의 경우 해당 컴포넌트를 닫을 시 실행하는 콜백 함수 타입의 props로 구현했다.

```javascript
import { Motion, TransitionMotion, spring } from 'react-motion'
import * as React from 'react'
import Resizable from './Resizable'
import TitleBar from './TitleBar'
import Contents from './Contents'

// ...

class Window extends React.Component<Props, State> {
  // ...

  render() {
    // ...

    return (
      <Motion
        style={{
          left: spring(wrapper.isFull ? 0 : resizable.position.left),
          top: spring(wrapper.isFull ? 0 : resizable.position.top),
          width: spring(
            wrapper.isFull
              ? wrapper.width
              : wrapper.width + resizable.position.right
          ),
          height: spring(
            wrapper.isFull
              ? wrapper.height
              : wrapper.height + resizable.position.bottom
          ),
          wrapperTop: spring(wrapper.top),
          wrapperLeft: spring(wrapper.left),
        }}
      >
        {({ top, left, width, height, wrapperTop, wrapperLeft }) => {
          return (
            <div
              className={`${styles.windowWrapper}`}
              style={{
                top: wrapperTop,
                left: wrapperLeft,
                visibility: wrapper.show ? 'visible' : 'hidden',
                zIndex,
              }}
            >
              <Resizable
                width={resizeWidth}
                height={resizeHeight}
                cells={resizeCells}
                resize={resize}
                resizable={resizable}
                resizableMouseDown={this.resizableMouseDown}
                resizableMouseMove={this.resizableMouseMove}
                resizableMouseUp={this.resizableMouseUp}
                resizableDoubleClick={this.resizableDoubleClick}
              />
              <TransitionMotion
                willEnter={this.willEnter}
                willLeave={this.willLeave}
                didLeave={this.didLeave}
                styles={this.state.cells.map(
                  (cell: { top: number, left: number }, i) => {
                    const { top, left } = cell
                    return {
                      key: `${i}`,
                      style: {
                        top: spring(top),
                        left: spring(left),
                      },
                    }
                  }
                )}
              >
                {cells => (
                  <React.Fragment>
                    {cells.map(cell => {
                      return (
                        <div
                          key={cell.key}
                          className={styles.window}
                          style={{
                            top: cell.style.top + top,
                            left: cell.style.left + left,
                            width: width - left,
                            height: height - top,
                          }}
                        >
                          <TitleBar
                            titlebar={titlebar}
                            width={width - left}
                            isFulling={this.isFulling}
                            toggleWindowSize={this.toggleWindowSize}
                            handleMouseDown={this.handleMouseDown}
                            removeWindow={this.removeWindow}
                          />
                          <Contents
                            titlebar={titlebar}
                            width={width - left}
                            height={height - top}
                            children={children}
                          />
                        </div>
                      )
                    })}
                  </React.Fragment>
                )}
              </TransitionMotion>
            </div>
          )
        }}
      </Motion>
    )
  }
}
```

실제 구현한 코드 중 일부로서 렌더링 시 `react-motion`을 활용한 부분에 대한 코드이다. 앞서 정리한 컴포넌트의 경우 `Motion` 컴포넌트만을 활용했지만 현재 컴포넌트에서는 `Motion` 컴포넌트와 함께 `TransitionMotion` 컴포넌트를 활용했다.

`Motion` 컴포넌트의 경우 표시된 창 영역에 대하여 마우스 이벤트를 통한 `위치 이동`, `최소/최대화` 및 `크기 변경`과 같은 기능에 대한 애니메이션 효과를 표현할 수 있도록 하였으며, `TransitionMotion` 컴포넌트의 경우 `창 호출/닫기` 이벤트 요청 시 자신을 포함한 하위 컴포넌트에 대한 `mount/unmount` 처리를 `willEnter`, `willLeave`, `didLeave`와 같은 props를 통해 처리해주도록 했다.

<figure>
  <iframe src="https://codesandbox.io/embed/jv3nyzl8nw?fontsize=14" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>
</figure>

앞서 설명한 `Window` 컴포넌트를 사용한 간단한 예제 코드이다. 앞으로도 추가할 기능들이 많다고 생각하기 때문에 코드를 좀 더 개선할 수 있도록 해야겠다.

## 글을 마치며

`react-motion`을 활용하여 개발을 하다보니 우선 이 전에 많이 사용해보지 않았던 `CSS3 Animation`에 대해 많이 공부할 수 있었다. 그래서인지 애니메이션 효과를 나타내기 위한 과정이 생각보다 쉽지 않다는 것 또한 느꼈다. 당연한 얘기일 수도 있지만 기존 개발 과정보다 좀 더 수학적인 접근이 필요해서 더욱 힘들었던 것 같다.

그리고 앞서 정리한 써드파티 라이브러리의 경우 개인적으로 개발 공부를 하기 위해 일일 커밋 프로젝트였기 때문에 누군가가 많이 사용해주었으면 하는 바람보다는 스스로의 개발경험을 쌓고자 하는 목적으로 만들게 되었고, 무엇보다 짧은 시간동안 지금까지 개발해왔던 내용들을 급하게 글로 정리하려다 보니 구현된 컴포넌트의 내용과 포스팅한 내용 또한 남을 배려하지 않고 불친절한 글이 된 것 같다.

다만 앞서 정리한 프로젝트의 개발 또한 아직 마무리되지 않았기 때문에 시간이 날때마다 해당 포스팅을 꾸준히 업데이트할 수 있도록 해야할 것이다.
