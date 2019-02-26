---
title: TypeScript를 활용한 JQuery 프로젝트 리팩토링 - 1부
date: '2019-01-03'
mainImage: './refactoring-ts.png'
tags: ['javascript', 'typescript']
---

> 처음 TypeScript를 접하고 사용해보면서 개인적으로 꼭 배워보고 싶은 언어(언어라고 표헌하긴 애매할 수 있지만 딱히 다른 단어가 떠오르지 않는다)라서 생각해서 개인적인 프로젝트 진행 시 TypeScript를 사용하려 노력했다. 아직 부족한 부분이 많고 앞으로도 계속 공부할 생각이며, 우선 지금까지 TypeScript를 활용한 프로젝트 중 하나에 대한 내용을 정리하려고 한다. 다른 사람에게 설명하기 보다는 스스로의 학습 내용을 정리하는 글이기 때문에 편한 말투로 작성했다.

글을 최초 작성하는 2019년 1월 3일 기준으로 대략 3개월 전인 2018년 10월 16일 부터 현재 일하고 있는 회사의 JQuery 기반의 프로젝트를 TypeScript로 리펙토링하는 작업을 진행했다. 이제 막 그 작업을 완료했다고 생각해여 리펙토링 과정에서 느끼고 배웠던 내용들을 정리해보려 한다. 사실 회사에서 주어진 업무가 아니라 스스로 TypeScript를 공부하기 위한 방향으로 진행했기 때문에 개인적인 프로젝트라고 보는게 맞을지도 모르겠다.

그래서 현재 회사에서 운영 중인 개발 환경 역시 TypeScript로 구현되어 있지 않다. 개인적인 학습 목표를 위해 진행한 내용이기도 하고 팀 내 다른 개발자 분들이 구현해 놓은 많은 양의 코드를 리펙토링 했기 때문에 이 전 코드와 기능 상 차이가 생길 수도 있고, 그럴 경우 운영 환경 배포 시 크리티컬한 이슈가 생길 수도 있다고 생각했다.

실제로 리펙토링 과정을 거치면서 TypeScript를 기준으로 봤을 때 다른 개발자분들이 미처 수정하지 못한 많은 오류들을 발견했고 그것들을 수정하면서 타입을 지정하는 걸 넘어선 코드의 변화가 일어나게 되었다. 다만 로컬환경에 확인한 바로는 정삭적으로 동작했기 때문에 실제 운영 환경에 적용되더라도 이상이 없을 것이라 개인적으로 생각하는 바이며, 이 후 가능할지는 모르겠지만 만약 실제 운영 환경에 반영되게 된다며 관련 내용을 업데이트 하도록 하자.

## 시작하기에 앞서

사실 JavaScript는 동적 타입의 언어이며 변수나 함수를 사용하는데 있어 타입에 대한 제약이 없기 때문에 다른 언어에 비해 장점일 수 있다. 처음 TypeScript를 사용해야 할까 고민한 이유도 _"TypeScript가 정말 필요할가?"_ 라는 생각이 들었다. 타입 확인을 통해 상당수의 버그를 잡을 수 있다고 하지만, TypeScript의 활용으로 잡을 수 있는 오류가 의미가 있을 만큼인지도 의문이 들었다.

결론적으로 TypeScript를 활용한 리팩토링 결과에 매우 만족하고 있다. 우선 리펙토링하면서 제일 크게 느낀점은 기존 개발 환경에서 파악하지 못한 개발자 중심적인 오류들이 생각보다 많았다는 것이다. 실제 운영 환경 상 오류는 없겠지만 각각 구현해놓은 여려가지 모듈들이 종속되었을때 요구하는 타입에 맞지 않게 사용되는 경우들을 확인했고, JavaScript에서 제공되는 기능들을 사용하는데 있어서도 잘못된 타입으로 사용되는 경우들을 확인할 수 있었다.

이러한 부분들이 개선될 수 있었던 이유가 제일 큰 장점으로 생각했다. 물론 TypeScript 문법를 새로 익혀야 하고, 그 중에는 이해하기 어려운 개념들도 분명 있으며 미처 활용하지 못한 기능들도 많다. 나 역시도 이 번 리펙토링 과정을 통해 조금이나마 활용법을 터득했지만 잘 쓴다고 생각하지 않는다. 또한 TypeScript는 버전 릴리즈가 자주 일어나는 언어이기 때문에 TypeScript를 완벽히 익히기 위해서는 많은 시간과 노력이 필요하다고 생각한다. 다만 TypeScript는 내가 아는 만큼 사용해도 무리가 없을만큼 느슨한 러닝 커브를 제공해주는 언어라 생각하며, 이번 리팩토링 과정도 아는 만큼만 활용하여 리팩토링을 진행했다.

