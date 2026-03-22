/**
 * Interactive Pricing Component Module
 * 🚨 [의도] 전역 스코프(Global Scope) 오염을 방지하고 다른 스크립트와의 변수 충돌을 차단하기 위해, 즉시실행함수(IIFE) 패턴으로 내부 로직을 캡슐화합니다.
 */
(() => {
  /**
   * @typedef {Object} PricingStep
   * @property {string} views - 렌더링될 페이지뷰 수량 텍스트
   * @property {number} price - 해당 구간의 월별 기본 가격
   */

  /**
   * 🚨 [유지보수] 새로운 요금 단계(슬라이더 구간)를 추가하거나, 특정 뷰(Views)의 가격(Price) 비즈니스 정책이 변경될 경우 이 배열의 데이터만 수정하세요.
   * @constant
   * @type {PricingStep[]}
   */
  const PRICING_STEPS = [
    { views: "10K", price: 8 },
    { views: "50K", price: 12 },
    { views: "100K", price: 16 },
    { views: "500K", price: 24 },
    { views: "1M", price: 36 }
  ];

  /** 
   * 🚨 [유지보수] 연간 결제 시 적용되는 마케팅 할인율입니다. (현재 25% 적용 중이므로 0.25)
   * 할인 정책 변경 시 이 상수값 하나만 수정하면 전체 결제 로직에 일괄 반영됩니다.
   * @constant {number} 
   */
  const DISCOUNT_RATE = 0.25;

  /**
   * 🚨 [의도] DOM 요소 검색(querySelector)은 브라우저 성능을 소모하는 무거운 작업입니다.
   * 이를 방지하기 위해 초기 실행 시 필요한 요소들을 모두 객체에 캐싱(저장)해두고 재사용합니다.
   * @type {Object<string, HTMLElement|HTMLInputElement>}
   */
  const elements = {
    slider: document.querySelector('#volume'),
    pageviewsText: document.querySelector('#pageviews'),
    priceText: document.querySelector('#price'),
    toggleBtn: document.querySelector('#billing-toggle')
  };

  /**
   * 상태(State)를 기반으로 최종 가격을 산출합니다.
   * 🚨 [의도] 연간 결제 토글 상태를 확인하여, 참일 경우 기본 가격에 (1 - DISCOUNT_RATE)를 곱하게 해 정가에서 25% 할인된 금액이 도출되도록 마케팅 규칙을 수식화 했습니다.
   * @param {number} index - 현재 슬라이더의 위치 인덱스 데이터
   * @param {boolean} isYearly - 연간 결제 활성화 여부
   * @returns {number} 산출된 최종 결제 금액
   */
  const calculatePrice = (index, isYearly) => {
    const basePrice = PRICING_STEPS[index].price;
    return isYearly ? basePrice * (1 - DISCOUNT_RATE) : basePrice;
  };

  /**
   * 🚨 [의도] 숫자 타입의 가격 데이터를 사용자에게 보여주기 위해 toFixed(2)를 사용하여, 16달러라도 '$16.00'처럼 소수점 2자리로 떨어지는 일관성 있는 금융/결제 표기법을 유지합니다.
   * @param {string} views - 노출할 페이지뷰 텍스트
   * @param {number} price - 계산된 최종 가격
   */
  const updateDOM = (views, price) => {
    elements.pageviewsText.textContent = views;
    elements.priceText.textContent = `$${price.toFixed(2)}`;
  };

  /**
   * 슬라이더의 시각적 피드백(진행도)을 렌더링합니다.
   * 🚨 [유지보수] 슬라이더의 채워지는 궤적(Soft Cyan)이나 빈 부분(Light Grayish Blue)의 색상을 변경하려면 이 함수 내부의 hsl(...) 값을 직접 수정하세요.
   * @param {string|number} value - 현재 슬라이더의 값
   * @param {string|number} max - 슬라이더의 최대 범위 값
   */
  const updateSliderTrack = (value, max) => {
    // 🚨 [의도] 요소가 물리적으로 위치한 인덱스(value)와 총 길이(max)를 백분율(%)로 환산하여, CSS 그라데이션이 정확히 해당 위치까지만 색을 칠하도록 계산합니다.
    const percentage = (value / max) * 100;
    const trackStyle = `linear-gradient(to right, hsl(174, 77%, 80%) ${percentage}%, hsl(224, 65%, 95%) ${percentage}%)`;
    
    // 🚨 [의도] JS에서 DOM의 style 프로퍼티에 직접 접근해 CSS를 하드코딩하지 않고, CSS 변수(--track-bg)만 변경해줌으로써 디자인(CSS)과 로직(JS)의 관심사를 철저히 분리합니다.
    elements.slider.style.setProperty('--track-bg', trackStyle);
  };

  /**
   * 🚨 [의도] 사용자가 슬라이더나 토글을 조작할 때 파편화된 함수가 아닌 이 컨트롤러 하나로 흐름이 모이도록 중앙집중화 하였습니다.
   * 사용자 입력 수집 -> 객체 비즈니스 로직 호출 -> UI 렌더링 업데이트라는 애플리케이션의 핵심 단방향(One-Way) 사이클을 통제합니다.
   */
  const handleUpdate = () => {
    const index = parseInt(elements.slider.value, 10);
    const isYearly = elements.toggleBtn.checked;
    
    const currentViews = PRICING_STEPS[index].views;
    const finalPrice = calculatePrice(index, isYearly);

    updateDOM(currentViews, finalPrice);
    updateSliderTrack(elements.slider.value, elements.slider.max);
  };

  /**
   * 🚨 [의도] 모듈이 브라우저 메모리에 로딩되자마자 이벤트를 부착하고, 
   * 사용자가 마우스로 조작하기 전에도 HTML 상의 기본 상태(ex: 중앙 100K)가 올바르게 계산되어 화면에 최초 렌더링 되도록 즉시 1회 업데이트를 강제 실행합니다.
   */
  const init = () => {
    elements.slider.addEventListener('input', handleUpdate);
    elements.toggleBtn.addEventListener('change', handleUpdate);
    
    handleUpdate();
  };

  // 애플리케이션 초기 구동
  init();
})();
