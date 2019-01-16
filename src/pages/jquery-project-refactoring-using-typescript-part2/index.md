---
title: TypeScript를 활용한 JQuery 프로젝트 리팩토링 - 2부
date: '2019-01-14'
mainImage: './refactoring.jpg'
tags: ['javascript', 'typescript']
---

> TypeScript를 활용한 사내 프로젝트의 리팩토링을 진행하면서 겪은 타입 에러의 종류과 그걸 해결하는 과정에 대한 내용으로 글을 정리했다. 생각보다 글 내용이 길어져 하나의 페이지에서 작성하려고 한 내용을 두개의 파트로 나누어셔 설명했기 때문에 기본적인 환경 설정 및 리팩토링 과정에서 특별히 배웠던 내용들은 이 전 글을 참고하면 된다.<!-- end --> 다른 사람에게 설명하기 보다는 스스로의 학습 내용을 정리하는 글이기 때문에 편한 말투로 작성했다.

## 리팩토링 결과

최종적으로 리팩토링을 완료한 후, 리팩토링을 진행한 프로젝트의 파일 개수와 타입 에러로 인해 수정된 코드에 남겨놓은 주석을 토대로 통계치를 정리했다.

- 리펙토링을 거친 파일 개수: 510개
- 타입 에러로 인해 수정된 코드 영역에 대한 주석 개수: 1481개
  - 타입 단언: 550개(37.1%)
  - 정의되지 않은 변수 확인: 384개(25.9%)
  - 변수 초기화 : 123개(8.3%)
  - 타입 변경: 93개(6.2%)
  - 사용하지 않는 변수: 57개(3.8%)
  - 잘못된 인자 설정 : 52개(3.5%)
  - 함수 반환 타입 설정: 48개(3.2%)
  - 인터페이스 재정의: 47개(3.1%)
  - any 타입 허용: 35개(2.3%)
  - 잘못된 변수 및 함수 사용: 35개(2.3%)
  - unknown 타입 사용: 27개(1.8%)
  - 반환 값 수정: 20개(1.3%)
  - 전역 변수 설정: 5개(0.3%)
  - 여러개의 인자 타입 설정: 5개(0.3%)

주석의 내용대로 리팩토링 과정에서 확인된 타입 에러가 정확히 일치한다고 볼 수 없지만 최대한 같은 경우에 대한 타입 에러 별로 주석을 남겨 통계치를 냈다. 이제 리팩토링 시 남겨놓은 주석을 토대로 가장 많은 검토가 필요한 종류부터 간단하게 해당 내용을 정리해보자.

### 타입 단언

앞서 말한대로 `DOM` 영역에 대한 요소 및 속성에 접근할 경우 개발자가 미처 확인하지 못했던 타입을 추론하게 되어 에러를 발생시켰고 대부분의 경우 타입 단언을 통해 해결하였다.

타입 단언의 경우 실제 코드의 로직이 변경하는 경우는 아니지만, 경우에 따라 충분히 버그를 일으킬 수 있는 영역이기 때문에 이 후 추가적인 리팩토링 시 검토해봐야 할 부분이라 생각한다. 우선 타입 단언을 사용한 부분 중 눈여겨 볼만한 부분만 간략히 정리했다.

```typescript
const value = $('#foo').val() as string // string | string[] | number | undefined
const width = $('#foo').width() as number // number | undefined
const { top } = $('#foo').offset() as { top: number } // { top: number, left: number } | undefined
```

`input` 요소의 값을 가져오는 `val` 메서드의 반환 타입의 경우 요소의 종류에 따라 `string` 뿐만 아니라 `string[]`, `number`, `undefined` 타입을 반환하기 때문에 각 요소에 맞는 타입 단언을 해주거나 기본값을 지정해줄 수 있도록 했다.

선택한 `DOM` 요소의 너비값을 반환하는 `width` 함수의 경우 기본적으로 `number` 타입을 반환하는 것으로 예상하지만 `undefined` 타입을 반환할 수도 있는 것으로 타입을 추론한다. 기본적으로 요소가 없을 경우도 있지만, 그렇지 않은 경우 스타일 또는 마크업의 구조적인 요소에 의한 것인지 정확히 파악하지 못했다. 이 외에도 `height`, `scrollTop`과 같은 함수에서도 `undefined` 타입을 추론한다.

또한 `offset` 함수의 경우 `Coordinates` 또는 `undefined` 타입을 반환하게 된다. `Coordinates` 타입은 해당 요소의 좌표 정보를 가지는 객체로 대부분의 경우 `top` 과 `left` 프로퍼티를 가지는 객체를 반환해 주지만 이 역시 해당 요소의 존재 여부에 따라 `undefined`를 반환해 줄 수 있다.

```typescript
const container = document.querySelector('#container') as HTMLElement // HTMLElement | null
```

`querySelector` 함수를 통해 요소에 접근하는 경우에도 해당 요소에 존재 여부에 따라 `null` 타입을 반한하기 때문에 해당 요소의 존재 여부가 확실한 상태에서 속성에 접근하려면 `HTMLElement` 타입을 지정해줘야한다.

이처럼 대부분의 마크업 요소에 접근하는 경우 해당 요소의 존재 여부에 따라 `undefined` 또는 `null` 타입을 반환하기 때문에 이러한 요소에 접근 시에는 항상 정의되지 않은 타입을 반환하는 경우에 대한 조건 처리가 필요하다.

