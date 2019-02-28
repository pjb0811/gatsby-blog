---
title: react-dnd를 활용한 라이브러리 개발
date: '2019-02-25'
mainImage: './react-dnd.png'
tags: ['react', 'javascript']
---

> 이 글은 react 환경에서 `drag & drop` 효과를 쉽게 사용할 수 있도록 도와주는 `react-dnd`라는 라이브러리를 사용하면서 배웠던 내용들을 정리했다. 이번 글 역시 스스로의 학습 내용을 정리하는 글이기 때문에 편한 말투로 작성했다.<!-- end -->

우선 드래그 앤 드롭 이벤트의 경우 기본적으로 JavaScript에서 제공하는 인터페이스를 통해 해당 기능을 활용할 수 있지만 해당 기능을 활용하기 위해선 다소 복잡한 JavaScript 코드의 구현이 필요했다.

하지만 `HTML5`에서는 드래그 앤 드롭 기능이 표준 권고안에 포함되어 이 전에 JavaScript 만을 활용할때 보다 간단하게 사용할 수 있게 되었다(물론 이 과정에서도 JavaScript의 사용은 필요하다). 현재 사용되고 있는 대부분의 주요 브라우저들은 해당 기능을 제공하기 때문에 웹 페이지 내에 존재하는 요소에 대하여 드래그 앤 드롭 기능을 사용할 수 있는 환경이 되었다.

물론 react를 활용하는 경우에도 컴포넌트에서 기본적으로 제공하는 `onDrag` 관련 이벤트를 통해 드래그 앤 드롭 기능을 구현할 수 있다. 하지만 동일한 컴포넌트의 종속된 내부 컴포넌트에 대한 드래그 앤 드롭 이벤트가 아닌, 서로 다른 부모 컴포넌트를 가지는 자식 컴포넌트에 대한 드래그 앤 드롭 이벤트를 구현하기가 생각보다 쉽지 않았다.

그래서 이와 관련한 여러가지 라이브러리를 찾아보던 중 `react-dnd`라는 라이브러리를 찾게 되었고, 내가 원하고자 했던 기능뿐만 아니라 그와 관련된 다양한 기능을 제공하는 라이브러리라 판단되어 해당 라이브러리를 사용하게 되었다. 그럼 이제 `react-dnd`의 간단한 소개와 함께 실제 사용하면서 만들어 봤던 기능들에 대해 간단히 정리해보려 한다.

## react-dnd

앞서 설명한대로 `react-dnd` 는 특정 부모에 종속된 컴포넌트 구조와 상관없이 드래그 앤 드롭 관계로 연결된 컴포넌트 간의 이벤트를 제공해주는 기능을 제공하는 라이브러리이다. 다만 이러한 기능을 활용하기 위해서는 디자인 패턴과 관련된 개념을 익혀야 하며 나 역시 아직까지 해당 라이브러리를 제대로 사용하기 위한 모든 개념들을 전부 파악하진 못했다.

우선 앞서 설명한 특정 컴포넌트에 종속되지 않고 데이터를 처리하기 위한 패턴의 경우 이 전에 사용해왔던 `redux`의 개념과 유사하다. 실제로 `react-dnd` 라이브러리의 경우 내부적으로 `redux`를 사용하기 때문에 해당 라이브러리를 사용하기 위해서는 `redux`에 대한 개념을 어느정도 익히는 것이 필요하다.

또한 `react-dnd` 환경에서는 `HTML5`기반의 드래그 앤 드롭 기능을 활용하기 위한 플러그인이 제공하며 `react-dnd-html5-backend` 라는 플러그인을 통해 `HTML5 드래그 앤 드롭 API`를 기반으로 구축해야 한다(해당 API에는 선택사항으로 명시되어 있지만 실제 사용해보니 해당 플러그인의 사용이 필수적으로 요구된다). 그리고 해당 플러그인의 경우 `HTML5` 기반의 드래그 이벤트를 활용할 때와 같은 장/단점을 가지고 있다.

장점인 경우 앞서 언급한 내용처럼 복잡한 구조의 JavaScript 코드를 구현하지 않아도 기본적으로 브라우저에서 제공하는 기능을 통해 드래그되는 DOM 요소의 움직임을 표현할 수 있다. 다만 터치 스크린에서는 작동하지 않으며 낮은 버전의 IE 환경에서 사용할 수 없는 단점이 있다. 만약 모바일 환경의 서비스 또는 낮은 버전의 IE 환경에서의 서비스가 필요한 경우 해당 라이브러리의 사용을 고려해야봐 한다.

다만 해당 라이브러리를 통해 react 또는 그와 관련된 시멘틱 이벤트에 의존하지 않기 때문에 드래그 이벤트와 관련된 코드의 관리를 쉽게 할 수 있다. 그리고 이 과정은 `redux`를 활용한 패턴과 유사하다.