이 전에 경험한 바로도 JavaScript 기반의 프로젝트는 규모가 커질수록 여러 모듈에 걸쳐있는 객체의 리팩토링 작업에 어려움을 겪은 적이 많다. 익히 아는 내용이지만 JavaScript는 런타임 시점에서만 오류를 확인할 수 있기 때문에 테스트를 거치지 않은 경우, 실제 운영 환경에 여지를 줄 수 있는 경우가 있다. `jslint`, `eslint` 와 같은 문법 확인 도구를 통해 개발 시점에서의 문법 오류는 확인 할 수 있지만, 말 그대로 문법 도구를 통해 확인할 수 있는 오류는 극히 제한적이다.

변수명이 오타가 나거나, number 타입이 아닌 변수를 연산한다던가, 존재하지 않는 객체 내 프로퍼티를 찾는다는 등 문법 상으로 알아내지 못하는 오류들을 확인할 수 있었다. 앞서 말한 내용들은 실제 리팩토링을 진행햐면서 확인된 내용들이며, 이러한 부분들은 TypeScript를 통해 개선할 수 있었다.

하지만 리팩토링을 통해 모든 오류를 확인했다고 해서 모든 버그를 완벽히 해결했다고 볼 수 없으며, 실제 운영 환경에서는 정상적으로 동작하는 코드에서 사용되는 타입이 리팩토링을 통해 설정된 타입 설정과 일치한다고 단정할 수도 없을 것 같다. 다만 개발 환경에서 빠르게 에러를 확인하고 그에 대한 대응을 할 수 있는 점이 마음에 들었고, 타입 지정을 통한 문서화가 이루어져 그에 따른 코드의 이해가 개인적으로 늘어났다. 실제로 기존의 주석으로 설명되어 있던 변수의 타입이 실제 사용되는 타입가 다른 경우도 꽤 발견하였고 기존 환경에서는 이러한 잘못된 주석때문에 에러로 이어질 수 있는 경우도 생기겠지만, 이런 부분도 리펙토링 과정을 통해 해결할 수 있었다.

다만 3개월이라는, 생각보다 많은 시간을 통해 리펙토링을 진행한 점은 조금 아쉽게 생각한다. 물론 아직 사용법에 능숙하지 않고, 수정해야 할 파일의 양도 많않지만 그래도 아직은 생각보다 손이 많이 가는 언어라 생각한다. 하지만 TypeScript를 활용한다면 초기 개발에 투자한 시간 이상으로 이 후 테스트와 유지보수에 누리게 될 이점이 더 클 것이라 확신한다. 특히 규모가 큰 프로젝트에서는 더욱 빛을 발하지 않을까 싶다.

## 기본 환경 설정

우선 처음 작업을 진행한 날짜의 기준은 최초 프로젝트의 브랜치를 생성한 커밋 일자 기준이며, 그 전부터 회사 프로젝트를 리팩토링 해보고 싶었는데 다른 회사 업무나 개인적인 프로젝트 진행, 블로그 글 정리 등 때문에 늦어진 감이 있다. 그리고 무엇보다 TypeScript를 사용하기 위한 기본적인 환경 설정이 생각보다 오래 걸렸다. 대충 생각나는 기간만 해도 2~3일 정도 걸렸던 것 같다.

그래도 기본 환경 설정이 완료되고 나니 리팩토링 과정에 속도를 낼 수 있었다. 기본 환경 설징 더 늦었다면 작업 기간이 더 늘어났을 것 같다. 우선 TypeScript를 활용하기 위한 초기 기본 환경 설정에 대한 내용을 정리해보자.

### package 설치

기존 프로젝트의 번들링 작업은 `webpack`를 활용하여 있기 때문에, `typescript` 설치 후 가이드에서 설명하는 내용대로 `tsconfig.json` 및 `webpack.config.js` 파일 내 설정을 수정하면 쉽게 사용할 수 있을 것이라 생각했다. 그런데 수정 후 빌드 실행 과정부터 생각치 못한 많은 에러를 접하게 되었다. 그래서 환경 설정에 대한 방법들을 웹에서 검색하며 확인했고 (이 과정이 꽤 오래 걸렸다), 그 결과 기존 프로젝트에 설정된 `webpack` 버전 및 빌드에 필요한 라이브러러와 `typescript` 버전간의 호환성 문제가 있는 것으로 파악했다. 그래서 기존 프로젝트 내 라이브러리의 버전 업그레이드 및 필요한 라이브러리의 설치를 진행하였고, 리펙토링 중간중간 타입 설정에 대한 라이브러리도 추가했다.

- `package.json`