```typescript
let resizeTimer: WindowTimers | number

resizeTimer = setTimeout(() => {}, 1000)

clearTimeout(resizeTimer as number)
```

타어머 설정 시 사용하는 `setTimeout` 함수의 반환타입을 변수에 할당하는 경우 해당 변수는 `number` 타입의 값을 가지게 되지만 타입 추론 과정에서는 `WindowTimers` 라는 타입을 반환하게 된다. 그리고 변수에 할당된 값을 `clearTimeout` 함수인 인자로 넘겨줄때 `number` 타입의 인수로 단언하지 않는 경우 `WindowTimers` 타입을 넘겨주게 떼문에 타입 에러가 발생한다. 변수 선인 시 두 가지 타입을 할당받을 수 있도록 한뒤 `clearTimeout`의 인수로 넘겨줄때는 `number` 타입으로 단언해주었다.

```typescript
function foo(...args: any[]) {
  if (args.length === 2) {
    const params1 = args as [string, string]
    // ...
  } else {
    const params2 = args as [number, string, string]
    // ...
  }
}

foo('1', '2')
foo(1, '2', '3')
```

`spread` 문법을 활용해 인수를 전달받는 함수의 경우 인수 타입을 `any[]` 타입으로 설정해 주었고 특정 조건에 따라 함수의 인자 타입을 단언해줄 수 있도록 했다.

```typescript
$('#foo').on('click', (e: JQuery.Event) => {
  const target = e.target as EventTarget
  const id = (e.target as HTMLElement).attr('id')
  const code = e.keyCode as number
})
```

이벤트 객체 접근 시 이벤트 타겟이 접근할 경우 `null` 타입을 추론할 수 있기 때문에 `EventTarget` 타입으로 단언해주었다. `target` 요소에서 해당 요소의 속성에 접근하는 경우에는 `HTMLElement` 타입을 단언하여 각 속성에 접근할 수 있도록 한다. 키 코드를 확인하는 경우에도 `undefined` 타입을 추론할 수 있기 때문에 `number` 타입으로 단언해 주었다.

```typescript
const regex = /foo/g
const result = 'foo'.match(regex) as RegExpMatchArray
```

특정 문자열을 패턴에 따른 매칭값을 찾기 위해 `match` 함수를 활용하는 경우에도 `null` 타입을 추론할 수 있기 때문에 `RegExpMatchArray` 타입으로 단언해주었다.

### 정의되지 않은 변수 확인

정의되지 않은 변수란 변수의 타입이 `null` 또는 `undefined` 를 가질 수 있는 변수를 말하며, 이러한 변수들을 확인되지 않은 상태에서 다른 타입의 형식으로 사용되는 경우 타입 에러를 발생한다. 그렇기 때문에 정의되지 않은 변수에 접근하기 전 조건 처리를 통해 변수의 사용 여부를 정해주도록 했다.

특히 리팩토링 과정에서는 클래스 문법 사용 시 클래스 내 프로퍼티에 접근하는 과정에서 정의되지 않은 프로퍼티를 사용하는 경우에 대한 에러를 주로 확인할 수 있었다.

```typescript
class Foo {
  // 시작(초기화) 함수
  init() {
    this.$container = $('foo')
    this.show()
  }

  show() {
    console.log(this.$container.html())
  }
}

const foo = new Foo()
foo.init() // 클래스 사용 시 시작 함수를 호출하도록 구현
```

`Foo` 클래스가 있고 해당 클래스를 호출한뒤 `init` 함수를 실행한다고 가정해보자. `init` 함수 호출 시 `$container` 프로퍼티 생성 후 `show` 함수를 호츨하여 `$container`가 제공하는 함수 반환값을 콘솔로 출력하게 했다.

위와 같이 프로젝트에서 사용 중인 모듈이 클래스 문법으로 작성되어 있는 경우, 시작(또는 초기화) 함수를 따로 구현한 뒤, 해당 함수를 호출하여 특정 기능을 사용할 수 있도록 구현되어 있는 모듈들을 확인했다. 이는 팀 내 개발 가이드라고 할 수 없지만 개발 스타일에 따른 구현 결과라 볼 수 있으며, 실제 사용하더라도 문제없이 구현된 모듈이지만 TypeScript 기준에서는 에러가 발생한다.

```typescript
class Foo {
  // 시작(초기화) 함수
  init() {
    this.$container = $('foo')
    this.show()
  }

  show() {
    // error!. 해당 프로퍼티가 정의되지 않음
    console.log(this.$container.html())
  }
}

const foo = new Foo()
foo.show() // 클래스 사용 시 시작 함수를 호출하지 않고 특정 함수 호출
```

해당 클래스의 사용법은 생성자 호출 후 시작 함수를 호출하도록 개발자의 관점에서 인지하고 사용할 수 있지만, TypeScript는 그렇지 않기 때문이다. 클래스 인스턴스 생성 후 시작 함수로 호출하지 않고 `show`함수를 호출할 경우에는 시작 함수에서 초기화되지 않은 프로퍼티에 접근하기 때문에 에러를 발생하게 된다.

물론 위와 같은 경우처럼 사용된 코드들은 확인되지 않았지만, TypeScript의 관점에서는 클래스 호출 후 시작 함수가 호출된다고 보장하지 않기 때문이다. 이는 어찌보면 정상적인 타입 추론 과정이며 추론된 타입에 맞춰주도록 리팩토링을 진행했다.

