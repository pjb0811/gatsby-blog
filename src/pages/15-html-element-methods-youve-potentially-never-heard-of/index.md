---
title: 당신이 결코 들어보지 못했을 15 가지의 HTML 요소 메소드.
date: '2018-11-03'
mainImage: './main.jpeg'
tags: ['html', 'javascript']
translation: {
  title: '15 HTML element methods you’ve potentially never heard of',
  link: 'https://hackernoon.com/15-html-element-methods-youve-potentially-never-heard-of-fc6863e41b2a'
}
---

## 초심자를 위한

HTML 과 DOM 의 차이점에 대해 알아 보겠습니다.

일반적으로 오래 쓰여진 `<table>` 요소는 확실히 HTML 입니다. 끝에 `.html`가 있는 파일에서 사용할 수 있습니다. 보기 및 작동 방식에 영향을 주는 일련의 속성이 있습니다.

그게 다입니다. 자바스크립트와는 아무 상관이 없습니다.

DOM 은 JavaScript 코드를 문서의 HTML 요소에 연결하여 객체와 같은 요소와 상호 작용할 수 있도록 합니다.

그것이 document-to-object 모델입니다.

HTML 의 모든 유형의 요소에는 **속성**을 정의하는 고유한 DOM '인터페이스'와 **메서드**가 있습니다(일반적으로 HTML 요소의 속성에 매핑됨). 예를 들어 `<table>`에는 `HTMLTableElement`라는 인터페이스가 있습니다.

다음과 같이 작성하여 특정 요소에 대한 참조를 얻을 수 있습니다.

```javascript
const searchBox = document.getElementById('search-box')
```

그런 다음 해당 유형의 요소에 사용할 수있는 모든 속성과 메서드에 접근할 수 있습니다. 예를 들어 `searchBox.value`를 사용하여 `value` 속성에 접근하거나 `searchBox.focus()`를 호출하여 box 에 커서를 넣을 수 있습니다.

DOM 에 관한 58 초 코스를 수강에 주셔서 감사합니다.

---

자, 문제는 대부분의 요소들은 흥미로운 방법을 가지고 있지 않다는 것입니다. 그래서 여러분이 거의 사용하지 않을 것들을 실제로 찾아내지 않는 한,전체적으로 흩어져 있는 작은 덩어리들을 놓치기 쉽습니다.

다행스럽게도 사양을 훑어보고 목록을 작성하는 것은 불행을 막을 수 있는 제가 가장 좋아하는 두 가지 방법입니다. 그래서 우리는 ...

---

함께 플레이하고 브라우저 DevTools 를 사용할 수 있는 경우 요소 트리에서 요소를 선택한 다음 콘솔에 `$0`를 입력할 수 있습니다. 이렇게 하면 선택한 요소에 대한 참조가 제공됩니다. 요소를 객체로 보려면 dir($0)를 입력합니다.