```json
{
  // ...
  "dependencies": {
    // ...
    "webpack": "4.22.0"
    // ...
  },
  "devDependencies": {
    // ...
    "@types/crypto-js": "^3.1.43",
    "@types/jquery": "^3.3.22",
    "@types/jquery.cookie": "^1.4.31",
    "@types/jqueryui": "^1.12.6",
    "@types/swiper": "^4.4.1",
    "ansi-styles": "^3.2.1",
    "awesome-typescript-loader": "^5.2.1",
    "chalk": "^2.4.1",
    "loader-utils": "^1.1.0",
    "resolve-from": "^4.0.0",
    "typescript": "^3.1.3",
    "webpack-bundle-analyzer": "2.10.0",
    "webpack-cli": "^3.1.2",
    "webpack-dashboard": "^2.0.0"
    // ...
  }
}
```

우선 기존 프로젝트의 `webpack` 버전이 `2.3.3` 이었기 때문에 작업 당시 기준 최신 버전으로 업그레이드 해주었다. 기존에 설치된 라이브러리의 버전을 최대한 유지한 상태에서 환경 설정을 해주고 싶었지만 도저히 기존 `webpack` 버전에서 `typescript`의 최신 버전을 활용할 수 있는 방법을 찾지 못했다.

그렇다고 `typescript` 버전을 현재 `webpack` 버전이 맞춰 다운그레이드하고 싶지는 않았다. 리펙토링을 하고자 하는 이유가 TypeScript를 학습하기 위한 개인적인 목적이었고, 현재 운영 환경에서 사용 중인 `webpack` 버전도 개인적으로 마음에 들었지 않았기 때문에 `typescript`를 기준으로 관련 라이브러리를 모두 업그레이드 해주었다. `webpack`뿐만 아니라 `ansi-styles`, `chalk`, `loader-utils`, `resolve-from` 등 관련 라이브러리도 최신 버전으로 업그레이드 했다.

그 이외에 TypeScript 기반에서 구현에 필요한 라이브러리는 `jquery` 및 관련 라이브러리와 `crypto-js`, `swiper` 를 설치했다. 꼭 지켜야 할 사내 개발 운영 방침이라 할 수는 없지만 업무 진행 시 외부 라이브러리를 최소화하는 분위기여서 개발 관련 라이브러리 추가는 많지 않았다.

전체적인 라이브러리를 업그레이드하고 빌드 실행을 해보니 webpack 설정 파일에 반영한 내용대로 TypeScript 기반의 구현 코드를 정상적으로 번들링하는 것을 확인했다. 그럼 이제 변경된 webpack 설정 내용을 및 typescript 설정 내용을 알아보자.

### webpack 설정

리펙토링을 진행한 프로젝트에 경우 `webpack.config.js` 파일에서 개발과 운영환경에 관련된 여러가지 파일을 모듈로 호출해서 사용하고 있다. 따로 파일명을 언급하기 보다는 수정된 내용과 관련된 코드 영역만 설명했다.

```typescript
// ...
const entryResourcePcTs = entryLoader(PATHS.ENTRIES_DIR, 'pc/**/*.ts')
const entryResourceMobileTs = entryLoader(PATHS.ENTRIES_DIR, 'm/**/*.ts')
const entryResourcePcJs = entryLoader(PATHS.ENTRIES_DIR, 'pc/**/*.js')
const entryResourceMobileJs = entryLoader(PATHS.ENTRIES_DIR, 'm/**/*.js')

const entry = Object.assign(
  {},
  entryResourcePcTs,
  entryResourceMobileTs,
  entryResourcePcJs,
  entryResourceMobileJs
)
// ...
```

번들링 시 엔트리 파일을 설정해주는 영역에 `.ts` 파일을 추가한 뒤, 앤트리 영역 정보를 가지는 객체 리터럴에 추가할 수 있도록 수정했다. 이 후 `.js` 파일로 구성된 엔트리 영역은 모두 TypeScript로 리펙토링하였지만 혹시 모를 사이드 이펙트를 감안해 기존 엔트리파일을 불러오는 부분은 따로 제거하지 않았다.

```typescript
const { CheckerPlugin } = require('awesome-typescript-loader')
// ...

const baseConf = {
  // ...
  resolve: {
    extensions: ['.js', '.hbs', '.ts'],
    // ...
  },
  module: {
    rules: [
      // ...
      // typescript
      {
        test: /\.ts?$/,
        loader: 'awesome-typescript-loader',
        include: [ENV.PATHS.SOURCE_DIR],
        exclude: /node_modules/,
      },
    ],
  },

  plugins: [
    // awesome-typescript-loader
    new CheckerPlugin(),
    // ...
  ],
}
```

컴파일 시 `awesome-typescript-loader`를 활용할 수 있도록 모듈을 추가한 뒤 `extensions`, `rules`, `plugins` 설정을 수정했다.

```json
{
  // mode
  "mode": "development",

  // source-map
  // "devtool": "#source-map",
  "devtool": "source-map"
}
```