```typescript
class Foo {
  // 프로퍼티 타입 설정
  $container?: JQuery

  // 시작(초기화) 함수
  init() {
    this.$container = $('foo')
    this.show()
  }

  show() {
    // success
    if (this.$container) {
      console.log(this.$container.html())
    }
  }
}

// 클래스 사용 시 시작 함수를 호출하지 않고 특정 함수 호출
const foo = new Foo()
foo.show()
```

`$container` 프로퍼티의 타입을 `JQuery` 또는 `undefined` 로 설정해 주었다. 이 후 `show` 함수에서 해당 프로퍼티 접근 시 조건 처리를 통해 해당 프로퍼티의 값이 확인된 경우에만 이 후 로직이 동작하도록 구현했다.

```typescript
class Foo {
  // 프로퍼티 타입 설정
  $container: JQuery

  constructor() {
    this.$container = $('foo')
  }

  // 시작(초기화) 함수
  init() {
    this.show()
  }

  show() {
    // success
    this.$container.html()
  }
}

// 클래스 사용 시 시작 함수를 호출하지 않고 특정 함수 호출
const foo = new Foo()
foo.show()
```

생성자 함수인 `constructor`에서 프로퍼티를 초기화하지 않는 경우 클래스의 프로퍼티는 특정 타입이 아닌 경우 `undefined` 타입으로 인식된다. 클래스의 프로퍼티를 사용할 경우 생성자 함수에서 초기화해주는 것이 가장 바람직한 방법인 아닌가 싶다. 리팩토링 과정에서는 생성자 함수에서 초기화되지 않은 프로퍼티의 접근을 조건문을 통해 1차적으로 처리해 주었지만 이 후 추가적인 구현 시에는 생성자 함수에서 프로퍼티를 정의할 수 있도록 하자.

이와 같이 대부분의 경우 클래스 또는 객체 내 프로퍼티에서 정의되지 않은 변수 사용에 대한 에러를 확인해 주었다. 이 외에도 정의되지 않은 변수가 어떻게 사용될 수 있는지 확인해보자.

```typescript
const arr: string[] = ['a', 'b', 'c']
const char = arr.shift()
console.log(char.toUpperCase()) // error! string 또는 undefined 타입 추론
```

위와 같이 `string[]` 타입을 가지는 배열이 있고 `shift` 함수를 통해 배열 맨 처음의 문자열의 대문자를 콘솔로 출력하는 코드이다. 간단히 눈으로 봐서는 아무 이상이 없지만 타입 에러가 발생하게 된다. `shift` 함수 뿐만 아니라 배열 내장 함수의 경우 접근하는 배열이 가지는 값의 존재 여부를 확인하지 않는다. 그렇기 때문에 `char` 변수는 `undefined` 타입을 갖는 정의되지 않은 변수가 될 수 있으며, 결국 `string` 타입에서 확인 가능한 `toUpperCase` 함수를 호출할 수 없기 때문에 에러가 발생한다.

```typescript
const arr: string[] = ['a', 'b', 'c']
const char = arr.shift() || ''
console.log(char.toUpperCase()) // success
```

`shfit` 함수 사용 시 반환 타입 여부에 따라 기본값을 지징해 주도록 했다. 초기값 대신 `char` 변수의 타입 확인에 대한 조건문을 활용할 수도 있다. 각 코드에 필요한 요구사항에 맞춰 정의되지 않은 변수 사용 시에 대한 에러를 처리해주었다.

이 외에도 정의되지 않은 변수가 생길 수 있는 경우가 있는데 이 부분은 확인 후 업데이트 하도록 하자.

### 변수 초기화

TypeScript 환경에서는 변수 선언 후 초기값 할당 시 최초로 할당된 변수에 타입에 맞춰 타입을 추론하게 된다. 만약 `let`으로 선언된 변수나 객체 프로퍼티에서 초기값과 다른 타입의 값으로 변경이 되는 경우 직접 타입을 수정해줘야 하겠지만, 대부분의 경우 초기화 시점에서 정의된 타입으로 사용된다.

이렇게 변수 초기화를 통해 타입을 지정한 이후 해당 변수를 사용해야 하는데 그렇지 않은 코드들에 대한 에러를 확인할 수 있었고, 이러한 타입 에러를 처리한 내용을 정리했다.

```typescript
const foo = {
  bar: 'bar',
}

foo.baz = 'baz' // error! for 객체 내 baz 프로퍼티가 초기화되지 않음
```

`bar`라는 프로퍼티를 가지는 `foo` 라는 객체를 초기화 한후, `baz` 프로퍼티를 추가하는 코드이다. 역시 아무 문제없는 코드로 볼 수 있지만 타입 에러를 가지는 코드가 된다. 초기화 시점에서 확인되지 않는 객체 프로퍼티의 접근하기 때문이며, 이는 해당 프로퍼티에 대한 타입을 확인할 수 없기 때문이다.

변수, 특히 객체 프로퍼티에 대한 엄격한 타입 정의는 TypeScript 에서 필요한 과정이며, 이러한 부분은 JavaScript가 가지는 장점에서 벗어나는 부분이라 개인적으로 생각한다. 동적으로 프로퍼티 할당 시 최초로 설정된 값에 맞게 타입을 추론해 줄 수 있었으면 하는 아쉬움이 있지만, 이러한 기능은 환경 설정 또는 내가 놓치고 있었던 점에서 해결할수 도 있으니 이 후 확인되면 글 내용을 업데이트하도록 하자.

