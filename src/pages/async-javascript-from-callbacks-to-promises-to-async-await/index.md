---
title: 비동기 자바 스크립트의 진화 - Callbacks에서 Promises, Async / Await 로
date: '2018-10-31'
mainImage: './evolutionOfAsync.png'
tags: ['javascript']
translation: {
  title: 'The Evolution of Async JavaScript: From Callbacks, to Promises, to Async/Await',
  link: 'https://tylermcginnis.com/async-javascript-from-callbacks-to-promises-to-async-await/'
}
---

> 이는 [Advanced JavaScript](https://tylermcginnis.com/courses/advanced-javascript/) 과정의 일부입니다. 이 게시물을 원한다면 그것을 확인하십시오.

## 비디오

<iframe width="864" height="486" src="https://www.youtube.com/embed/gB-OmN1egV8" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## 포스트

제가 가장 좋아하는 사이트 중 하나는 [BerkshireHathaway.com](http://www.berkshirehathaway.com/)입니다. 이 사이트는 단순하고 효과적이며 1997 년에 시작한 이래로 그 업무를 잘 수행해 왔습니다. 더 놀라운 것은, 지난 20 년 동안 이 사이트가 한번도 버그를 가져본 적이 없을 가능성이 높습니다. 왜일까요? 모두 정적이니까요. 20 년 전에 출시 된 이래로 거의 동일합니다. 모든 데이터가 프론트 영역에 있으면 사이트를 쉽게 구축할 수 있습니다. 불행히도, 오늘날 대부분의 사이트는 그렇지 않습니다. 이를 보완하기 위해 앱의 외부 데이터를 가져오는 "패턴"을 개발했습니다. 대부분의 경우와 마찬가지로 이러한 패턴에는 시간이 지남에 따라 변경되는 절충점이 있습니다. 이 게시물에서는 가장 일반적인 세 가지 패턴인 `Callbacks`, `Promises`, 및 `Async/Await` 의 장단점을 정리하고 역사적 맥락에서 그 중요성과 진행에 대해 설명합니다.

먼저 데이터 수집 패턴인 `Callbacks`의 OG 를 살펴보겠습니다.

## Callbacks

> _저는 당신이 콜백에 대해 전혀 모르고 있다고 가정하겠습니다. 제가 잘못 생각하고 있다면, 그냥 스크롤을 내려 주세요._

처음 프로그램을 배울 때 함수가 기계라고 생각하는게 도움이 되었습니다. 이 기계는 원하는 모든 것을 할 수 있습니다. 입력을 받아들이고 값을 반환 할 수도 있습니다. 각 기계에는 () 버튼이 있으며,이 버튼을 사용하여 기계를 작동시킬 수 있습니다.

```javascript
function add(x, y) {
  return x + y
}

add(2, 3) // 5 - 버튼을 누르고 기계를 작동시킵니다.
```

**내가** 버튼을 누르든, **당신**이 버튼을 누르든, **아니면 다른 사람**이 누르든 상관없습니다. 좋든 싫든 버튼을 누를 때마다 기계가 작동하게 됩니다.

```javascript
function add(x, y) {
  return x + y
}

const me = add
const you = add
const someoneElse = add

me(2, 3) // 5 - 버튼을 누르고 기계를 작동시킵니다.
you(2, 3) // 5 - 버튼을 누르고 기계를 작동시킵니다.
someoneElse(2, 3) // 5 - 버튼을 누르고 기계를 작동시킵니다.
```

위의 코드에서 `add` 함수를 `me`, `you` 및 `someoneElse` 의 세 가지 변수에 할당합니다. 원래의 `add` 와 우리가 생성한 각각의 변수가 메모리상의 같은 지점을 가리키고 있음을 주목하는 것이 중요합니다. 그들은 문자 그대로 똑같은 이름을 가지고 있습니다. 그래서 우리가 `me`,`you` 또는 `someoneElse`를 호출 할 때, 마치 `add` 를 호출하는 것과 같습니다.

자 이제 `add` 기계를 다른 기계로 옮기면 어떨까요? () 버튼을 누가 누르는지는 중요하지 않습니다. 누르면 작동하죠.

```javascript
function add(x, y) {
  return x + y
}

function addFive(x, addReference) {
  return addReference(x, 5) // 15 - 버튼을 누르고 기계를 작동시킵니다.
}

addFive(10, add) // 15
```

당신의 뇌는 이걸 좀 이상하게 보았을지도 모르지만 새로운 것은 없습니다. `add`에서 "버튼을 누르는" 대신 `add`를 `addFive` 에 전달하고 `addReference` 로 이름을 바꾼 다음 "버튼 누르기" 또는 호출합니다.

여기서는 JavaScript 언어의 몇 가지 중요한 개념을 중점적으로 설명합니다. 첫째, 문자열이나 숫자를 함수의 인수로 전달할 수있는 것처럼 함수에 대한 참조를 인수로 전달할 수도 있습니다. 이 작업을 수행할 때 인수로서 전달된 기능을 `콜백` 함수라고 하며 콜백 함수를 전달하려는 함수를 `고차 함수`라고 합니다.

어휘가 중요하기 때문에 여기에 제시된 개념과 일치하도록 변수의 이름이 변경된 동일한 코드가 있습니다.

```javascript
function add(x, y) {
  return x + y
}

function higherOrderFunction(x, callback) {
  return callback(x, 5)
}

higherOrderFunction(10, add)
```

이 패턴은 어디서든지 익숙할 겁니다. JavaScript [배열 메서드](https://tylermcginnis.com/javascript-array-methods-you-should-know/)을 사용한 적이 있는 경우 콜백을 사용한 것입니다. 만약 당신이 lodash 을 써본 적이 있다면, 당신은 콜백을 사용한 적이 있습니다. jQuery 를 사용해본 적이 있다면 콜백을 사용한 적이 있습니다.

```javascript
;[1, 2, 3].map(i => i + 5)

_.filter([1, 2, 3, 4], n => n % 2 === 0)

$('#btn').on('click', () => console.log('Callbacks are everywhere'))
```

일반적으로 콜백에는 두 가지 사용 케이스가 있습니다. 첫 번째, 예제 `.map` 와 `_.filter` 예제에서 볼 수있는 것은 하나의 값을 다른 값으로 바꾸는 멋진 추상화입니다. 우리는 "이봐, 배열과 함수가 있어. 그럼 내가 준 함수를 바탕으로 새로운 가치를 얻을 수 있어".라고 말합니다. 두 번째, jQuery 예제에서 볼 수 있는 것은 특정 시간까지 함수의 실행을 지연시키는 것입니다. "이봐, 여기 이 함수가 있어. ID 가 `btn` 인 요소를 클릭할 때마다 호출해". 이 두 번째 사용 사례는 "특정 시간까지 기능 실행을 지연"하는 것입니다.

지금은 동기적인 예제만 살펴 보았습니다. 이 글의 초반부에서 이야기했듯이, 우리가 구축한 대부분의 앱에는 필요한 모든 데이터가 포함되어 있지 않습니다. 대신 사용자가 앱과 상호 작용할 때 외부 데이터를 가져와야 합니다. 우리는 방금 어떻게 콜백이 이것의 훌륭한 활용 사례가 될 수 있는지 알게 되었습니다. 왜냐하면, 콜백은 "특정 시간까지 기능의 실행을 지연시킬 수 있게" 해주기 때문입니다. 데이터 가져 오기 작업을 위해 이 문장을 어떻게 적용 할 수 있는지 보려고 상상력을 많이 사용하지는 않았습니다. 특정 시간까지 함수의 실행을 지연시키는 대신, 필요한 데이터가있을 때까지 함수의 실행을 지연시킬 수 있습니다. 아마도 가장 대중적인 예인 jQuery 의 `getJSON` 메소드가 여기 있습니다.

```javascript
// updateUI 및 showError는 신경쓰지 않아도 됩니다.
// 그들은 말하는 대로 하는 척만 합니다.

const id = 'tylermcginnis'

$.getJSON({
  url: `https://api.github.com/users/${id}`,
  success: updateUI,
  error: showError,
})
```

사용자 데이터가 있어야 앱의 UI 를 업데이트할 수 있습니다. 따라서 우리는 어떻게 해야 할까요? 우리는 이렇게 말합니다. "이봐, 여기에 객체가 있어. 요청이 성공하면 계속 진행해 `success`을 호출하여 사용자 데이터를 전달해. 그렇지 않으면 오류 개체를 전달하여 `error`를 호출해. 각 메소드가 하는 일에 대해 걱정할 필요는 없어". 이것은 비동기 요청 시 콜백 사용에 대한 완벽한 데모입니다.

---

이 시점에서 우리는 콜백이 무엇인지, 동기 및 비동기 코드 모두에서 어떻게 콜백이 유익한지를 배웠습니다. 우리가 아직 이야기하지 않은 것은 콜백의 어두운 측면입니다. 아래에서 이 코드를 살펴보십시오. 무슨 일이 일어나고 있는지 말해줄 수 있나요?

```javascript
// updateUI, showError 및 getLocationURL은 신경쓰지 않아도 됩니다.
// 그들은 말하는 대로 하는 척만 합니다.

const id = 'tylermcginnis'

$('#btn').on('click', () => {
  $.getJSON({
    url: `https://api.github.com/users/${id}`,
    success: user => {
      $.getJSON({
        url: getLocationURL(user.location.split(',')),
        success(weather) {
          updateUI({
            user,
            weather: weather.query.results,
          })
        },
        error: showError,
      })
    },
    error: showError,
  })
})
```

도움이 된다면 [여기에서 라이브 버전](https://codesandbox.io/s/v06mmo3j7l)을 사용할 수 있습니다.

몇 겹의 콜백을 추가했습니다. 먼저 ID 가 `btn` 인 요소를 클릭할 때까지는 초기 AJAX 요청을 실행하지 말아야 합니다. 버튼을 클릭하면 첫 번째 요청을 합니다. 요청이 성공하면 두 번째 요청을 합니다. 해당 요청이 성공하면 두 요청에서 얻은 데이터를 전달하는 updateUI 메서드를 호출합니다. 처음에 본 코드를 이해했는지 여부에 상관없이, 객관적으로 이전 코드보다 읽기가 훨씬 더 어렵습니다. 이것은 "콜백 지옥"이라는 주제로 우리를 안내합니다.

인간으로서 우리는 자연스럽게 순차적으로 생각합니다. 중첩 콜백 내부에 중첩 콜백이 있으면 자연스러운 사고 방식에서 벗어나게 됩니다. 버그는 소프트웨어가 읽히는 방법과 자연스럽게 생각하는 방식 사이에 연결이 끊길 때 발생합니다.

소프트웨어 문제에 대한 대부분의 솔루션과 마찬가지로 "콜백 지옥"을 사용하기 쉽게 만들기 위해 일반적으로 규정된 접근 방식은 코드를 모듈화하는 것입니다.

```javascript
function getUser(id, onSuccess, onFailure) {
  $.getJSON({
    url: `https://api.github.com/users/${id}`,
    success: onSuccess,
    error: onFailure,
  })
}

function getWeather(user, onSuccess, onFailure) {
  $.getJSON({
    url: getLocationURL(user.location.split(',')),
    success: onSuccess,
    error: onFailure,
  })
}

$('#btn').on('click', () => {
  getUser(
    'tylermcginnis',
    user => {
      getWeather(
        user,
        weather => {
          updateUI({
            user,
            weather: weather.query.results,
          })
        },
        showError
      )
    },
    showError
  )
})
```

도움이 된다면 [여기에서 라이브 버전](https://codesandbox.io/s/m587rq0lox)을 사용할 수 있습니다.

좋아요, 함수명은 무슨 일이 일어나고 있는지 이해하는 데 도움이 되지만, 객관적으로 "더 나은" 건가요? 별로요. 우리는 "콜백 지옥" 의 가독성 문제에 대해 반창고를 썼습니다. 우리가 자연스럽게 순차적으로 생각하는 문제가 여전히 존재하며, 추가 기능이 있더라도 중첩 된 콜백으로 인해 순차적 사고 방식에서 벗어날 수 있습니다.

---

콜백의 다음 문제는 [제어의 역전](https://en.wikipedia.org/wiki/Inversion_of_control)과 관련이 있습니다. 콜백을 작성할 때, 콜백을 주고있는 프로그램이 책임이 있으며 프로그램이 정상적으로 작동 할 때(예정되어 있을 때) 호출 할 것이라고 가정하고 있습니다. 근본적으로 프로그램의 제어를 다른 프로그램으로 바꾸는 것입니다. jQuery, lodash 또는 심지어 vanilla JavaScript 와 같은 라이브러리를 다루는 경우 정확한 인수로 올바른 시간에 콜백 함수가 호출된다고 가정하는 것이 안전합니다. 그러나 많은 타사 라이브러리의 경우 콜백 함수는 사용자가 상호 작용하는 방식을 나타내는 인터페이스입니다. 타사 라이브러리가 의도적이든 실수로든 간에 콜백과 상호 작용하는 방식을 깨뜨릴 수 있습니다.

```javascript
function criticalFunction() {
  // 이 함수가 호출되고 올바른 인수를 갖는 것이 중요합니다.
}

thirdPartyLib(criticalFunction)
```

당신은 `criticalFunction` 을 호출하는 사람이 아니기 때문에, 언제 어떤 인수가 호출되는지를 제어 할 수 없습니다. 대부분의 경우 문제는 아니지만 큰 문제일 때가 있습니다.

---

## Promises

...작성 중
당신은 예약 없이 바쁜 식당에 가본 적이 있나요? 이런 일이 일어날 때, 식당은 테이블이 열릴 때 다시 연락할 방법이 필요합니다. 역사적으로, 식탁이 준비되었을 때 그들은 단지 여러분의 이름을 소리 지르곤 했습니다. 그래서 자연스럽게 그들은 생각이 하기 시작했습니다. 한 가지 해결책은, 여러분의 이름을 가져가는 것이 아니라, 테이블이 열리면 번호를 받아 문자를 보내는 것입니다.