개발 환경에서 사용 중인 설정파일의 경우 업그레이드 된 버전에 맞게 `mode` 타입을 추가해주었고(운영 환경에 배포하는 작업은 아니기 때문에 운영 환경과 관련된 `mode`는 수정하지 않았다), 최신 버전의 가이드에 맞게 소스맵 설정을 수정했다. 그 외 업그레이드에 대한 기존 설정 파일에 대한 수정은 필요하지 않았다.

### TypeScript 설정

typescript의 경우 컴파일 및 빌드 시 webpack 설정에 크게 의존적이지 않다 보니 webpack 설정 영역 내에서 수정된 내용을 많지 않았다. 번들링 및 로더 설정과 관련된 내용만 수정했고, 그 외에 설정 정보는 `tsconfig.json` 파일을 통해 설정했다. 이 전 webpack 에서 설정이 필요했던 내용도 대부분 해당 파일에서 적용했다.

- `tsconfig.json`

```json
{
  "compilerOptions": {
    "outDir": "dist", // 컴파일 결과를 저장할 디렉토리
    "module": "commonjs", // 모듈 설정
    "target": "es3", // 컴파일 결과물에 대한 ECMAScript 버전 설정
    "lib": ["es2015", "dom"], // 컴파일에 포함될 라이브러리 파일 목록
    "strict": true, // 모든 엄격한 타입 검사 옵션을 활성화.
    "sourceMap": true, // 소스맵(*.map) 파일 생성 여부
    "allowJs": true, // 자바스크립트 파일 컴파일 허용 여부.
    "declaration": false, // .d.ts 파일의 생성 여부.
    "moduleResolution": "node", // 모듈 (검색)해석 방식 설정
    "forceConsistentCasingInFileNames": true, // 파일명에 대소문자 구분하지 않아도 되는 기능 사용 여부. 직역: 파일 이름에 일관된 casing 강제 적용
    "noImplicitReturns": true, // 함수의 모든 코드 경로가 값을 반환하지 않을 때 오류 보고
    "noImplicitThis": true, // 묵시적인 any 형식의 true 표현식에서 오류를 발생
    "noImplicitAny": true, // 묵시적 any 형식의 표현식과 선언에서 오류를 발생
    "strictNullChecks": true, // null과 undefined 타입 구분 여부
    "suppressImplicitAnyIndexErrors": true, // 인덱스 서명이 없는 개체 인덱싱에 대한 오류를 억제
    "noUnusedLocals": true, // 사용하지 않는 변수 오류 보고
    "noUnusedParameters": true, // 사용하지 않은 매개 변수에 대한 오류 보고
    "downlevelIteration": true, // ES5 또는 ES3를 대상으로 할 때 iterables를 확산, 소멸시키는 기능을 완벽하게 지원
    "baseUrl": ".", // 기본 경로 설정
    "paths": {
      "js/*": ["src/js/pc/*"],
      "_js/*": ["src/js/*"]
    } // 기본 경로를 기준으로 alias 설정
  },
  "include": ["src/entries/**/*", "src/js/**/*"], // 포함 대상 경로
  "exclude": [
    "node_modules",
    "app-config",
    "app-process",
    "assets",
    "assets-dev",
    "logs",
    "tools"
  ] // 제외 대상 경로
}
```

기본 경로 및 컴파일 경로 설정, ES 버전 설정 등 기존 프로젝트의 컴파일 정보와 맞추기 위한 설정을 완료하였다. 타입 설정 시 사용할 규칙의 경우 `any` 타입을 최대한 허용하지 않도록 설정하였다. 앞서 패키지 업그레이드 및 `webpack`, `typescript` 관련 설정을 모두 완료한 후에야 기대한대로 정상적인 컴파일 및 빌드 실행을 확인할 수 있었다.

그럼 이제 기존 코드를 리펙토링하면서 배웠던 점들을 정리해보자. 리펙토링 과정에 대한 설명에 앞서 `tsconfig.json` 파일에서 적용한 규칙에 대한 설명과 규칙 설정 여부에 따라 어떤 타입 에러가 일어나는지에 대한 설명은 하지 않겠다. 위 설정을 기준으로 기존의 JavaScript와 JQuery 로 구현된 코드를 어떠한 방식으로 타입을 설정하여 리팩토링을 진행했는지 정리하려 한다.

## Refactoring

우선 기존 프로젝트를 리팩토링하면서 기본적으로 이해한 내용부터 JQuery에서 제공하는 타입에 대한 내용을 중점으로 정리했다. 템플릿 영역에 경우 `handlebars` 라는 라이브러리를 사용하고 있으며, 이 역시 뷰 영역의 렌더링을 담당하는 JavaScript 기반 라이브러리지만 해당 라이브러리와 관련된 코드들은 리펙토링은 진행하지 않았다.

