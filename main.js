// [1] 데이터 보관소 만들기 (5단계 조회수 마다의 기본 가격 세팅)
// - 나중에 가격이 바뀌거나 새로운 구간이 추가돼도 여기 데이터 배열만 바꾸면 되게끔 유지보수성을 높였어요!
const pricingSteps = [
  { views: "10K", price: 8 },
  { views: "50K", price: 12 },
  { views: "100K", price: 16 },
  { views: "500K", price: 24 },
  { views: "1M", price: 36 }
];

// [2] 웹 문서 도화지(DOM) 위에서 우리가 조종하고 싶은 자동차(요소)들의 핸들을 잡습니다.
const slider = document.querySelector('#volume');
const pageviewsText = document.querySelector('#pageviews');
const priceText = document.querySelector('#price');
const toggleBtn = document.querySelector('#billing-toggle');

// [3] 화면의 정보(가격, 페이지뷰, 색칠된 선)를 즉각즉각 업데이트 해주는 메인 엔진 함수!
function updatePricing() {
  // 3-1. 슬라이더가 0~4번 중 몇 번째 구간을 가리키는지 숫자를 뽑아옵니다.
  const index = slider.value; 
  
  // 3-2. 그 숫자에 해당하는 구간의 뷰 수(100K 등)와 가격($16)을 배열에서 스윽 가져옵니다.
  let currentPrice = pricingSteps[index].price;
  const currentViews = pricingSteps[index].views;

  // 3-3. 할인 로직 (Toggle checked 검사) : 만약 연간 결제가 켜져 있는가?
  if (toggleBtn.checked) {
    // 맞다면 지금 가격의 곱하기 0.75 를 해줘서 25% 날려버립니다! (할인 혜택)
    currentPrice = currentPrice * 0.75; 
  }

  // 3-4. 찾은 정보들을 화면상에 글씨로 찍어줍니다.
  pageviewsText.textContent = currentViews;
  // toFixed(2) 로 항상 ".00" 소수점 둘째 자리까지 보이게 고정합니다 ($16.00 처럼 보이게)
  priceText.textContent = `$${currentPrice.toFixed(2)}`; 

  // 3-5. ★ 역동적인 슬라이더 연출 (동적 궤적 채우기)
  // 현재 값(slider.value)과 슬라이더가 이동가능한 총 길이(slider.max)를 비교해 자신이 몇 %를 왔는지 계산합니다.
  const percentage = (slider.value / slider.max) * 100;
  
  // 우리 위쪽 CSS 코드 기억나시나요? 
  // 그곳에 만들어 둔 CSS 변수 '--track-bg'에 `linear-gradient` (그라데이션 색상)를 꽂아 날려보내 줍니다.
  // 왼쪽부터 현재 % 까지는 Soft Cyan, 그 너머는 원래 브라우저의 회색 궤도로 칠하게 만들어버리는 놀라운 마술이죠!
  slider.style.setProperty('--track-bg', `linear-gradient(to right, hsl(174, 77%, 80%) ${percentage}%, hsl(224, 65%, 95%) ${percentage}%)`);
}

// [4] 귀 열어두기 (이벤트 감청소)
// 누군가 슬라이더(range)에 손가락을 대서 움직일 때(input) 마다 함수를 반복해서 뛰어가게 합니다.
slider.addEventListener('input', updatePricing);

// 누군가 결제 방식 변경 토글(checkbox)을 껐다 킬 때(change) 마다도 함수를 뛰어가게 합니다.
toggleBtn.addEventListener('change', updatePricing);

// [5] 새로고침 했을 때, 방금 만든 세팅이 기본으로 적용되어 화면에 보이게끔 시작 버튼을 1번 그냥 광클해줍니다.
updatePricing();