```typescript
type Foo = {
  bar: string
  baz?: string
}

const foo: Foo = {
  bar: 'bar',
}

foo.baz = 'baz' // success
```

초기화 되지 않은 변수 및 객체 프로퍼티에 접근하는 경우 `type` alias를 통해 타입을 지정해 주었다. 새롭게 지정된 타입을 통해 객체의 새롭게 추가하고자 하는 프로퍼티의 타입을 확인할 수 있다. 여담으로 `type` 뿐만 아니라 `interface` 를 활용할 수 있으며 `type` 과 `interface` 는 비슷한 기능을 제공하지만 차이점 또한 가지고 있기 때문에 각 alias 를 통해 경우에 따라 적절히 사용해주도록 하자.

```typescript
const foo = {
  bar: 'bar',
  baz: '',
}

foo.baz = 'baz' // success
```

위와 같이 `type` 또는 `interface`를 활용할 수 있지만 그에 따른 코드 작업량이 늘어나기 때문에 변수 및 객체의 타입이 초기화 이후 변하지 않는 경우라면 초기화 시점에서 해당 타입에 대한 기본값으로 할당해 주는 것이 좋은 방법이라고 생각한다.

예시로 든 내용은 객체 프로퍼티의 대한 내용이었지만, 변수 및 함수, 함수 및 생성자 인자 등 타입의 초기화가 이루어지지 않은 모든 영역을 수정했기 때문에 생각보다 많은 영역을 수정했고, 그 결과 세 번째로 많은 타입 에러를 확인할 수 있었다.

### 타입 변경

JavaScript 에서 제공하는 내장 객체 또는 구현한 모듈에서 제공하는 기능을 활용하거나 마크업 요소를 변경할때 잘못된 타입을 사용하여 에러가 발생한 내용이며 그 중 대표적인 내용을 간략히 정리했다.

```typescript
const value = 1

parseInt(value) // error!
parseInt(value.toString()) // success
```

`parseInt`를 사용한 코드의 경우가 제일 많은 타입 변경을 일으킨 경우이며, 대부분의 경우 `string` 타입이 아닌 `number` 타입을 인자로 넘겨주고 있었다. 실제 `parseInt` 함수 사용 시에는 `number` 타입을 넘겨주더라고 정상적으로 동작하지만 TypeScript 환경에서는 `string` 타입만을 인수로 받기 때문에 해당 타입을 `string`으로 변경해주었다.

```typescript
const value = 1
const foo = document.querySelector('#foo')

foo.innerHTML = value // error!
foo.innerHTML = value.toString() // success
```

요소 내부의 컨텐츠를 설정해주는 `innerHTML` 프로퍼티의 경우에도 TypeScript 환경에서는 `string` 타입만은 허용하기 때문에 해당 타입에 맞게 변경해주었다.

```typescript
const date = '20190101'
const year = date.substr(0, 4)

// error! string 타입을 number 타입과 비교 연산
if (year > 2010) {
  // ...
}

// success
if (parseInt(year) > 2010) {
  // ...
}
```

그 밖에 직접 구현한 모듈을 활용 시 잘못된 타입을 사용한 경우에 대한 에러도 수정했다. 위와 같이 `string` 타입의 변수를 `number` 타입과 비교 연산하는 에러 또한 발견할 수 있었다. 그밖에 예로 설명한 내용뿐만 아니라 JavaScript 내장 객체, DOM 내장 객체, JQuery 활용 시 기존에 정상적으로 사용되었던 타입의 경우라도 TypeScript 환경에서는 타입 에러를 일으키는 경우를 확인할 수 있기 때문에 허용되지 않는 타입을 알맞게 처리해주는 것이 필요하다.

### 사용하지 않는 변수

말 그대로 선언된 이후 사용하지 않은 변수에 대한 리팩토링 내용을 정리했다.

```typescript
// error! a 인수가 사용되지 않음
function foo(a: number, b: number) {
  return b
}

// success
function foo(_a: number, b: number) {
  return b
}
```

대부분의 경우 함수 또는 클래스의 생성자 인수가 사용되지 않은 경우가 대부분을 차지했다. 사용하지 않는 인수를 제거해도 되지만 그럴 경우 인수 개수가 변경되기 때문에 직/간접적으로 연결되어 있는 모듈간에 의도하지 않은 영향을 줄 수 있다고 판단하였고, 사용하지 않는 변수 앞에 `_` 문자를 추가해줌으로서 해당 인수를 무시하도록 알려주었다. 다만 사용되지 않는 인수라도 타입 지정을 필요하다.

```typescript
function foo(a: number) {
  // 주석 처리
  // const b = 'b'

  return a
}
```

인수 타입인 아니면서 사용하지 않는 변수의 경우, 주석 처리를 통해 타입 에러를 제거해주었다.

### 잘못된 인자 설정

함수 또는 클래스를 사용하는 경우 해당 모듈에서 요구하는 인수의 개수가 맞지 않는 경우에 대한 내용이다.

```typescript
/**
 * foo
 * @param {number} a
 * @param {number} b
 * @return {number}
 */
function foo(a: number, b: number) {
  return a + b
}

foo(1) // error! 인수의 개수가 맞지 않음
foo(1, 0) // success
```