우선 `handlebars`를 통해 만들어진 파일 구조는 html 기반으로 되어있고 해당 파일을 TypeScript 기반으로 리펙토링하는 방법 또한 찾지 못했다. 그리고 만약 그 방법을 찾더라도 해당 라이브러리와 관련된 코드들을 리펙토링하기 위한 시간과 노력을 들이고 싶지 않았던 부분도 있다.

그럼 이제 리팩토링 과정에서 배운 내용들을 정리해보자. 정리하면서 설명이 부족했던 내용들은 나중에 수정할 수 있도록 하자.

### import, export

기존 프로젝트의 경우 `commonjs` 방식의 문법을 사용했으며 다른 모듈을 호출하거나 내보낼 때 `require`와 `module.exports` 문법으로 구현되어 있었다. ES6에서는 `commonjs` 문법 맟 언어 내부적으로 `import`, `export` 구문 모두 지원되기 때문에 처음 프로젝트 진행 시 모듈을 호출하는 부분을 따로 수정하지 않았다.

기존 파일을 `.ts` 확장자로 변경했을때도 관련 문법의 오류는 확인되지 않아 별다른 생각없이 작업을 진행했다. 하지만 작업을 진행하면서 뭔가 이상하다는 생각이 들었다. 생각보다 리팩토링에 대한 작업량이 많지 않았기 때문이다. 파일 내부에서 사용되는 코드들의 타입의 경우 오류 확인이 가능했지만 `require` 로 호출된 외부 모듈의 경우 타입 확인을 하지 않는다는 생각이 들었다.

그래서 우선 `require` 대신 `import` 구문으로 모듈을 호출해보니 호출된 모듈에서 내보낼 모듈을 찾을 수 없다는 에러를 확인했다. 해당 에러를 확인하니 조금 감이 오기 시작했다. 이후 호출한 모듈에서 내보내기 형식을 `module.exports` 대신 `export` 방식으로 변경하니 모듈을 호출한 영역에서 이 전에 확인하지 못했던 타입 에러들을 확인할 수 있었다. `jquery` 라이브러리 또한 `import` 방식으로 변경한 후 관련 모듈 사용에 대한 타입 에러들을 확인할 수 있다.

```typescript
// const foo = require('foo');
// const $ = require('jquery')

import foo = require('foo')
import * as $ from 'jquery'
// or
import $ = require('jquery')

const bar = () => {}

// module.exports = bar;
export default bar
```

위와 같이 기존 코드의 모듈 호출 방식을 `import`, `export` 방식으로 변경해주었다. 이 후 관련된 문서를 확인해보니 `import` 및 `export` 로 모듈이 연결되었을때만 해당 모듈을 인식하는 것으로 확인했다.
`require`를 통한 호출의 문제가 아니었기 때문에 해당 구문을 사용할 경우에도 `import` 선언을 통해 정상적인 동작을 확인할 수 있었다.

- `foo.ts`

```typescript
const $ = require('jquery')

const foo = () => {}

module.exports = foo
```

- `bar.ts`

```typescript
// error. 이미 선언의 전역 변수명 사용
const $ = require('jquery')

const bar = () => {}

module.exports = bar
```

이 후 파일들을 수정하다 보니 파일에 `import`, `export` 구문이 없을 경우 전역 범위에서 사용되는 모듈로 인식되어 위와 같이 여러개의 모듈에서 동일한 이름의 변수룰 선언하는 경우 오류가 발생하는 것을 확인했다.

앞서 설명한 내용들은 아주 기초적인 내용이라 볼 수 있지만, 나의 경우 다른 개인적인 프로젝트에서 TypeScript를 사용할 때는 자연스럽게 `import`, `export` 구문을 활용하다보니 `commonjs` 방식에서 어떻게 동작하는지에 대한 인식이 없었던 것 같고, 이 번 작업을 통해 배웠다고 생각한다.

### JQuery

`jquery`를 주로 활용한 프로젝트이다 보니 `jquery`와 관련된 타입 확인이 리펙토링의 주된 작업 내용이었다. 이와 관련해서 어떠한 내용들을 이해했는지 정리했다.

```typescript
let $foo: JQuery
$for = $('#foo')

let $bar: JQuery<HTMLElement>
$bar = $('#bar')

const baz = ($el: JQuery) => {
  return $el
}
```

`jquery`를 활용해 `DOM` 정보를 가지는 변수의 경우 `JQuery`라는 타입을 통해 변수 타입을 지정해 주어야 한다. 변수 선언 시 초기화가 되지 않은 변수 및 인자들의 경우 해당 타입을 지정해주었다. 해당 타입의 기본적인 제네릭 형식 인수로는 `HTMLElement` 타입이 선언된다. 해당 타입은 이벤트 타겟이거나 요소의 종류에 따라 변경이 필요하다.

### Type Assertion

