# React Native Kakao login

## 리액트 네이티브 프로젝트 셋업하기
- creat react native app을 통한 bare expo 프로젝트. 추후 React-Native CLI로 셋팅하는 법까지 숙지하도록 하자.

- 설정 과정에서 문제가 많았지만 일단 arm환경의 문제인 것 같아 pod install을 수반하는 설치시 arch -x86_64 커맨드를 붙여서 셋업

- RCTBridge required dispatch_sync to load RCTDevLoadingView. This may lead to deadlocks 문제가 자꾸 발생. ios/AppDelegate.m 파일 수정

## 웹과 모바일의 로그인/OAuth 플로우 차이점 파악하기
- 분명히 웹뷰를 사용하여 기존 웹(URI Redirect)과 같이 진행할 수 있어 보이지만 이미 카카오톡에 로그인 한 경우 등의 처리같은 인터랙션을 위해 모바일 환경에서는 클라이언트 사이드 SDK 사용이 먼저 고려된다고 일단 판단된다.

- 현재 dooboo ui 설치에 에러가 있어서 로그인 기능을 먼저 만들고 파악하는 것을 시작

 - PR을 열었다.

- ~~(bare expo 환경이 아니라면 다를 수도 있지만 일단 주어진 시간 내에 우선순위를 고려해 일단 할 수 있는 것부터 하기로 하자)~~


- PR이 merge 됐고 0.1.55 버전으로 올라감에 따라 설치가 가능해졌다. Yay!

---

## local 로그인 구현

- 아주 간단하게 서버/클라이언트 로그인 로직을 작성해서 JWT로컬 로그인 구현완료.
네비게이션은 일단 제외하고 화면 로그인 여부에 따라 둘로 나눠 로그인 페이지, 로컬 가입 페이지, 로그인 이후 페이지 이렇게 작업하기. 두부 ui 활용해서 만들기

- ios는 문제 없는데 android에서 axios 요청이 가지 않는 문제 발생 -> Platform.OS 를 통해서 안드로이드일 경우 10.0.2.2:${port} 로 변경 이 외에도 에뮬레이터 환경에 따라 다른 주소를 갖거나 다른 방법으로 해결해야 하는 경우도 존재하는 듯


## kakao 로그인 구현
- iOS 적용 성공. login() 함수는 token을 리턴하고 getProfile() 함수는 login함수가 정상적으로 실행되었었다면 유저 프로파일을 클라이언트 단에서 바로 가져올 수 있다.

- [AppDelegate.m](https://github.com/react-native-seoul/react-native-kakao-login/issues/193#issuecomment-806475082) 파일 설정 해당 코드 추가가 지금 당장 내 환경(Bare Expo)에서 필요한지는 일단 두고보자

- TODO: 안드로이드 및 카카오톡에 로그인 된 상태에서 되는지

- android 빌드 중 문제가 생겼다. 저번에 ios도 문제가 생겨서 빌드 폴더를 다 지우고 해결했었는데(m1 mac 문제) 추가로 작성됐던 네이티브 코드를 다시 설정하는 것도 어려웠고
이번에는 안드로이드 스튜디오에서 gradle버전을 올려버린 게 문제가 된 거 같다. expo환경에서는 하면 안되는 행동인듯. React Native에서 무언가 설치하기 전에 커밋하는 습관을 들여야겠다.
expo가 뭔가 더 불투명한 부분이 많은 것 같아 React Native CLI로 다시 프로젝트 생성해서 진행한다.
이거저거 깨먹으면서 배우는 게 많기는 하다.

---

## React Native CLI로 전환

## android 빌드 성공.
- 온갖 오류가 발생했고 java, gradle 버전이며 여러가지 수정하면서 진행했지만 끝내 결정적이었던 건 kotlin 버전을 1.5.0으로 변경한 것

- android AVD를 픽셀5로 올렸다가 또 엄청난 고통에 빠졌었다.
결국 wipe data를 통해 해결은 했으나 매 빌드마다 해줘야하나 싶어
에러 로그를 읽어본 결과 adv/advance setting의 internal storage 용량을 20GB이상 줘서 해결
다만 픽셀 2, 4 버전에서는 일어나지 않는 오류라(API 31) 그냥 픽셀4로 개발하기로 일단

- 실기기(LG V40)연걸 후 테스트 완료. 카카오톡 로그인 된 상태에서 절차 생략하고 바로 로그인 가능하다