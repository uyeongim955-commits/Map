# 아스테르 SVG 지도 Worker

## 파일
- worker.mjs: SVG를 만드는 실제 Worker 코드. 지도 이미지가 코드 안에 포함됨.
- wrangler.jsonc: Worker 이름·실행 파일·호환 날짜·로그 설정.
- package.json / package-lock.json: 배포 도구와 버전 고정 정보.
- 단축어_템플릿.txt: 크랙에 등록할 /지도 지시문.

## GitHub를 거쳐 배포
1. GitHub에서 저장소를 만듭니다. 권장 이름은 aster-map입니다.
2. 이 ZIP을 풀고 파일들을 저장소 최상위에 업로드합니다. ZIP 자체를 올리거나 상위 폴더째 감싸지 않습니다.
3. Cloudflare 대시보드의 Workers & Pages에서 Git 저장소를 연결해 Worker를 생성합니다. GitHub 계정을 연결하고 방금 저장소를 선택합니다.
4. 프로젝트/Worker 이름은 aster-map으로 지정합니다. wrangler.jsonc의 name과 일치해야 합니다.
5. 루트 디렉터리는 저장소 최상위(/), 빌드 명령은 npm run check, 배포 명령은 npm run deploy로 지정합니다.
6. 배포합니다. 생성된 https://aster-map.본인계정.workers.dev 주소를 확인합니다.
7. 단축어_템플릿.txt의 WORKER_HOST 세 곳을 실제 호스트(https:// 제외)로 바꿔 크랙에 등록합니다.

이 구성은 GitHub에 코드를 보관하고 Cloudflare Worker에서 실행합니다. GitHub Pages에 정적 파일로 올리는 구성과 다릅니다.
실제 GitHub 저장소 생성·업로드·Cloudflare 연결·배포는 아직 수행되지 않았습니다.

## 확인
발급된 주소 뒤에 /1?p=8,8,0,15,13 을 붙여 엽니다.
지도와 아리엘·미하일·리비아·카셀·린의 위치 목록이 나타나면 정상입니다.
위 예시는 테스트용 위치이며 실제 RP 위치 기록이 아닙니다.

## 3장의 순서
- /1: 아리엘·미하일·리비아·카셀·린
- /2: 시론·아일라·로더릭·셀리나·루카스
- /3: 이레네·이블린·발테르·엘레나·로에나

## 위치 코드
0 미상 / 1 본관 / 2 강의실 / 3 교수실 / 4 학생회실 / 5 동아리실
6 도서관 / 7 금서고 / 8 훈련장 / 9 던전 입구 / 10~12 던전 1~3층
13 식당 / 14 의무실 / 15 남학생 기숙사 / 16 여학생 기숙사
17 아리안 호수 / 18 호수 주변 숲 / 19 정문 / 20 루엔 / 21 교외 / 22 사망

현재 시점에 확인된 위치만 표시합니다. 불명은 0, 지도 밖·사망은 목록만 표시합니다.
던전 인물은 입구에 핀을 찍고 목록으로 층수를 구분합니다.

## 데이터
요청에는 지도 번호와 고정 인물의 위치 번호만 사용합니다.
대화·페르소나·유저노트 전송 기능과 데이터베이스·쿠키·요청 로그 코드는 없습니다.
Workers Observability는 wrangler.jsonc에서 비활성화했습니다.

## 공식 안내
https://developers.cloudflare.com/workers/ci-cd/builds/
https://developers.cloudflare.com/workers/ci-cd/builds/configuration/