`jquery`를 통해 `DOM` 요소에 접근하였다 하더라도 그 요소가 가지고 있는 속성에 접근할 경우 해당 요소는 개발자 관점에서 미처 예측하지 못한 수많은 타입을 가지게 된다. 어찌보면 JQuery 뿐만 아니라 JavaScript 환경 전체를 아우르는 기준이며, 이는 TypeScript의 강력한 타입 추론 기능의 장점이다.

사실 추론된 타입을 가장 일반적인 타입(Best common type)으로 볼 수 있지만, 경우에 따라서(특히 `DOM` 요소의 접근과 관하여) 개발자가 의도한 타입과 다르게 추론하거나 너무 보수적으로 추론하는 경우 개발자 관점에서 해당 타입을 단언(Type Assertion)해 줄 수 있다.

- `test.html`

```html
<div id="foo"></div>
<script src="test.js"></script>
```

- `test.js`

```typescript
// string 타입으로 추론
let id = ''

// error. attr 메서드의 반환 타입은 string | undefined
id = $('#foo')
  .attr('id', 'foo')
  .attr('id')
```

`foo`라는 `id` 속성를 갖는 요소의 `id`값을 확인하기 위해 `attr` 함수를 활용하는 예시 코드이다. 이미 해당 요소의 `id` 값은 개발자가 인지하고 있기 때문에 실제로 위와 같은 코드를 작성하진 않겠지만 타입을 추론하는 관점을 확인하기 위한 코드로 생각하면 된다.

우선 `let`으로 선언된 `id`라는 변수의 초기값을 `''` 으로 선언해주었다. 변수 초기화 시 지정된 값을 통해 `string` 타입이 추론된다. 이 후 `attr` 메서드를 통해 반환된 `id`값을 해당 변수값으로 설정하도록 했다. 개발자의 관점에서 보면 해당 `id`값은 당연히 `string` 타입이 되겠지만 TypeScript 환경에서는 에러가 된다.

`attr` 메서드는 접근한 요소가 어떠한 속성을 가지고 있지는 확인하지 않는다. `attr` 뿐만 아니라 `JQuery`에서 제공되는 모든 함수는 함수 그 자체의 기능에 대한 타입만을 추론한다(`DOM`에서 제공하는 메서드 또한 마찬가지이다). 설령 접근한 요소에 대한 속성을 미리 설정해준다해도 말이다.

```typescript
// type assertion
id = $('#foo').attr('id') as string
// or
id = <string>$('#foo').attr('id')
```

실제 리펙토링 시에도 `DOM`과 `jquery`를 활용한 메서드의 반환 타입이 개발자가 인지하고 있는 타입과 달라 수많은 에러를 확인할 수 있었다. 추론된 타입에 맞춰 코드를 수정해줄 수도 있지만 그럴 경우 생각 이상의 작업을 진행해야 했기 때문에 타입 단언을 통해 어떠한 타입을 추론해야 하는지 힌트를 주도록 했다.

위와 같이 `attr` 메서드의 반환 타입을 `as` 문법을 통해 `string`으로 지정해 주었다. 또는 제네릭 문법을 활용할 수 있다. 나의 경우 `as` 문법을 통해 타입을 단업했으며 개인적인 기호에 맞게 타입을 단언해주면 된다.

```typescript
// best common type
let id = ''
id = $('#foo').attr('id') || 'foo'
// or
let id: string | undefined
id = $('#foo').attr('id')
```

`DOM` 요소와 관련된 TypeScript 의 타입 추론이 마냥 틀리다고 볼 수 없는게 접근하려는 요소가 무조건 존재한다고 볼 수 없기 때문이며 접근하려는 속성 또한 존재 여부를 알 수 없기 때문이다. 만약 개발자가 인지하지 못하는 상황에서 실제로 존재하지 않는 요소나 속성에 접근하는 경우에는 추론된 타입과 같이 `undefined`를 반환하기 때문이다. 그렇게 때문에 위와 같이 추론될 타입에 맞추어 타입을 선언해주거나 비교 연산을 통해 타입에 맞는 기본값을 지정해주도록 구현해주는 것이 좋다고 볼수 있을 것이다.

실제 리팩토링 작업을 진행하면서 가장 많이 확인된 타입 에러 중 하나가 위와 같이 `DOM` 요소와 관련된 변수 타입 추론에 대한 오류였으며 전체 오류의 30% 이상을 차지하고 있었다. 해당 오류를 앞서 말한대로 일일히 코드 수정을 통해 타입을 맞춰주는 것이 좋겠지만 그러기에는 너무 많은 시간이 필요한 것도 사실이다. 그렇게 때문에 나 또한 코드의 흐름상이나 뷰 영역에서 예측 가능한 범위에서는 타입 단언을 활용했다.

### Event