[콘솔에는 할 수 있는 일이 많이 있습니다.](https://developers.google.com/web/tools/chrome-devtools/console/command-line-reference)

<figure>
  <img src="./main.jpeg"/>
  <figcaption>
    Photo by <a href="https://unsplash.com/photos/5FUPG0ap5-o?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Holger Link</a> on <a href="https://unsplash.com/search/photos/element?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
  </figcaption>
</figure>

## #1 table methods

이 겸손한 table(여전히 웹사이트를 만드는 하나의 방법)은 이케아 테이블을 구성하는 것처럼 간단하게 만들 수 있는 꽤 좋은 방법을 가지고 있습니다.

여기 그들 중 한 무리가 있습니다.

```javascript
const tableEl = document.querySelector('table')

const headerRow = tableEl.createTHead().insertRow()
headerRow.insertCell().textContent = 'Make'
headerRow.insertCell().textContent = 'Model'
headerRow.insertCell().textContent = 'Color'

const newRow = tableEl.insertRow()
newRow.insertCell().textContent = 'Yes'
newRow.insertCell().textContent = 'No'
newRow.insertCell().textContent = 'Thank you'
```

`document.createElement()`가 단 하나도 보이지 않습니다.

`.insertRow()` 메서드는 테이블 요소에서 직접 호출하는 경우에도 `<tbody>`를 삽입합니다. 멋지지 않나요?

## #2 scrollIntoView()

당신도 아시다시피, URL 에 `#something`이 있을 때 페이지가 로드되면 브라우저가 페이지를 스크롤하여 해당 ID 가 있는 요소를 볼 수 있는 방법을 알고 있습니까? 이것은 정말 사려 깊은 이야기지만, 페이지가 로드된 후 그 요소를 렌더링하는 것은 효과가 없습니다.

다음과 같이 수동으로 이 동작을 다시 만들 수 있습니다.

```javascript
document.querySelector(document.location.hash).scrollIntoView()
```

## #3 hidden

자, 이것은 메소드가 아닙니다. 하지만 여러분이 이 장면 뒤에는 아마도 설정자가 있을 것이고 정말로 메소드라고 주장할 것입니다. 그렇죠?

어쨌든, 당신은 요소를 숨기기 위해 `myElement.style.display = 'none'`을 해본 적이 있나요? 이런, 이제 그만하세요!

`myElement.hidden = true`이면 됩니다.

## #4 toggle()

네, 이것도 정확히 요소 메소드가 아닙니다. 요소 속성에 대한 메서드이죠. 특히, `myElement.classList.toggle('some-class')`을 사용하여 요소에서 클래스 추가/제거를 전환하는 메소드입니다.

그리고 `if` 문을 조건부로 클래스를 추가 한 적이 있다면, 당신은 갇혀 있습니다.

두 번째 매개변수를 `toogle` 메서드에 전달했습니다. 해당 항목이 true 일 경우 클래스가 요소에 추가됩니다.

```javascript
el.classList.toggle('some-orange-class', theme === 'orange')
```

당신이 무슨 생각을 하는지 압니다. - 그건 정말로 'toggle'이라는 단어가 의미하는 것이 아닙니다. - 인터넷 익스플로러의 좋은 사람들은 두 번째 매개 변수 논리를 전혀 구현하지 않음으로써 동의하고 항의했습니다.

그래서 저는 그것을 되찾으려 합니. 당신은 갇혀 있서는 안됩니다. 무료입니다!

## #5 querySelector()

좋습니다. 이미 알고 계셨겠지만, 여러분 중 정확히 17%는 어떤 요소에서도 이 방법을 사용할 수 있다는 사실을 몰랐을 거라고 생각합니다.

예를 들어, `myElement.QuerySelector('my-class')`는 클래스가 `my-class`이고 `myElement`의 하위 항목인 요소만 일치합니다.

## #6 closest()

이것은 요소 트리를 찾는 모든 요소에서 사용할 수 있는 메서드입니다. 그것은 `querySelector()`의 반전과 같습니다. 그래서, 저는 이런 식으로 현재 섹션의 제목을 얻을 수 있었습니다.

```javascript
myElement.closest('article').querySelector('h1')
```

처음의 `<article>`까지 올라간 다음 첫 번째 `<h1>`로 되돌아갑니다.

## #7 getBoundingClientRect()

이것은 당신이 호출한 요소에 대한 약간의 디테일을 가진 깔끔한 작은 객체를 반환합니다.

```json
{
  "x": 604.875,
  "y": 1312,
  "width": 701.625,
  "height": 31,
  "top": 1312,
  "right": 1306.5,
  "bottom": 1343,
  "left": 604.875
}
```

다음 두 가지 방법을 주의하세요.

- 이것을 호출하면 리페인트가 발생합니다. 기기 및 페이지 복잡성에 따라 몇 밀리 초가 걸릴 수 있습니다. 따라서 반복적으로 호출하는 경우 이를 염두에 두십시오 (예 : 애니메이션).
- 모든 브라우저가 모든 것을 반환하지 않습니다. 왜 그랬을까요?

## #8 matches()

특정 요소에 특정 클래스가 있는지 확인하고 싶습니다.

최대 복잡성 :

```javascript
if (myElement.className.indexOf('some-class') > -1) {
  // do something
}
```

더 낫지만, 이 게시물과는 아무런 관련이 없습니다.

```javascript
if (myElement.className.includes('some-class')) {
  // do something
}
```

최상의 방법:

```javascript
if (myElement.matches('.some-class')) {
  // do something
}
```

## #9 insertAdjacentElement()

저는 오늘 이걸 배웠습니다! `appendChild()`와 비슷하지만, 자식 요소를 어디에 추가할 것인지 좀 더 통제할 수 있습니다.

`parentEl.insertAdjacentElement('beforeend', newEl)`는 `parentEl.appendChild(newEl)`을 수행하는 것과 동일하지만 `beforebegin` 또는 `afterbegin` 또는 `afterend`를 지정하여 해당 이름이 나타내는 위치에 배치 할 수도 있습니다.

이 정도의 통제력!

이건 밈입니다.

## #10 contains()

한 요소가 다른 요소 안에 있는지 알고 싶습니까? 저는 이것을 항상 알고 싶습니다.

예를 들어 마우스 클릭을 처리하고 모달 내부 또는 외부에서 발생했는지 알고 싶으면 (이렇게 닫을 수 있음) 다음과 같이 할 수 있습니다.

```javascript
const handleClick = e => {
  if (!modalEl.contains(e.target)) modalEl.hidden = true
}
```

여기서 `modalEl`은 제 모달에 대한 참조이고 `e.target`은 클릭 된 요소가 됩니다.

재미있는 사실은, 100% 이 일을 할 때, 저는 첫 번째 시도에서 로직을 잘못된 방향으로 만듭니다. 제가 영리해지고 저장을 시도하기 전에 다른 방법으로 돌리려고 노력하지만, 여전히 틀립니다.

## #11 getAttribute()

분명히 특별한 경우를 제외하고는 모든 요소 메소드 중에서 가장 쓸모없는 메소드입니다.

제가 위에서 언급 한 것을 기억 하시나요? `특성`은 일반적으로 `속성`에 매핑되죠.(비록 저는 이탤릭체가 아니라 볼드체를 사용했지만)

그렇지 않은 경우 중 하나는 `<href="/aminals/cat">Cat </a>`와 같은 요소의 `href` 속성입니다.

`el.href`는 예상대로 `/animals/cat`을 반환하지 않습니다. 이것은 `<a>` 요소가 [`HTMLHyperlinkElementUtils`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLHyperlinkElementUtils) 인터페이스를 구현하기 때문입니다. 이 인터페이스에는 `protocol` 및 `hash`와 같은 도우미 속성이 있어 링크 대상에 대해 알려줍니다.

이러한 유용한 속성 중 하나는 `href`로, 속성의 상대 URL 이 아닌 전체 트리밍을 포함한 _전체_ URL 을 제공합니다.

따라서 `href` 속성 내부에 문자 그대로의 문자열을 원한다면 `el.getAtribute('href')`를 사용해야 합니다.

## #12 the dialog element trio

비교적 새로운 `<dialog>` 요소는 두 가지 간단한 방법 및 한 가지 놀라운 방법을 가지고 있습니다. `show()`와 `close()`는 당신이 기대하는 대로 정확히 할 것이고, 그건 괜찮을 것이다.

그러나 `showModal()`은 당신이 원하는 대로 페이지를 중심으로 한 다른 모든 것 위에 `<dialog>`를 보여줄 것이다. `z-index` 또는 흐리게 표시되는 배경을 수동으로 추가하거나 esc 키를 눌러 닫아야 할 필요가 없습니다. 브라우저는 모달의 작동 방식을 알고 있으며 이 모든 것을 사용자에게 제공합니다.

정말 놀랍습니다.

## #13 forEach()

때로는 요소 목록에 대한 참조를 얻으면 `forEach()`를 사용하여 반복 할 수 있습니다.

`for()` 루프는 너무 2014 년 시절입니다.

페이지의 모든 링크에 대한 URL 을 로그 아웃하려고 한다고 가정 해 보겠습니다. 오류를보고 싶다면 이것을 할 수 있습니다.

```javascript
document.getElementsByTagName('a').forEach(el => {
  console.log(el.href)
})
```

아니면 이렇게 할 수 있습니다 :

```javascript
document.querySelectorAll('a').forEach(el => {
  console.log(el.href)
})
```

이것은 `getElementsByTagName` 및 다른 get... 메소드가 `HTMLCollection`을 리턴하기 때문입니다. 그러나 `querySelectorAll` 은 `NodeList`를 반환합니다.

`forEach()` 메소드(`keys()`, `values()` 및 `entries()`와 함께)를 제공하는 것은 `NodeList` 인터페이스입니다.

그다지 매력적이지 않은 배열을 얻으려고 노력하는 것보다 모두가 간단히 배열을 돌려 주면 정말 좋을 것입니다. 그러나 ECMA 의 좋은 사람들이 `Array.from()`를 주었기 때문에 두려움이 되지 않습니다. `Array.from()`는 배열과 유사한 돌연변이를 배열로 변하게 할 것입니다.

이렇게 하면 됩니다.

```javascript
Array.from(document.getElementsByTagName('a')).forEach(el => {
  console.log(el.href)
})
```

그리고 보너스: 배열을 생성하면 `map()` 및 `filter()` 및 `reduce()` 또는 다른 배열 메서드를 사용할 수 있습니다. 예를 들어, 아무 이유없이 외부 링크 배열을 반환하는 경우

```javascript
Array.from(document.querySelectorAll('a'))
  .map(el => el.origin)
  .filter(origin => origin !== document.origin)
  .filter(Boolean)
```

`.filter(Boolean)`를 쓰는 것은 미래에 내가 하는 일을 해결하기 위해 머리를 긁적거리게 만드는 가장 좋아하는 방법입니다.

## #14 Forms

`<form>`은 이미 알고있는 것처럼 `submit()` 메소드를 가지고 있습니다. 폼에 `reset()` 메서드가 있고 폼 요소에서 유효성 검사를 사용하는 경우 `reportValidity()`를 사용할 가능성이 약간 있습니다.

또한 도트 표기법이 있는 form 의 `elements` 속성을 사용하여 `name` 속성으로 요소를 참조 할 수도 있습니다. 예를 들어 `myFormEl.elements.email` 은 `<form>` 요소에 속한 `<input name = "email"/>` 요소를 반환합니다(‘속해 있다’는 말은 반드시 ‘자손’이라는 뜻은 아닙니다).

방금 거짓말을 했네요. 요소는 요소 목록을 전혀 반환하지 않습니다. _컨트롤_ 목록을 반환합니다(물론 배열이 아닙니다. 이유는 무엇일까요?).

예를 들어, 각각 동일한 이름의 `animal`을 가진 세 개의 라디오 버튼이있는 경우 `formEl.elements.animal` 은 해당 라디오 버튼 세트 (컨트롤 1 개, 요소 3 개)에 대한 참조를 제공합니다.

그리고 `formEl.elements.animal.value`는 어떤 라디오 버튼이 선택 되더라도 값을 반환합니다.

생각해 보면 신기한 구문입니다. 깨부수세요. 형제여: `formEl`은 요소이고, `elements`는 [`HTMLFormControlsCollection`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormControlsCollection)입니다. 실제로는 각 요소가 HTML 요소가 아닌 배열입니다. `animal`에는 여러 라디오 버튼이 설정되어 있습니다. 이 속성은 동일한 `name` 속성(이 용도로만 [`RadioNodeList`](https://developer.mozilla.org/en-US/docs/Web/API/RadioNodeList) 인터페이스가 있습니다)과 `value`가 컬렉션의 라디오 버튼 중 어떤 것이 든 선택되는 `value` 속성을 조회하기 때문에 결합됩니다.

부드럽군요.

## #15 select()

제가 미리 정리했어야 했는데 마지막 하나는 그렇게 흥미롭지 않군요. 어쨋든, `.select()` 메서드는 사용자가 호출한 입력에 관계없이 모든 텍스트를 선택합니다.

영 별로네요.

---

읽어주셔서 감사합니다. 이 중 적어도 몇 가지는 여러분에게 새로웠고, 어쩌면 유용했을 수도 있습니다.

사용하기 전에 항상 브라우저 지원을 확인하고 화가 났을 때 눈썹을 다듬지는 마세요.