함수 사용 시 정의된 인수의 개수만큼 함수를 호출해서 사용하지 않는 경우 타입 에러가 발생하게 된다. 보통 정의된 개수보다 적은 인수를 넘겨주는 경우 함수에 정의된 타입에 따라 기본값을 넘겨주었다. 다만 이 경우에는 `JSDoc` 주석에 정의된 타입을 참고하여 타입 선언 및 인수를 추가해 주었다.

- 정의된 인수 타압에 따른 기본 인수값
  - string: ''
  - number: 0
  - Array: []
  - object: {}
  - Function: () => {}

```typescript
function foo(a: number) {
  return a
}

foo(1, 2) // error! 인수의 개수가 맞지 않음
foo(1) // success

// or
// 사용하지 않는 인수 추가
function foo(a: number, _b: number) {
  return a
}

foo(1, 2) // success
```

정의된 개수보다 많은 인수를 넘겨주는 경우에는 정의된 인수의 개수만큼만 넘겨주고 나머저 인수는 제거하였다. 다만 코드 흐름상 사용될 여지가 있는 것으로 파악되는 인수의 경우 요청 시 사용한 개수만큼 함수의 인수를 추가한 뒤 사용하지 않는 변수로 정의하였다.

### 함수 반환 타입 설정

반환값을 가지는 함수 사용 시 특정 조건에 의해 함수의 반환값을 넘겨주지 않는 경우 타입 경고가 발생한다. 함수 호출 시 반환값을 넘겨주지 않는 조건에 해당하더라도 `undefined` 값을 넘겨주기 때문에 결과적으로는 함수 호출 조건에 상관없이 반환 타입을 확인할 수 있어 타입 에러가 아닌 타입 경고로 분류되지 않나 싶다. 다만 경우에 따라 반환 타입을 지정하지 않은 경우 타입 에러가 발생할 수 있다.

```typescript
// warning. 일부 조건에 따라 값을 반환하지 않음
;[1, 2, 3].map(num => {
  if (num < 3) {
    return num
  }
})

// success
;[(1, 2, 3)].map(
  (num): number | void => {
    if (num < 3) {
      return num
    }
  }
)
```

위와 같이 `map` 메서드를 통해 배열 내부를 순회하며 각 인덱스 위치에 특정 값을 반환하는 코드이다. 일부 조건에 따라 값을 반환해주지 않아 타입 경고가 확인되며 반환 타입을 설정해 해결해 주었다.
실제 위와 같이 특정 조건을 대한 반환값이 필요한 경우 `filter` 메서드를 활용하면 되지만, 리팩토링 시점에서 직접 구현한 코드가 아니며 내가 파악하지 못한 어떠한 의도가 있을 수도 있기 때문에 반환 타입을 지정해 주어 타입 경고를 해결하였다.

```typescript
// warning. 일부 조건에 따라 값을 반환하지 않음
$('#foo').on('click', () => {
  if (isSomething) {
    return false
  }
  // ...
})

// success
$('#foo').on(
  'click',
  (): false | void => {
    if (isSomething) {
      return false
    }
    // ...
  }
)
```

반환 타입 설정의 경우 특히 이벤트 콜백 함수를 정의할때 많이 사용했다. 특정 조건에 따라 이벤트를 중지할 경우에도 값을 반환하지 않기 때문에 반환 타입 설정을 통해 타입 경고를 해결해주었다.

```typescript
const foo = (str = '') => {
  if (!str) {
    return {}
  }

  return {
    [str]: str,
  }
}

console.log(foo('a').a) // error! 객체 프로퍼티 확인할 수 없음
console.log(foo('b').b) // error! 객체 프로퍼티 확인할 수 없음
```

위와 같이 인자 사용 여부에 따라 반환 객체의 프로퍼티를 설정해 주는 함수가 있다. 함수 호출 시 인자를 설정해 준 뒤 반환된 객체의 프로퍼터에 접근하고 싶지만 타입 에러가 발생한다. 반환 타입을 일반 객체로만 추론하기 때문에 객체 내 프로퍼티를 확인할 수 없다.

```typescript
const foo = (str = ''): { [name: string]: string } => {
  if (!str) {
    return {}
  }

  return {
    [str]: str,
  }
}

console.log(foo('a').a) // success
console.log(foo('b').b) // success
```

반환 타입을 인덱스 시그니처 문법을 활용하여 프로퍼티가 설정된 객체를 반환할 수 있도록 해주었다.

### 인터페이스 재정의

이 전 파트에서 인터페이스 확장을 통해 `Window`, `JQuery` 타입을 재정의하는 방법에 대해 설명했다. `Window`, `JQuery` 타입뿐만 아니라 TypeScript에서 추론하지 못한 타입에 대하여 인터페이스를 재정의한 내용을 정리했다.

```typescript
interface FileReaderEventTarget extends EventTarget {
  result: string
}

const reader = new FileReader()

reader.onload = e => {
  const result = (e.target as FileReaderEventTarget).result
  // ...
}
```

`FileReader` 객체의 인스턴스 생성 후 `onload` 이벤트 타겟을 활용하는 코드이다. 일반적인 이벤트 타겟의 경우 `EventTarget` 타입을 추론하는데 해당 타입의 경우 `result` 프로퍼티를 확인할 수 없기 떄문에 해당 타입에 대한 프로퍼티를 재정의했다

```typescript
interface DatasetEventTarget extends EventTarget {
  dataset: DOMStringMap
}

$('#foo').on('click', (e: JQuery.Event) => {
  const { a, b, c } = (e.target as DatasetEventTarget).dataset
  // ...
})
```