```typescript
$('#foo').on('click', (e: JQuery.Event) => {
  // ...
})

$('#bar').on('click', (e: JQuery.Event<HTMLElement>) => {
  // ...
})

$('#baz').on('click', function (this: HTMLElement, e: JQuery.Event) => {
  // ...
})
```

이벤트 설정이 필요한 경우 이벤트 인자에 대한 타입은 `JQuery.Event`로 설정해주었다. 이벤트 타겟 요소의 타입 또한 타입의 인수로 지정해줄 수 있다. 콜백 함수를 통해 이벤트가 적용된 요소에 접근할 경우 `this` 객체에 타입을 설정해주었다.

```typescript
document.querySelector('body').addEventListener('click', (e: Event) => {
  // ...
})
```

`jquery` 이벤트 객체는 W3C 표준에 따라 브라우저별로 이벤트 객체를 표준화하기 때문에 `JQuery.Event` 타입을 활용해야하며, 기본 이벤트 객체의 경우에는 `Event` 타입을 지정해 주었다.

### Extending Interfaces & Global Variable

브라우저 환경에서의 웹 프로젝트 진행 시에는 `window` 객체 또는 전역변수의 접근 및 수정이 필요한 경우도 있으며, JavaScript 또는 JQuery 에서 제공하는 내장 기능을 커스텀하게 변경해야 할 경우도 있다.

나의 경우 앞서 말한 경우들이 리펙토링 과정에서 발견되었고 기본적으로 제공되는 타입을 활용해서는 해결할 수 없었기 때문에 `interface` 와 `extends` 문법을 활용하였다. JavaScript, JQuery 뿐만 아니라 특정 라이브러리 사용 시에는 경우에 따라 기본적으로 제공되어야 할 타입이 존재하지 않는 경우도 생겼기 때문에 특정 타입을 새롭게 만들어 주었다.

```typescript
interface CustomWindow extends Window {
  foo: () => void
}

window.foo = () => {}

// error! 기본적인 window 객체에서는 해당 프로퍼티를 찾을 수 없다.
const foo = window.foo()

// success
const foo = (window as CustomWindow).foo()
```

위와 같이 `window` 객체 내 필요한 프로퍼티를 선언하고 사용할 경우, 타입을 정의하지 않은 `window` 객체는 `Window` 타입으로 추론되며, `Window` 타입은 사용자가 재정의한 `foo` 라는 함수 타입의 프로퍼티를 확인할 수 없다.

앞서 말한 바와 같이 나의 경우 `Window` 객체를 상속받아 `foo`라는 프로퍼티의 타입을 확인할 수 있는 `CustomWindow` 라는 새로운 타입을 만들어주었고, 타입 단언을 통해 `window` 객체가 `CustomWindow` 타입을 추론할 수 있도록 했다.

```typescript
declare global {
  interface Window {
    foo: () => void
  }
}

window.foo = () => {}

// success
const foo = window.foo()
```

인터페이스를 확장하는 대신 `global` 객체를 통해 직접 `window` 객체의 타입을 지정해주는 것도 가능하다. 이럴 경우 타입 단언을 하지 않아도 정상적으로 새롭게 정의된 프로퍼티를 확인할 수 있다. `window` 객체야말로 브라우저 환경에서 전역으로 사용되는 변수이기 때문에 `global` 객체를 통해 타입을 정의해주는게 더 편할 수도 있지만 다음과 같은 단점을 가지고 있다.

- `foo.ts`

```typescript
declare global {
  interface Window {
    foo: () => void
  }
}

const foo = window.foo()
```

- `bar.ts`

```typescript
// 전역 범위로 설정된 타입을 사용한다.
const foo = window.foo()

// error! 이미 정의된 전역 변수의 타입과 일치하지 않는다.
window.foo = (value: string) => value
```

`global` 객체를 통해 정의된 `window` 객체는 파일별 모듈 영역을 넘어선 전역범위에 적용된다. `foo.ts` 에서 정의된 `window.foo` 타입은 `bar.ts` 라는 파일에서 접근하더라도 에러를 일으키지 않는다. 위와 같이 특정 파일에 재정의된 프로퍼티의 타입이 전역으로 설정되었을때, 만약 `foo.ts` 파일의 `global` 타입이 수정되는 경우 해당 파일의 설정된 전역 변수에 접근하는 모든 파일에서 의도하지 않는 에러를 발생시킬 수 있다. 이는 특정 모듈에 종속적인 관계를 가지는 구조가 되기 때문에 개인적으로 위 방법은 선호하지 않았다.

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

또한 `window` 객체가 아니며, 모듈에서 호출되지 않은 브라우저 환경의 변수의 경우에는 해당 변수에 대한 타입을 `declare` 문법을 통해 직접 설정해주었다.

