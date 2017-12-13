# Quasar App

> A Quasar project

## Build Setup

``` bash
# install dependencies
$ npm install

# serve with hot reload at localhost:8080
$ quasar dev

# build for production with minification
$ quasar build

# lint code
$ quasar lint
```

# 개발환경 구성

1. Git 설치
   1. https://git-scm.com/ 에서 installer 다운로드 받아 설치
2. Android Studio 설치
   1. https://developer.android.com/studio/index.html 에서 installer 다운로드 받아 설치
   2. Android API 25 level 설치
      Configure > SDK Manager > Android 7.1.1(25) Check > Apply 클릭
   3. 빈 프로젝트 생성
   4. Tools > Android > AVD Manager 이동
      1. Create Virtual Device… 클릭
      2. Next 클릭
      3. Nougat API level(25) Download 클릭
      4. Next 클릭
      5. Finish 클릭
3. NodeJs 설치
   1. https://nodejs.org/ 에서 installer 다운로드 받아 설치
4. Xcode 설치
   1. App Store 에서 설치
   2. License 동의
. 초기화
   1. ```sudo ./init.sh``` 실행
   2. 설치 확인
      1. ```cd vuejs/cordova``` 실행
      2. ```cordova requirements``` 실행
      3. 오류 내용 없으면 정상

# TODO

## 전역
- [ ] Quasar i18n

## 모델
- [ ] Pagination collection
- [x] Spring Rest Integration(Page, Sort)

## 목록
- [x] 조회조건(필터 쿼리스트링 화
- [x] 페이징 쿼리스트링 화
- [x] 소트 쿼리스트링 화
- [x] 모델(콜렉션)과 그리드 연계
- [ ] 조회조건 Responsive 반영