마크업 요소의 이벤트 설정 시 이벤트 타겟의 `dataset` 속성을 활용하는 코드이다. `EventTarget`의 경우 `dataset` 프로퍼티에 대한 타입을 확인할 수 없어 해당 타입에 대한 프로퍼티를 재정의했다. `dataset` 프로퍼티의 경우 `DOMStringMap` 타입으로 정의하여 커스텀 데이터 속성으로 인식할 수 있게 설정해주었다.

```typescript
interface TouchEvent extends Event {
  touches: { pageX: number; pageY: number }[]
}

$('#foo').on('touchstart', (e: JQuery.Event) => {
  const { pageX, pageY } = (e.originalEvent as TouchEvent).touches[0]
  // ...
})
```

마크업 요소의 `touchstart` 이벤트를 활용하는 코드이다. `originalEvent` 프로퍼티의 경우 터치 정보와 관련된 타입을 확인할 수 없었기 때문에 타입을 재정의해서 사용했다.

### any 타입 허용

코드의 특정한 구조로 인해 확인하지 못한 타입의 경우 `any` 타입을 활용하였다. 최대한 모든 타입을 확인하려고 했지만 그러지 못한 부분들이 있었고, 어떠한 경우가 있었는지에 대한 내용을 정리했다.

```typescript
function foo(callback: (params: any) => any) {
  return callback(something)
}
```

가장 많은 부분에서 `any` 타입을 활용한 예는 콜백 함수의 인자 또는 반환 값에 대한 타입이다. 콜백 함수의 인자의 경우, 비동기 응답 데이터의 따라 타입 지정이 가능한 경우도 있었지만 반환 타입의 경우 콜백 함수가 활용된 코드를 전부 확인할 수 없었기 때문에 `any` 타입으로 지정해주었다.

사실 일부 코드의 경우 실제로 반환값을 활용하지 않거나 예측 가능한 범위에서 반환값에 대한 타입을 지정해줄 수 있었지만, 미처 파악하지 못한 코드가 있거나 아니면 파악하지 못한 구현상의 이유가 있을수 있다고 생각해서 값을 반환하는 콜백함수의 경우에는 대부분 `any` 타입을 허용했다.

```typescript
function foo(...args: any[]) {
  // ...
}
```

이외에도 실제 사용된 경우는 많지 않지만 함수 인자를 `rest parameter` 타입으로 전달받는 경우 인자 타입을 `any[]`로 설정해주었다.

```typescript
let value: number | null = null
value = 1
const isNumber = Number.isInteger(value as any)
```

`Number` 객체에서 제공하는 `isInteger` 함수의 경우 `number` 타입만을 허용하며 인자 타입 또한 `number` 이외의 타입을 가지는 경우 타입 에러를 일으키기 때문에 `any` 타입을 허용했다.

```typescript
class Foo {
  constructor() {
    this.foo = {}
    this.bar = {}

    return this.foo as any
  }
}
```

클래스 생성자의 반환값을 특정 프로퍼티로 반환하는 코드이다. TypeScript 환경에서는 생성자 함수가 클래스의 모든 프로퍼티를 반환해야 하기 때문에 타입 에러가 발생하며 `any` 타입을 허용하여 해결해주었다.
위와 같은 구조의 경우라면 클래스 대신 함수형 모듈로 개선하는 것이 필요하며 이 후 작업 진행 시 수정할 수 있도록 하자.

### 잘못된 변수 및 함수 사용

개발상의 실수, 혹은 예측하지 못하거나 의도와는 다른 타입 설정으로 인해 생긴 타입 에러와 관련된 내용을 정리했다.

```typescript
let num = 0

num = something() || null // error!
num = something() || 0 // success

if (num) {
  // ...
}
```

`number` 타입으로 할당된 변수에 `null` 값을 반환하는 코드이다. 초기화 시점에서 `number` 타입으로 할단된 변수에 정의되지 않은 `null` 타입의 값을 넘겨주고 있다. 이후 조건문에서 해당 변수값을 활용해 코드를 실행하도록 하고 있다. 조건문 활용 시 값이 있을 경우에 대한 처리를 해주기 위해 `something` 함수의 반환값에 따라 `null` 값을 할당해준것으로 파악되며, 기본적으로 정상적인 코드라 볼 수 있지만 TypeScript 환경에서는 에러가 나기 때문에 `null` 대신 `0` 값을 할당해주도록 하였다.

```typescript
let timer: number | WindowTimers = setTimeout(() => {}, 1000)
// error! clearTimeout 함수는 반환 타입이 void 이다.
clearTimeout(timer as number) && (timer = 0)
// success
clearTimeout(timer as number)
timer = 0
```

`clearTimeout` 함수의 반환 타입의 따라 `timer` 변수를 초기화하는 코드이다. `clearTimeout`의 경우 반환 값이 없는 `void` 타입의 함수인데 논리곱 연산을 통해 반환값에 따라 코드를 실행하도록 구현되었다. 이는 타입 에러에 해당하며 조건 연산을 하지 않고 순차적을 코드를 실행하도록 수정하였다.

```typescript
class Foo {
  value: string

  setValue(value: string) {
    // const self = this; self 변수를 선언하는 부분이 빠진 것 같다.

    self.value = value // error! self 객체에 접근하기 위해 전역 범위로 클로저 발생.
    this.value = value // success
  }
}
```