```typescript
interface WindowUsingBlob extends Window {
  BlobBuilder: {
    new (): MSBlobBuilder
  }
}

new (window as WindowUsingBlob).BlobBuilder()

interface JQueryUsingSelector extends JQuery {
  selector: string
}

const selector = $('#foo' as JQueryUsingSelector).selector
```

`window` 객체뿐만 아니라, `jquery` 환경에서 제공되는 프로퍼티의 타입이 확인되지 않는 경우 직접 해당 변수에 대한 타입을 만들어 주었다. 이렇게 기존 타입을 확장해주는 경우가 꽤 있었는데 내가 제대로 사용법을 숙지하고 사용한다는 기준으로 봤을때는 제대로 된 타입을 제공하지 않는 것 같아 조금 아쉽게 생각하는 부분이다. 여튼, 이렇게 특정 타입을 새롭게 만들어 주는 경우 실제로 해당 기능이 제공되지는 꼭 확인한 후 작업을 할 수 있도록 하자.

### Generic

앞서 타입 단언 시 제네릭 문법을 활용하는 내용을 잠깐 언급했다. 이번에는 실제 제네릭 문법을 활용해 클래스 또는 함수의 인자 타입을 정의한 내용을 정리했다.

```typescript
class Foo() {
  constructor(container: string | HTMLElement | JQuery) {
    // error! 두개 이상의 타입인 경우 JQuery.PlainObject 타입으로 인식되며 string 타입으로 접근할 수 없음.
    const $el = $(container)
  }
}

new Foo('#foo')    // string
new Foo(document.querySelector('#foo')) // HTMLElement
new Foo($('#foo')) // JQuery
```

`jquery`의 경우 `DOM`의 접근하기 위한 선택자 설정 시 `string` 타입 뿐만 아니라 `HTMLElement`, `JQuery` 타입의 객체로도 접근이 가능하다. 하지만 TypeScript 환경에서 해당 타입으로 접근할 경우 에러가 발생한다. 두개 이상의 타입으로 정의된 선택자를 통해 `JQuery` 객체 호출 시 `string` 타입으로 선택자를 받을 수 없다는 에러가 발생한다.

이는 `@types/jquery` 에서 제공하는 `JQuery` 타입 내부의 오류일 수도 있고, 미처 내가 이해하지 못하는 타입 추론 로직이 있을 수도 있다. 사실 이러한 부분은 여러가지 의미로 `jquery` 뿐만 아니라 다른 라이브러리의 대한 타입 활용 시 생길 수 있는 문제라고 생각하며 TypeScript를 사용하는데 있어서 느끼는 단점 중 하나라고 생각한다.

```typescript
class Foo() {
  constructor(container: JQuery.PlainObject) {
    // success
    const $el = $(container)
  }
}

new Foo('#foo')    // string
new Foo(document.querySelector('#foo')) // HTMLElement
new Foo($('#foo')) // JQuery
```

위와 같이 여러 타입의 선택자를 사용할 경우 `JQuery.PlainObject`라는 타입으로 통해 에러를 처리할 수 있었다. 다만 이런 경우 어떠한 타입을 선택자를 넘겨주는지 눈으로 정확히 들어오지 않는 점이 마음에 들지 않았고 이러한 부분을 제네릭 문법을 활용하여 해결하였다.

```typescript
class Foo<container extends string | HTMLElement | JQuery>() {
  constructor(container: container) {
    // success
    const $el = $(container as JQuery.PlainObject)
  }
}

new Foo<string>('#foo')    // string
new Foo<HTMLElement>(document.querySelector('#foo')) // HTMLElement
new Foo<JQuery>($('#foo')) // JQuery
```

제네릭 문법을 통해 클래스 및 함수 호출 시 어떠한 인수 타입이 들어갈지 지정해주었으며 해당 모듈에는 인수가 어떠한 타입이 가지게 되는지 확인할 수 있도록 선언해주었다. 다만 해당 인수를 통해 `JQuery` 타입에 집근하는 경우 여전히 타입 에러가 발생하기 때문에 `JQuery.PlainObject` 타입으로 단언해주었다. 사실 선택자 접근과 관련된 타입 부분은 좀 더 확인이 필요한 부분이라 생각되면 나중에 기회가 된다면 관련 내용을 업데이트하자.

## 다음 과제

앞서 설명한 내용들뿐만 아니라 더 많은 부분들도 배웠던것 같은데 막상 글로 정리하려고 하니 기억이 나지 않는 부분도 있고 리펙토링을 진행한 파일이 많다 보니 일일히 뒤져보기에도 시간이 걸리는 것 같아 나중에 시간이 되면 다시 정리하자. 그리고 글을 정리하다보니 생각보다 내용이 길어져 파트를 나누기로 했다. 2부에서는 실제 리펙토링를 진행하면서 생겼던 타입 에러의 종류와 해당 에러들을 어떻게 처리했는지에 대한 내용으로 글을 정리하려고 한다.
