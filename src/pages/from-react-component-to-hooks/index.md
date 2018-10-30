---
title: React.Component에서 hooks로
date: '2018-10-29'
mainImage: './react-hooks.jpg'
tags: ['javascript', 'react']
translation: {
  title: 'From React.Component to hooks',
  link: 'https://medium.com/@dispix/from-react-component-to-hooks-b50241334365'
}
---

아주 최근에, React 는 다가오는 **[16.7 버전에 대한 계획을 발표했습니다.](https://reactjs.org/docs/hooks-intro.html)**. 이번 발표는 Stateless 한 기능의 컴포넌트(SFC)를 중심으로 새로운 접근 방식을 추진하기 때문에 상당히 방대합니다.

그것을 사용하기 위해 새로운 버전의 라이브러는는 "후크 (hooks)"라고 부르는 것을 제공합니다. 이 도구는 개발자가 상태를 저장하고, side effect 를 처리하며, 훨씬 더 많은 SFC 내부를 처리 할 수있게 해주는 도구입니다.

이 접근 방식이 분명히 (필자의 의견으로는) React 에 대한 개선과 큰 진전이 있지만, 처음에는 hooks 를 이해하기 어려울 수 있기 때문에 개발자가 그것을 채택하는 것은 상당히 어려울 수 있습니다. 다행히도이 기사의 끝 부분에서는 후크에 대해 더 잘 이해하고 이를 활용할 수있는 방법을 모색하게 될 것입니다.

## hooks 작동 방식

작동 방식을 이해하기 위해 알아야 할 가장 큰 것은 hooks 가 구성 요소를 장착할 때 React 에 의해 **순서**대로 나열되고 업데이트 시 **동일한 순서**로 처리된다는 점입니다. 순서 부분은 여기서 중요한 부분이며, 그것이 무엇을 의미할까요?

사용자 ID 를 가져와서 프로필을 가져와서 이름을 사용하여 해당 사용자에게 인사하는 간단한 구성 요소가 있다고 가정해 보겠습니다.

![simple user-greeting component](./simple-user-greeting-component.png)

React 는 이 구성 요소를 처음으로 렌더링할 때(즉, 구성 요소의 mounting 이 발생할 때) React hook 의 각 호출을 연속적으로 등록합니다. 즉, 다음과 같은 기능을 합니다.

- _"초기 값이 `true` 인 새로운 상태를 만들 것입니다."_
- _"초기 값이 `null` 인 새로운 상태를 만들 것입니다."_
- _"초기 값이 `null` 인 새로운 상태를 만들 것입니다"_(이전 값과 다름).
- _"effect 를 만들고 즉시 그것을 호출할 것입니다."_ (프로세스 `userId` 가 동일하게 유지되는 한 이 effect 는 다시 생성되지 않습니다.)

이제 `fetch` function 이 일부 데이터를 반환하고 `setLoading` 및 `setUser` function 을 호출한다고 가정하겠습니다. 이러한 function 은 우리가 만든 첫 번째 및 두 번째 상태를 업데이트하고 구성 요소의 re-rendering 을 트리거합니다. 즉, 전체 코드를 다시 살펴본 후 React 는 다른 작업을 수행합니다.

- _"이 구성 요소에 대한 첫 번째 상태가 있으며 그 값은 `false` 입니다. 새 값을 만드는 대신 값을 돌려 줄 것입니다."_
- _"이 구성 요소에 대한 두 번째 상태가 있으며 그 값은 [API 가 보낸 모든 것]이며, 새 값을 만드는 대신 되돌려줍니다."_
- _"이 구성 요소에 대한 세 번째 상태가 있으며 그 값은 여전히 `false` 입니다. 새 값을 만드는 대신 다시 값을 주겠습니다."_
- _"이미 이 effect 를 등록했는데 props `userId` 가 변경되지 않았으므로 다시 호출할 필요가 없습니다."_

React 는 hooks 에 대한 모든 호출을 등록함으로써 "state"를 내부적으로 저장하고 필요한 정보를 제공할 수 있습니다. 우리는 **React hooks 의 두 가지 규칙을 존중**하기 때문에 그렇게 할 수 있습니다.

- React 구성 요소 외부에 있는 hooks 를 호출할 수 없습니다(분명히 렌더링 단계에서 React 에 의해 처리되어야 하기 때문에 render function 에 넣어야 하며, 이 경우 SFC 에 해당합니다).

- hooks 의 순서와 목록은 변경할 수 없습니다. 구성 요소의 두 번째 `useState`를 제거한다고 가정해 보겠습니다. React 는 첫번째 것을 보고, 그것을 위해 저장한 상태를 돌려주고, 다른 것을 보지만 세 번째는 보지 않습니다. 어느 것이 사라졌는지 알 수 없고 실수를 저지를 것이다.

## lifecycle 방식에서 hooks 로 마이그레이션

### componentDidMount 에서 useMount 까지

`componentDidMount` 메서드는 일반적으로 구성 요소가 마운트될 때 한 번 side effect 가 트리거되는 방법입니다.

동등한 hook 는 SFC 가 처음으로 호출될 때 side effect 가 발생하며 이후 호출을 중단한다. 이를 위해 사용할 수 있는 hook 는 `useEffect` 라고 합니다. 기본적으로 구성 요소를 마운트 및 업데이트할 때마다 호출됩니다. 설명서를 자세히 살펴보면 일련의 값을 두 번째 인수로 전달하여 "memoized"할 수 있음을 알 수 있습니다. 또한 빈 배열을 통과하는 것은 React 에게 한 번 더 요청한 후 **다시는 요청하지 않습니다.** 빈 배열은 "이 기능이 변경될 때 오래된 결과를 가져올 값은 없습니다."라고 말하는 것과 같습니다. 따라서 `componentDidUpdate` 구현은 다음과 같습니다.

```javascript
import { useEffect } from 'react'

function useMount(fn) {
  useEffect(() => void fn(), [])
}
```

이 기능을 `void`로 호출함으로써, 우리는 hook 이 `undefined`를 반환하는것을 확인합니다(`componentWillUnmount`를 모방하려고 할 때 왜 중요한지 알 수 있습니다. 빈 배열을 전달하기 때문에, React 는 효과를 한 번 적용하고 메모 프로세스에서 값이 관찰되지 않으므로 결코 업데이트하지 않습니다). 따라서 구성 요소가 mount 될 때 호출됩니다.

## componentWillUnmount 에서 useUnmount 로

`componentWillUnmount` 메소드는 side effect 를 유발하는데도 사용되지만 이번에는 컴포넌트가 마운트 해제 될 때 사용됩니다. 예를 들어 이벤트 리스너를 만들고 삭제하는 것과 같이 `componentDidMount` 와 함께 사용하는 경우는 일반적이지 않습니다.

이전 장에서 보았 듯이 빈 값 배열을 전달하여 모든 렌더링에서 후크가 발생하지 않도록 할 수 있습니다. 그렇게함으로써 우리는 한번 마운트 한 다음 한번도 호출하지 말라고합니다. 하지만 마운트 시간에 한 번 요청하지 않고 마운트 해제 시간에 요청을 하면 어떨까요? `useEffect`의 문서에는 `useEffect` 후크에 의해 호출 된 함수에 의해 반환된 모든 기능이 구성 요소가 마운트 해제될 때 호출됩니다.

```javascript
import { useEffect } from 'react'

function useUnmount(fn) {
  useEffect(() => fn, [])
}
```

arrow function 을 호출하면 아무것도 하지 않고 React 가 컴포넌트를 마운트 해제 할 때 호출 할 함수에 대한 참조를 반환합니다. 다시 한번, 빈 배열을 전달하면 모든 렌더링에 대해 함수를 반복적으로 호출하지 않게 됩니다.(어쨌든 아무것도 하지 않기 때문에 자원 낭비가 될 수 있습니다.)

## componentDidUpdate 에서 useUpdate 까지

마지막으로 우리는 `componentDidUpdate` 의 동작을 모방하고 싶습니다. 이 동작은 **처음의 렌더링을 제외한** 모든 렌더링에서 호출됩니다.

이전 예제에서 `useEffect`는 특정 조건에서 통과 한 함수를 호출하도록 지시하는 두 번째 매개 변수를 사용합니다. 이 인수를 전달하지 않음으로써 우리는 React 에게 _"아무 것도 렌더링에서 이 효과가 호출되지 않도록 해야합니다"_ 라고 전합니다.