클래스에서 자신의 프로퍼티 값을 변경하도록 구현된 메서드이다. 자신의 프로퍼티에 접근하기 위해 `this` 객체에 접근해야 하지만 `self`라는 정의되지 않은 객체에 접근하고 있다. 해당 객체에 접근하기 위해 전역 범위까지 클로져가 발생하미 결국 `window` 객체에서 프로퍼티를 찾지 못해 타입 에러가 발생한다. 해당 코드는 `this` 객체에 직접 접근할 수 있도록 수정해주었다.

```typescript
class Foo {
  value: string

  test() {
    const self = this
    $('#foo').on('click', function(this: HTMLElement) {
      console.log(this.value) // error! 프로퍼티를 찾을 수 없음
      console.log(self.value) // success
    })
  }
}
```

반대로 클래스의 `this` 객체를 할당받은 `self` 변수에 접근하지 않아 생기는 에러 또한 확인했다. 이벤트 실행 시 동작할 콜백함수를 기본 함수로 접근한 후 클백 함수에서 클래스 프로퍼티에 접근하면서 생기는 에러이다. 클래스 프로퍼티에 접근하기 위해 `self` 객체로 수정해주었다.

```typescript
class Foo {
  foo: string

  constructor(props: { callback: () => string }) {
    this.foo = callback()
  }
}

class Bar {
  bar: string

  constructor() {
    this.bar = 'bar'

    new Foo({
      // error! 기본 함수 정의로 인한 자신(Foo)의 프로퍼티에 접근한다.
      callback() {
        return this.bar
      },
    })

    new Foo({
      // success
      callback: () => {
        return this.bar
      },
    })
  }
}
```

객체의 프로퍼티 접근과 관련된 다른 코드를 확인해보자. 두개의 클래스가 구현되어 있으며 `Foo` 클래스는 생성자 함수에서 인자로 전달된 객체의 콜백 함수를 통해 자신의 프로퍼티 값을 설정해주고 있다. `Bar` 클래스에서는 `Foo` 클래스 호출 시 자신의 프로퍼티를 반환값으로 설정한 콜백함수가 설정된 객체를 인자로 설정해 주었다. 언뜻 보면 정상적인 경우로 볼 수 있지만 타입 에러를 일으키는 코드이다.

기본적인 함수 표현식으로 콜백 함수를 선언했기 때문에 `this` 객체 접근 시 `Bar` 클래스가 아닌 `Foo` 클래스의 프로퍼티로 접근하며, 존재하지 않는 프로퍼티에 접근하기 때문에 에러가 발생한다. 이는 `arrow function` 문법을 통해 `Bar` 클래스의 프로퍼티에 접근할 수 있도록 해결해주었다.

```typescript
function get() {
  if (isSomething) {
    return {
      foo: 'foo',
      bar: 'bar',
    }
  }

  return null
}

function set() {
  const result = get()

  if (!result) {
    return
  }

  const { foo, bar } = get() // error! 함수 재호출로 인해 반환값의 프로퍼티가 존재하는지 확인할 수 없음
  const { foo, bar } = result // success

  // ...
}
```

함수 호출 시 반환값에 따른 조건처리 시에도 생길 수 있는 에러 타입을 확인했다. 위와 같이 특정 조건에 따라 객체 또는 `null` 값을 반환하는 `get`함수가 있다. `set` 함수는 `get` 함수의 반환값에 따라 코드 실행을 중지하거나 이 후 코드를 실행하도록 구현되었다.

위와 같은 경우도 타입 에러가 확인되었는데 `null` 값을 확인한 이 후 `get` 함수를 재호출하여 검증되지 않은 반환값을 사용하기 때문이다. `get` 함수를 재호출하지 않고 반환값을 할당받는 `result` 변수의 조건처리를 통해 이 후 코드를 실행할 수 있도록 수정했다.

```typescript
const str = '...'

const hasFoo = str.search('foo') > -1
const hasBar = str.search('bar' > -1) // error! string | RegExp 타입의 인수가 전달되어야 함
const hasBar = str.search('bar') > -1 // success
```

문자열의 특정한 문자가 있는지 확인하기 위해 `search` 메서드를 활용하는 코드이다. 자세히 보면 알겠지만 두번째 `hasBar` 변수의 할당되는 값의 경우 `search` 메서드의 인수값을 `boolean` 타입으로 넘겨주고 있다. 결국 `hasBar` 변수는 `search`함수의 반환값에 따른 `boolean` 값 대신 무조건 `-1`이라는 값을 가지게 된다.

이는 코드 구현 시 괄호를 닫는 부분에서의 개발자의 실수로 파악되며 결국 의도하지 않은 부분이라 생각하지만 JavaScript 기준에서는 정상적으로 동작하며, 런타임 시에도 에러를 일으키지 않는 코드이다. 그러나 TypeScript에서는 `search` 메서드의 인수 타입은 `string` 또는 `RegExp` 타입만을 허용하기 때문에 해당 인수 타입에 맞게 코드를 수정해주었다.

이 외에도 기본적인 오타 수정, 존재하지 않은 변수에 접근하는 등 여러가지 케이스에 대하여 잘못된 사용법을 확인 할 수 있었다.

### unknown 타입 사용

말 그대로 `알 수없는` 타입를 가지는 변수를 대해 `unknown`이라는 타입(`unknown` 타입의 경우 3.0 버전부터 추가된 타입이다)을 지정해 준 경우이며 이에 대한 내용을 정리했다. `any` 타입을 사용할 수 도 있지만, 의미상 *허용할 수 있는 모든 타입*와 *알수 없는 타입*은 엄연히 다르다고 생각하기 때문에 따로 통계에 포함했다.

