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

해당 라이브러리를 통해 장바구니 기능과 같이 특정 목록 영역에 구현된 아이템을 다른 영역의 목록으로 드래그하여 옮길 수 있는 기능을 구현하고 싶었다. 우선 `react-dnd` 에서 제공하는 예제들을 통해 관련된 기능들을 확인해 봤는데 이와 관련된 기능들은 확인할 수 없었다.
그래서 관련된 내용을 구글링하였고 이와 관련된 포스트를 발견하였고 해당 [포스트](https://rafaelquintanilha.com/sortable-targets-with-react-dnd/)를 참고하여 내가 필요로 하는 기능들이 추가된 컴포넌트를 개발하였다.

[`react-beautiful-dnd`](https://github.com/atlassian/react-beautiful-dnd)이라는 라이브러리의 경우 멀티플 리스트 및 애니메이션 효과를 가지는 드래그 앤 드롭과 관련된 여러가지 기능을 제공하고 있어 해당 라이브러리를 사용해도 되지만 리스트 구현 수직 또는 수평 구조의 리스트의 기능만 제공하여 내가 원하는 그리드 형태의 목록을 제공하지 않았기 때문에 직접 그리드 형태의 멀티플 리스트에서 드래그 앤 드롭 기능을 제공할 수 있는 컴포넌트를 구현했다.

```javascript
import React, { Component } from 'react'
import List from './List'
import { DragDropContext } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

class App extends Component {
  render() {
    // ...

    return (
      <div>
        <List
          name={'test1'}
          id={1}
          width={50}
          height={50}
          rows={3}
          style={{
            background: 'yellow',
            margin: '0 0 20px',
          }}
          activeStyle={{
            background: 'red',
          }}
          onChange={state => {}}
        >
          <div>1</div>
          <div>2</div>
          <div>3</div>
        </List>

        <List
          name={'test1'}
          id={2}
          width={50}
          height={50}
          rows={3}
          style={{
            background: 'orange',
          }}
          activeStyle={{
            background: 'blue',
          }}
        >
          <div>4</div>
          <div>5</div>
          <div>6</div>
        </List>
      </div>
    )
  }
}

export default DragDropContext(HTML5Backend)(App)
```

여러개의 리스트의 포함된 아이템들을 드래그할 수 있도록 구현한 `List` 컴포넌트의 사용법을 정리한 코드이다. `name` 이라는 props를 통해 여러개의 리스트가 같은 아이템을 포함할 수 있도록 설정해 줄 수 있다. 해당 타입은 문자열로 구분하며 같은 `name`의 인자를 전달받는 컴포넌트의 자식 요소를 공유할 수 있도록 했다. 다만 같은 `name`으로 설정된 컴포넌트의 경우 `id`라는 props를 통해 고유의 값을 지정해야한다.

`rows` 의 경우 목록의 열의 개수를 지정할 수 있다. 기본값은 1열로 구성된 목록이며 `rows` 설정에 따라 수직, 수평 이동 가능한 목록을 구성할 수 있도록 했다. 또한 `style` 및 `activeStyle` props를 통해 기본 스타일과 드래그 활성화 시 목록의 스타일을 지정할 수 있는 기능을 구현했다.

- `List.tsx`

```javascript
import * as React from 'react'
import Item from './Item'
import { DropTarget } from 'react-dnd'

type Props = {
  id: string | number,
  name: string | number,
  width: number,
  height: number,
  rows: number,
  style: any,
  activeStyle: any,
  canDrop: boolean,
  isOver: boolean,
  connectDropTarget: any,
  onChange: (state: State) => void,
}

const itemTarget = {
  drop(props: any, monitor: any, component: any) {
    const { id, name } = props
    const sourceObj = monitor.getItem()

    if (name === sourceObj.listName && id !== sourceObj.listId) {
      component.pushItem(sourceObj.item)
    }

    return {
      listId: id,
      listName: name,
    }
  },
}

@DropTarget('ITEM', itemTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop(),
}))
class Container extends React.Component<Props, State> {
  state = {
    list: [],
  }

  componentDidMount() {
    const { id, children } = this.props
    const newChildren = Array.isArray(children)
      ? [...children]
      : children
      ? [children]
      : []

    this.setState({
      list: newChildren.map((child, i) => {
        return {
          id: `${id}${i}`,
          child,
        }
      }),
    })
  }

  pushItem = (item: never) => {
    const { onChange = () => {} } = this.props
    const list = this.state.list.concat()
    list.push(item)

    this.setState(
      {
        list,
      },
      () => {
        onChange(this.state)
      }
    )
  }

  removeItem = (index: number) => {
    const { onChange = () => {} } = this.props
    let list = this.state.list.concat()
    list.splice(index, 1)

    this.setState(
      {
        list,
      },
      () => {
        onChange(this.state)
      }
    )
  }

  moveItem = (dragIndex: number, hoverIndex: number) => {
    let list = this.state.list.concat()
    const dragItem = list[dragIndex]
    const { onChange = () => {} } = this.props

    list.splice(dragIndex, 1)
    list.splice(hoverIndex, 0, dragItem)

    this.setState(
      {
        list,
      },
      () => {
        onChange(this.state)
      }
    )
  }

  render() {
    const {
      width = 200,
      height = 200,
      rows = 1,
      style,
      activeStyle,
      canDrop,
      isOver,
      connectDropTarget,
    } = this.props
    const { list } = this.state
    const isActive = canDrop && isOver
    const listStyle = isActive ? activeStyle : style

    return connectDropTarget(
      <div
        style={{
          ...listStyle,
          display: 'flex',
          width: width * rows,
          height: list.length ? height * Math.ceil(list.length / rows) : height,
          minHeight: height,
          overflow: 'auto',
          flexWrap: 'wrap',
        }}
      >
        {list.map((item: { id: number }, i) => {
          return (
            <Item
              key={item.id}
              index={i}
              item={item}
              listId={this.props.id}
              listName={this.props.name}
              removeItem={this.removeItem}
              moveItem={this.moveItem}
            />
          )
        })}
      </div>
    )
  }
}

export default Container
```

앞서 설명한 `List` 컴포넌트를 구현한 코드이다. 우선 드롭 영역으로 설정하기 위한 `DropTarget` 고차함수를 `decorator` 문법을 통해 설정하도록 했다. `DropTarget` 설정 시 인수로 전달받는 `itemTarget` 객체에 설정된 `drop` 함수를 통해 다른 목록으로부터 드래그 된 아이템 요소를 감자하여 현재 목록에 추가해줄 수 있도록 설정했다. 이 후 마운트 시 각 아이템 요소의 기본키를 props로 전달받은 `id`를 통해 설정해주도록 했다. 목록 내 컴포넌트 드래그 시에는 `pushItem`, `removeItem`, `moveItem` 함수를 통해 컴포넌트 내부 요소의 드래그 이벤트를 처리하거나 함수를 인자로 전달하도록 구현했다.

- `Item.tsx`

```javascript
import * as React from 'react';
import {
  DragSource,
  DropTarget,
  ConnectDragSource,
  ConnectDropTarget,
  DropTargetMonitor,
  DragSourceMonitor
} from 'react-dnd';
import { findDOMNode } from 'react-dom';
import { XYCoord } from 'dnd-core';

type Props = {
  index: number;
  listId: string | number;
  listName: string | number;
  item: any;
  style: any;
  isDragging?: boolean;
  connectDragSource?: ConnectDragSource;
  connectDropTarget?: ConnectDropTarget;
  removeItem: (index: number) => void;
  moveItem: (dragIndex: number, hoverIndex: number) => void;
};

const itemTarget = {
  hover(props: Props, monitor: DropTargetMonitor, component: Element) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;
    const sourceListId = monitor.getItem().listId;
    const sourceListName = monitor.getItem().listName;

    if (dragIndex === hoverIndex) {
      return;
    }

    const hoverBoundingRect = (findDOMNode(
      component
    ) as Element).getBoundingClientRect();
    const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
    const clientOffset = monitor.getClientOffset();
    const hoverClientX = (clientOffset as XYCoord).x - hoverBoundingRect.left;
    const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

    if (dragIndex < hoverIndex) {
      if (hoverClientX < hoverMiddleX / 2 || hoverClientY < hoverMiddleY / 2) {
        return;
      }
    }

    if (dragIndex > hoverIndex) {
      if (hoverClientX > hoverMiddleX || hoverClientY > hoverMiddleY) {
        return;
      }
    }

    if (props.listName === sourceListName && props.listId === sourceListId) {
      props.moveItem(dragIndex, hoverIndex);
      monitor.getItem().index = hoverIndex;
    }
  }
};

const itemSource = {
  beginDrag(props: Props) {
    return {
      index: props.index,
      listId: props.listId,
      listName: props.listName,
      item: props.item
    };
  },

  endDrag(props: Props, monitor: DragSourceMonitor) {
    const item = monitor.getItem();
    const dropResult = monitor.getDropResult();

    if (
      dropResult &&
      dropResult.listName === item.listName &&
      dropResult.listId !== item.listId
    ) {
      props.removeItem(item.index);
    }
  }
};

@DropTarget('ITEM', itemTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))
@DragSource('ITEM', itemSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
class Item extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const {
      item,
      isDragging,
      connectDragSource,
      connectDropTarget
    } = this.props;
    const opacity = isDragging ? 0 : 1;

    return (
      connectDragSource &&
      connectDropTarget &&
      connectDragSource(
        connectDropTarget(
          <div style={{ opacity, position: 'relative' }}>{item.child}</div>
        )
      )
    );
  }
}

export default Item;
```

목록 내 요소에 대한 `Item` 컴포넌트를 구현한 코드이다. 해당 컴포넌트의 경우 드래그 및 드롭 이벤트를 처리하기 위해 `DragSource`와 `DropTarget` 고차함수를 설정했다. `DragSource`의 경우 아이템 드래그 시 목록에서 해당 아이템을 제거하는 기능을 처리하면 `DropTarget`의 경우 현재 드래그하는 요소의 위치에 따라 목록 내 요소의 위치를 변경하도록 구현했다.

<figure>
  <iframe src="https://codesandbox.io/embed/ll724prxrq?fontsize=14" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>
</figure>

앞서 구현한 `List`, `Item` 컴포넌트를 활용한 간단한 예제 코드이다. 두개의 리스트로 구성되어 있으며 리스트에 포함된 요소들의 대하여 서로 다른
목록으로 드래그할 수 있도록 구현되어 있다. 현재 컴포넌트 드래그 시 목록 내 요소들이 이동하는 경우 별다른 애니메이션 효과가 추가되어 있지 않아 `react-motion`을 활용하여 애니메이션 효과를 나타낼 수 있도록 추가 기능을 구현 중인데 목록 내 요소가 많을 경우 퍼포먼스에 문제가 있어 해결 방법을 찾고 있는 중이다. 빠른 시일내에 해당 문제를 해결할 수 있도록 하자.

## Native Files

두 번째로 만들어본 컴포넌트는 데스크탑의 파일을 브라우저 영역으로 드래그 앤 드롭해주는 간단한 컴포넌트이다. 해당 기능의 경우 `react-dnd`에서 기본적으로 제공하는 기능으로 특별히 추가해 줄 기능은 없지만 파일을 드롭한 이후 드롭된 파일 요소를 삭제하는 기능이 없어 해당 기능을 추가한 컴포넌트를 구현했다.

```javascript
import React from 'react'
import NativeFiles from './NativeFiles'
import { DragDropContext } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import FileList from './FileList'

class App extends React.Component {
  render() {
    return (
      <NativeFiles>
        {({ files, canDrop, isOver, removeFiles }) => {
          return (
            <FileList
              files={files}
              canDrop={canDrop}
              isOver={isOver}
              removeFile={removeFiles}
            />
          )
        }}
      </NativeFiles>
    )
  }
}

export default DragDropContext(HTML5Backend)(App)
```

네이티브 파일 영역에 대한 드래그 앤 드롭 컴포넌트를 사용하기 위한 기본적인 예제 코드이다. 컴포넌트 사용 시 따로 설정해주는 props를 없지만 하위 요소의 경우 `Function as Child` 컴포넌트로 반환되며 해당 함수의 인자를 통해 드래그 및 드롭과 관련된 이벤트를 전달받을 수 있도록 구현했다. `files`을 통해 드롭된 파일 객체 정보를 확인 가능하며, `canDrop`, `isOver` 값을 통해 파일의 드래그 상태를 확인할 수 있다. `removeFile`의 경우 함수 타입의 인자로서 실행 시 현재 드롭된 파일 목록을 초기화해 줄 수 있다.

- `NativeFiles.tsx`

```javascript
import * as React from 'react'
import { DropTargetMonitor } from 'react-dnd'
import { NativeTypes } from 'react-dnd-html5-backend'
import TargetBox from './TargetBox'

type Props = {
  children: (props: any) => JSX.Element,
}

type State = {
  files: any[],
}

class Container extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { files: [] }
  }

  render() {
    const { FILE } = NativeTypes
    const { children } = this.props
    const { files } = this.state

    return (
      <TargetBox
        accepts={[FILE]}
        files={files}
        onDrop={this.handleFileDrop}
        children={children}
        removeFiles={this.removeFiles}
      />
    )
  }

  handleFileDrop = (_item: any, monitor: DropTargetMonitor) => {
    if (monitor) {
      const files = monitor.getItem().files
      this.setState({ files })
    }
  }

  removeFiles = () => {
    this.setState({
      files: [],
    })
  }
}

export default Container
```

앞서 사용한 `NativeFiles` 컴포넌트의 구현한 내용이다. 네이티브 파일에 대한 정보를 컴포넌트의 state 로 설정한 뒤 `TargetBox` 컴포넌트의 전달해주도록 했다. 파일 드롭 및 제거 함수 또한 props로 전달하여 함수 실행 시 현재 컴포넌트의 state에 설정된 파일 정보를 업데이트 할 수 있도록 구현했다.

- `TargetBox.tsx`

```javascript
import * as React from 'react'
import {
  DropTarget,
  DropTargetConnector,
  ConnectDropTarget,
  DropTargetMonitor,
} from 'react-dnd'

const boxTarget = {
  drop(props: Props, monitor: DropTargetMonitor) {
    if (props.onDrop) {
      props.onDrop(props, monitor)
    }
  },
}

type Props = {
  accepts: string[],
  connectDropTarget?: ConnectDropTarget,
  isOver?: boolean,
  canDrop?: boolean,
  onDrop: (props: Props, monitor: DropTargetMonitor) => void,
  files: any[],
  children: (props: any) => JSX.Element,
  removeFiles: () => void,
}

@DropTarget(
  (props: Props) => props.accepts,
  boxTarget,
  (connect: DropTargetConnector, monitor: DropTargetMonitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
  })
)
class TargetBox extends React.Component<Props> {
  render() {
    const {
      canDrop,
      isOver,
      connectDropTarget,
      files,
      children,
      removeFiles,
    } = this.props

    return (
      connectDropTarget &&
      connectDropTarget(
        <div>{children({ canDrop, isOver, files, removeFiles })}</div>
      )
    )
  }
}

export default TargetBox
```

`NativeFiles`에서 전달받은 props를 사용자가 구현한 컴포넌트에 전달하게 해주는 `TargetBox` 컴포넌트를 구현한 코드이다. 렌더링 시 `DropTarget` 고차함수를 통해 사용자로부터 전달받은 컴포넌트의 파일 정보를 주입한 뒤 반환하도록 구현했다.

<figure>
  <iframe src="https://codesandbox.io/embed/6j6x9jp183?fontsize=14" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>
</figure>

앞서 구현한 컴포넌트를 활용한 예제 코드이며 드롭된 파일명을 화면에 표시하며 해당 파일 목록을 초기화 시키는 버튼으로 구성된 컴포넌트를 구성되어 있다.

## 글을 마치며

`react-dnd`라는 라이브러리를 통해 내가 필요로 했던 몇가지 컴포넌트를 새로 만들어 본 내용들을 정리해봤는데 막상 글로 정리하려고 하니 잘 되지 않는 것 같다. 해당 컴포넌트들을 구현하고 나서 바로 글을 작성했다면 좀 더 좋았을 것 같은데 시간이 지나고나서 이 전에 만들었던 개발 내용들을 정리하려보니 생각보다 정리하는게 쉽지 않다고 느껴진다. 사실 앞으로 구상 중인 개인적인 프로젝트를 진행하기 위해 코드를 짜고 있는데, 그 전에 블로그를 시작하면서 이 전에 해왔던 것들을 기록해야겠다는 생각때문인지 시간에 쫓기면서 글을 쓴거 같기도 하다. 그래도 최근에 블로그를 시작하면서부터 그 동안 공부했던 내용들을 글로 정리하지 못한 내용들이 많았기 때문에 앞으로 시간이 난다면 꾸준히 글을 정리할 수 있도록 하자.
