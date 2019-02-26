---
title: React.Component에서 hooks로
date: '2018-10-29'
mainImage: './react-hooks.jpg'
tags: ['react']
translation: {
  title: 'From React.Component to hooks',
  link: 'https://medium.com/@dispix/from-react-component-to-hooks-b50241334365'
}
---

아주 최근에, React 는 다가오는 **[16.7 버전에 대한 계획을 발표했습니다](https://reactjs.org/docs/hooks-intro.html)**. 이번 발표는 상태가 없는 함수형 컴포넌트(SFC)를 중심으로 새로운 접근 방식을 추진하기 때문에 상당히 방대합니다.

그것을 사용하기 위해 새로운 버전의 라이브러리는 "후크 (hooks)"라고 부르는 것을 제공합니다. 이 도구는 개발자가 상태를 저장하고, side effect 를 처리하며, 훨씬 더 많은 SFC 내부를 처리 할 수있게 해주는 도구입니다.

이 접근 방식이 분명히 (필자의 의견으로는) React 에 대한 개선과 큰 진전이 있지만, 처음에는 후크를 이해하기 어려울 수 있기 때문에 개발자가 그것을 채택하는 것은 상당히 어려울 수 있습니다. 다행히도 이 기사의 끝 부분에서는 후크에 대해 더 잘 이해하고 이를 활용할 수있는 방법을 모색하게 될 것입니다.

## hooks 작동 방식

그들이 작동하는 방법을 이해하는 가장 큰 방법은 다음과 같습니다. 후크는 컴포넌트를 마운트 할 때 React 가 **순서**대로 나열한 다음, 컴포넌트를 업데이트 할 때 **동일한 순서**로 처리됩니다. 순서 부분은 여기서 중요한 부분이며, 그것이 무엇을 의미할까요?

사용자 ID 를 가져와서 프로필을 가져와서 이름을 사용하여 해당 사용자에게 인사하는 간단한 컴포넌트가 있다고 가정해 보겠습니다.

<figure>
  <img src="./simple-user-greeting-component.png" alt="my alt text"/>
  <figcaption>간단한 사용자 인사말 컴포넌트</figcaption>
</figure>

React 는 이 컴포넌트를 처음으로 렌더링할 때(즉, 컴포넌트가 _마운트_ 될 때) React hook 의 각 호출을 연속적으로 등록합니다. 즉, 다음과 같은 기능을 합니다.

- _"초기 값이 `true` 인 새로운 상태를 만들 것입니다."_
- _"초기 값이 `null` 인 새로운 상태를 만들 것입니다."_
- _"초기 값이 `null` 인 새로운 상태를 만들 것입니다"_(이전 값과 다름).
- _"effect 를 만들고 즉시 호출할 것입니다."_ (프로세스 `userId` 가 동일하게 유지되는 한 이 effect 는 다시 생성되지 않습니다.)

이제 `fetch` function 이 일부 데이터를 반환하고 `setLoading` 및 `setUser` function 을 호출한다고 가정하겠습니다. 이러한 function 은 우리가 만든 첫 번째 및 두 번째 상태를 업데이트하고 컴포넌트의 re-rendering 을 트리거합니다. 즉, 전체 코드를 다시 살펴본 후 React 는 다른 작업을 수행합니다.

- _"이 컴포넌트에 대한 첫 번째 상태가 있으며 그 값은 `false` 입니다. 새 값을 만드는 대신 값을 돌려 줄 것입니다."_
- _"이 컴포넌트에 대한 두 번째 상태가 있으며 그 값은 [API 가 보낸 모든 것]이며, 새 값을 만드는 대신 되돌려줍니다."_
- _"이 컴포넌트에 대한 세 번째 상태가 있으며 그 값은 여전히 `false` 입니다. 새 값을 만드는 대신 다시 값을 주겠습니다."_
- _"이미 이 effect 를 등록했는데 props `userId` 가 변경되지 않았으므로 다시 호출할 필요가 없습니다."_

React 는 후크에 대한 모든 호출을 등록함으로써 "상태"를 내부적으로 저장하고 필요한 정보를 제공할 수 있습니다. 우리는 **React hooks 의 두 가지 규칙을 존중**하기 때문에 그렇게 할 수 있습니다.

- 우리는 React 컴포넌트 외부에서 후크를 호출 할 수 없습니다(렌더링 단계 중 React 가 처리해야하므로 렌더링 함수 또는 이 경우에는 SFC 에 넣어야 함).

- **후크의 순서와 목록을 변경할 수는 없습니다**. 컴포넌트의 두 번째 `useState`를 제거한다고 가정해 보겠습니다. React 는 첫 번째 것을보고, 그걸 저장 한 상태로 되돌리고, 세 번째가 아닌 다른 것을 봅니다. 어느 것이 사라 졌는지 알 수 없으며 오류가 발생합니다.

## lifecycle 방식에서 hooks 로 마이그레이션

### componentDidMount 에서 useMount 까지

`componentDidMount` 메서드는 일반적으로 컴포넌트가 마운트될 때 side effect 를 유발하는 방법입니다.

해당 후크는 SFC 가 처음으로 호출 될 때 side effect 을 유발하고 그 후에 호출되는 것을 중지하는 무언가 일 것입니다. 이를 위해 사용할 수 있는 hook 는 `useEffect` 라고 합니다. 기본적으로 컴포넌트를 마운트 및 업데이트할 때마다 호출됩니다. 문서를 자세히 살펴보면 배열을 두 번째 인수로 전달하여 "메모가 가능"하다는 것을 알 수 있습니다. 또한 빈 배열을 전달하면 React 에게 **한 번만 호출하면됩니다**. 빈 배열은 "이 함수 결과가 변경 될 때 구형이 될 값이 없다"는 것과 같습니다. 따라서 `componentDidUpdate` 구현은 다음과 같습니다.

```javascript
import { useEffect } from 'react'

function useMount(fn) {
  useEffect(() => void fn(), [])
}
```

function 을 `void`로 호출함으로써, 우리는 hook 이 `undefined`를 반환하는것을 확인합니다(`componentWillUnmount`를 모방하려고 할 때 왜 중요한지 알 수 있습니다. 빈 배열을 전달하기 때문에, React 는 효과를 한 번 적용하고 메모 프로세스에서 값이 관찰되지 않으므로 결코 업데이트하지 않습니다). 따라서 컴포넌트가 mount 될 때 호출됩니다.

### componentWillUnmount 에서 useUnmount 로

`componentWillUnmount` 메소드는 side effect 를 유발하는데도 사용되지만 이번에는 컴포넌트가 마운트 해제 될 때 사용됩니다. 예를 들어 이벤트 리스너를 만들고 삭제하는 것과 같이 `componentDidMount` 와 함께 사용하는 경우는 일반적이지 않습니다.

이전 장에서 보았 듯이 빈 값 배열을 전달하여 모든 렌더링에서 후크가 발생하지 않도록 할 수 있습니다. 그렇게 함으로써 우리는 한번 마운트 한 다음 한번도 호출하지 말라고 합니다. 하지만 마운트 시 요청하지 않고 마운트 해제 시 요청을 하면 어떨까요? `useEffect`의 문서에는 `useEffect` 후크에 의해 호출 된 함수에 의해 반환된 모든 기능이 컴포넌트가 마운트 해제될 때 호출됩니다.

```javascript
import { useEffect } from 'react'

function useUnmount(fn) {
  useEffect(() => fn, [])
}
```

arrow function 을 호출하면 아무것도 하지 않고 React 가 컴포넌트를 마운트 해제 할 때 호출할 함수에 대한 참조를 반환합니다. 다시 한번, 빈 배열을 전달하면 모든 렌더링에 대해 함수를 반복적으로 호출하지 않게 됩니다.(어쨌든 아무것도 하지 않기 때문에 자원 낭비가 될 수 있습니다.)

### componentDidUpdate 에서 useUpdate 까지

마지막으로 우리는 `componentDidUpdate` 의 동작을 모방하고 싶습니다. 이 동작은 **초기 렌더링을 제외한** 모든 렌더링에서 호출됩니다.

이전 예제에서 `useEffect`는 특정 조건에서 통과하는 함수를 호출하도록 지시하는 두 번째 매개 변수를 사용하는 것을 보았습니다. 이 인수를 전달하지 않음으로써 우리는 React 에게 _"이 효과가 렌더에서 호출되는 것을 막아서는 안됩니다"_ 라고 전합니다. 그것은 첫 번째 것을 포함하기 때문에, 우리는 특별히 이것을 처리 할 필요가 있습니다. 그러나 나머지 시간에는 React 가 조건에 관계없이 효과를 나타낼 것입니다. 초기 렌더링의 경우, 초기 렌더링 또는 그 이후의 렌더링인지 여부를 알려주는 값 (boolean 값)을 선언해야합니다. 이 값은 업데이트 할 때 트리거 및 새로운 렌더링을 해서는 안되며 `useUpdate` 함수를 통해 액세스 할 수 있어야합니다.

이것은 `useRef` 메소드로 수행 할 수 있는 작업입니다. `useRef`는 우리 컴포넌트의 재렌더링을 트리거하지 않는 `useState`로 생각하십시오. 그래서 우리가 해야 할 일은 우리의 `useMount` 함수를 약간 수정하는 것입니다 :

```javascript
import { useRef, useEffect } from 'react'

function useUpdate(fn) {
  const mounting = useRef(true)
  useEffect(() => {
    if (mounting.current) {
      mounting.current = false
    } else {
      fn()
    }
  })
}
```

위의 코드에서 우리는 :

- `useRef` 후크를 사용하여 `참조`를 만듭니다. 이것은 우리가 우리 후크의 연속 호출 사이에서 액세스 할 수 있는 어딘가에 boolean 을 저장할 수 있게 해줍니다.
- **항상 effect 를 호출하십시오**. 이것은 두 가지 hooks 규칙 중 하나입니다. 이 기사의 앞 부분에서 설명한 것처럼 React 는 후크 **순서**를 사용하여 코드에 저장하고 전달할 값을 결정합니다.
- `useEffect` hook 의 arrow function 에서 이전에 저장된 값을 읽습니다. 그것이 true 라면, 우리는 여전히 초기 렌더링에 있습니다. 그래서 우리는 단지 false 로 설정했기 때문에 다음에 같은 코드 행에 도착하면 우리의 값은 우리가 더 이상 초기 렌더링에 있지 않다는 것을 정확하게 나타내며 우리는 함수를 호출합니다.
- 우리는 `useEffect`에 대한 두 번째 인수를 undefined 로 설정합니다. 즉, 후크를 트리거하지 못하도록 하는 것이 아무것도 없음을 React 에 지정합니다.

### shouldComponentUpdate 에서 memo 및 useMemo 로

`shouldComponentUpdate`는 이전 내용과 똑같지는 않습니다. React 16.7 을 사용하면 다음 중 하나를 수행 할 수 있습니다.

- React.PureComponent 처럼 `memo`를 사용하여 props 와 관련하여 컴포넌트를 memoize 하십시오.
- `useMemo`를 사용하여 컴포넌트의 자식을 memoize 합니다.

자세한 내용은 [FAQ](https://reactjs.org/docs/hooks-faq.html#how-to-memoize-calculations)를 참조하십시오.

### getDerivedStateFromProps 에서 ...까지 렌더링

상태가 이제 렌더링 함수에 직접 위치하기 때문에 (컴포넌트가 렌더링 함수이므로) 상태를 업데이트하기 위해 후크가 필요하지 않습니다. [FAQ](https://reactjs.org/docs/hooks-faq.html#how-do-i-implement-getderivedstatefromprops) 는 그것에 대해 충분하게 말합니다.

### componentDidCatch 에서 아무것도 ...하지 않을때

안타깝게도 이 시점에서 `componentDidCatch` 에 해당하는 요소가 없으므로 유일한 해결책은 고전적인 `React.Component` 를 만드는 것입니다.

### useEffect 대신에 useLayoutEffect 사용하기

[React 문서](https://reactjs.org/docs/hooks-reference.html#uselayouteffect)가 명시했듯이 구현 시 `useLayoutEffect` 후크를 사용하면 사용자 정의 후크가 React 컴포넌트 라이프 사이클 메소드의 초기 동작에 가깝게 됩니다. 그러나 시각적 업데이트를 차단하지 않으려면 `useEffect` 후크를 사용하는 것이 좋습니다.

그러므로, 당신이 하나 또는 다른 것을 사용해야 하는지를 결정하는 것이 당신을 위한 것입니다. 내 접근 방식은 `useEffect` 후크를 사용하고 첫 번째가 예상대로 동작하지 않을 때 fallback 으로 `useLayoutEffect` 후크를 사용하는 것입니다. 예를 들어 `fetch` 네트워크 호출과 같은 대부분의 side effect 에 대해서는 전자가 문제를 일으키지 않아야합니다.

### 후크 예제

이 기본적인 tic tac toe 게임은 React 16.7 을 사용하여 만들어졌으며 후크를 최대한 활용합니다. 주저하지 말고 탐색하거나 복제하십시오!

<figure>
  <iframe scrolling="no" frameborder="0" id="player" src="https://codesandbox.io/embed/github/dispix/react-hooks-example?referrer=https%3A%2F%2Fmedium.com%2Fmedia%2F1c8ebd81c7f523fe764ad3e7ecd63f6c%3FpostId%3Db50241334365" allowfullscreen="true" style="min-height:500px;"></iframe>
  <figcaption>
    <a href="https://codesandbox.io/s/github/dispix/react-hooks-example">https://codesandbox.io/s/github/dispix/react-hooks-example</a>
  </figcaption>
</figure>

## 🏴‍☠️ React Pirate

대안으로 `react-pirate` (당신도 알다시피, 해적들은 후크를 사랑합니다 😅)을 사용할 수 있습니다. 이 기사를 수정하는 동안 내가 만든 일반적이고 유용한 후크의 작은 라이브러리입니다. 라이브러리는 여전히 매우 어려우며 여러 가지 진화를 겪고 있습니다. 그래서 나는 친절하게 어떤 종류의 의견이나 제안을 친절하게 환영 할 것이다. :)

Github 저장소 링크 : [https://github.com/dispix/react-pirate](https://github.com/dispix/react-pirate)

편집 : 누군가 언급했듯이, 우리가 상태가 없는 함수형 컴포넌트(SFC)를 호출하기 위해 사용했던 것이 반드시 더 이상 상태가 없는 것은 아닙니다. 따라서 함수형 컴포넌트(FC)라고 부르는 것이 더 정확합니다. 그러나 SFC 는 여전히 커뮤니티 내에서 클래스가 아닌 함수로 작성된 모든 React 구성 요소를 언급하는 용어입니다.