```typescript
const isFunction = function(obj: unknown) {
  return typeof obj === 'function'
}
```

전달받은 인수 타입이 `function` 인지 확인하는 함수이다. 위와 같이 `typeof` 문법을 통해 확인되는 변수의 경우 모두 `unknown` 타입으로 처리해주었다.

앞서 말한대로 전달받은 인수 타입을 `any` 타입으로 설정해도 되지만, 의미상으로 `unknown` 타입이 더욱 적절하기 때문에 `unknown` 타입을 활용했다. 실제 `any` 타입과 `unknown` 타입 선언에 따라 변수의 사용 범위가 달라지며, 이는 관련 문서를 통해 자세히 확인해 볼 수 있다.

### 반환 값 수정

함수의 반환값이 일정하지 않은 타입으로 반환되는 경우에 대한 내용이다. **함수 반환 타입 설정**과 비슷한 내용일 수 있지만, 타입 설정이 아닌 코드의 반환 값을 직접 수정했기 때문에 따로 통계로 정리했다.

```typescript
let result = false

function test() {
  if (isSomething) {
    return true
  }
}

result = test() // error! undefined 타입이 허용되지 않음

if (result) {
  // ...
}
```

특정 기준에 따라 반환값을 다르게 넘겨주는 함수를 활용하는 코드이다. 반환값이 없는 경우 `undefined` 를 반환하게 되며, 기존 환경의 경우 정상적으로 동작하겠지만 타입 시스템의 환경에서 해당 변수의 타입은 `boolean` 타입이기 때문에 타입에러가 발생한다.

```typescript
let result = false

function test() {
  if (isSomething) {
    return true
  }

  return false // 특정 조건에 만족하는 않는 경우에 대한 반환값 설정
}

result = test() // success

if (result) {
  // ...
}
```

변수 초기화 시 여러 타입을 받을 수 있도록 수정하거나 함수의 반환 타입을 수정해줘도 되지만, 함수의 반환값이 `boolean` 타입과 같이 예상 가능한 범위의 값인 경우 반환값을 추가해줌으로써 타입 에러를 해결하였다.

### 전역 변수 설정

모듈로 호출되지 않고 브라우저 접근 시 사용 가능한 모듈의 타입을 처리한 내용이다. 이 전 파트에서 설명한 내용이지만 따로 통계에 포함되는 내용이기 때문에 간단하게 관련 내용 정리했다.

```typescript
declare class ExternalClass {
  // ...
}

const externalClass = new ExternalClass()

declare const ExternalObject: {
  test: () => void
}

ExternalObject.test()
```

개발 환경에 따라 서버 렌더링 또는 동적 렌더링을 통해 브라우저 환경에서 직접 생성되는 모듈을 사용할 경우 전역 설정을 통해 해당 타입을 지정했다. 이러한 변수들의 경우 실제 코드가 구현된 내용에 따라 타입을 지정해주었기 때문에 해당 모듈의 사용법이 변경되는 경우에 따라 타입을 변경해 줄 수 있도록 하자.

### 여러개의 인자 타입 설정

앞서 `rest parameter` 문법을 활용할 경우 `any[]` 타입을 통해 인자 타입을 설정해주었는데, 구현된 함수에서 인수에 접근하는 방법에 따라 코드 수정이 필요했던 내용을 정리했다.

```typescript
function test() {
  const args = Array.prototype.slice.apply(arguments)
  //...
}

test(1, 2, 3) // error! 인수 타입이 설정되어 있지 않음
```

`arguments` 객체를 활용해 인수값을 확인하는 함수이다. 위 함수를 사용하기 위해 인수 전달 시 인수 타입이 확인되지 않아 타입 에러가 발생한다.(여담이지만 `Array.prototype.slice` 메서드를 활용하기 보다는 `Array.from` 메서드를 활용하는걸 개인적으로 더 선호한다)

```typescript
function test(..._args: any[]) {
  const args = Array.prototype.slice.apply(arguments)
  //...
}
test(1, 2, 3) // success
```

위와 같이 `any[]` 타입를 가지는 `rest parameter` 인수를 추가해준뒤 `_` 문자를 추가해서 해당 인수의 사용 여부를 확인하지 않도록 수정했다. `arguments` 객체 대신 직접 `args` 인수에 접근해도 되지만 최대한 기존 코드가 유지되는 방향으로 리팩토링을 진행했기 때문에 이와 같은 방법으로 코드를 수정했다.

## 글을 마치며

지금까지 회사에서 진행 중인 JQuery 기반의 프로젝트를 TypeScript를 활용해 리팩토링을 진행 시 느꼈던 점들과 어떠한 문제점들을 확인할 수 있었는지에 대한 내용을 정리했다. 리팩토링 시 작업했던 코드량이 많았던 만큼 글로 남기려는 내용이 많아진 것 같아 예상했던 시간보다 오랫동안 글을 작성한 것 같다.

사실 미처 언급하지 못한 내용들도 많이 있지만 일일히 모두 내용을 정리하기에는 무리가 있을 것 같고, 개인적으로도 해야할 개발 공부가 많기 때문에 이쯤에서 글을 정리하고자 한다. 다만 시간이 생기면 틈틈히 글 내용을 업데이트할 수 있도록 하자.