```javascript
// ...
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

class App extends Component {
  render() {
    return (
      <div>
        <DropBox />
        <DragItem />
      </div>
    )
  }
}

const rootElement = document.getElementById('root')
const DndApp = DragDropContext(HTML5Backend)(App)
ReactDOM.render(<DndApp />, rootElement)
```

기본적인 사용법은 `redux`를 사용할때와 마찬가지로 드래그 앤 드롭과 관련된 컴포넌트간의 연결을 위해 최상위 컴포넌트 영역에 대한 설정이 필요하다. `redux`이 경우 `Provider`라는 컴포넌트의 자식 요소로 앱을 랩핑했는데 `react-dnd`의 경우에는 `DragDropContext` 라는 `HoC`가 제공된다. 그리고 `HoC`의 인자로 `react-dnd-html5-backend` 플러그인을 설정해주면 된다.

이 후 `react-dnd`에서 제공하는 기능을 통해 드래그 앤 드롭 관련 컴포넌트에 추가적인 설정이 필요하다. 드래그 앤 드롭의 경우 드래그 되는 대상과 드롭되는 영역으로 컴포넌트를 구분할 수 있으며, 드래그 영역은 `DragSource`, 드롭 영역은 `DropTarget`이라는 `HoC`를 통해 사용하게 된다.

```javascript
import * as React from 'react'
import { DragSource } from 'react-dnd'

// ...

const boxSource = {
  beginDrag(props) {
    return {
      ...props,
    }
  },

  endDrag(props, monitor) {
    // ...
  },
}

class DragItem extends React.Component {
  render() {
    const { name, isDragging, connectDragSource } = this.props
    // ...
    return connectDragSource(<div>{name}</div>)
  }
}

export default DragSource('box', boxSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))(DragItem)
```

드래그 컴포넌트를 구현한 기본적인 코드이다. `DragSource`라는 `HoC`를 통해 드래그 컴포넌트에 추가적인 설정에 필요하다. 첫 번째 요소의 경우 드롭 컴포넌트와 연결하기 위한 문자열로써 같은 값을 가지는 드롭 컨테이너와 상호작용하게 된다. 두 번째 인자로 드래그 시 필요한 이벤트가 설정된 객체를 전달받으며 세번째 인자로 설정한 함수의 반환값을 통해 컴포넌트에 추가적인 props를 주입하게 된다. 이 후 주입된 props 중 하나인 `connectDragSource`라는 함수를 통해 렌더링 결과를 반환해야 한다.

```javascript
import React from 'react'
import { DropTarget } from 'react-dnd'

// ...

const boxTarget = {
  drop() {
    return {}
  },
}

class DropBox extends React.Component {
  render() {
    const { canDrop, isOver, connectDropTarget } = this.props
    const isActive = canDrop && isOver

    return connectDropTarget(
      <div>{isActive ? 'Release to drop' : 'Drag a box here'}</div>
    )
  }
}

export default DropTarget('box', boxTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop(),
}))(DropBox)
```

드롭 컴포넌트를 구현한 기본적인 코드이다. 드래그 컴포넌트와 마찬가지로 `DropTarget`이라는 `HoC`를 통해 컴포넌트에 추가적인 인자 설정이 필요하다. 첫 번째 인자는 드래그 컴포넌트와 같은 문자열을 설정하며 두번째 인자로 드롭 관련 객체를 전달받는다. 마지막 세번째 인자로 함수의 반환값을 통해 컴포넌트에 추가적인 props를 주입하게 된다. 드롭 컨테이너의 경우 `boxTarget` 객체에 설정된 `drop` 메소드를 통해 드래그 컨테이너에 드롭 컨테이너 정보를 전달할 수 있다.

<figure>
  <iframe src="https://codesandbox.io/embed/zkkx7nvrnl?fontsize=14" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>
</figure>

위 코드를 활용한 기본적인 드래그 앤 드롭 예제이다. 드래그 컨테이너의 설정된 이벤트를 통해 드롭 컨테이너 영역으로 이동 시 각 컴포넌트의 정보를 `alert`으로 표시하도록 하고 있다.

그럼 이제 `react-dnd`의 간단한 소개 및 사용법을 마치며 해당 라이브러리를 활용하여 만들었던 개인적인 써드파티 라이브러리의 내용들을 정리하려한다. 기본 소개 및 자세한 사용법의 경우 해당 라이브러리의 `API`에 잘 정리되어 있으니 필요한 경우 찾아볼 수 있도록 하자.

## Multiple List

<figure>
  <iframe src="https://codesandbox.io/embed/ll724prxrq?fontsize=14" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>
</figure>

## Native Files

<figure>
  <iframe src="https://codesandbox.io/embed/6j6x9jp183?fontsize=14" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>
</figure>

## 글을 마치며
