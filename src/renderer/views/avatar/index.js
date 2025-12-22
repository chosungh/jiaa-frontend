import { Application, Ticker } from 'pixi.js';
import { Live2DSprite } from 'easy-live2d';

const init = async () => {
  const canvas = document.getElementById('live2d');

  // 1. PixiJS Application 초기화
  const app = new Application();
  await app.init({
    canvas: canvas,
    backgroundAlpha: 0,
    resizeTo: window, // 창 크기에 맞춰 자동 조절 (선택 사항)
  });

  // 2. Live2D 스프라이트 생성
  const live2dSprite = new Live2DSprite();

  // 3. 모델 초기화 (await를 사용하여 로딩이 완료될 때까지 대기)
  try {
    await live2dSprite.init({
      modelPath: '/live2d/Hiyori/Hiyori.model3.json',
      ticker: Ticker.shared
    });

    // 4. 초기화 성공 후 크기 및 위치 설정 (상반신 클로즈업)
    // 모델의 원래 비율을 유지하며 화면을 꽉 채우고 추가로 확대
    const scale = Math.max(app.screen.width / live2dSprite.width, app.screen.height / live2dSprite.height) * 5;
    live2dSprite.scale.set(scale);

    // 위치: X는 중앙, Y는 얼굴이 잘 보이도록 조정
    live2dSprite.x = (app.screen.width - live2dSprite.width) / 4;
    live2dSprite.y = (app.screen.height - live2dSprite.height) * 0.75; // 상단에 가깝게 배치 (하반신 잘림)

    // 5. 스테이지에 추가
    app.stage.addChild(live2dSprite);

    // 좌클릭 시 로그인/설정 열기 (이벤트 활성화: eventMode static)
    live2dSprite.eventMode = 'static';
    live2dSprite.on('pointertap', () => {
      window.electronAPI?.openLogin();
    });

    // 우클릭 컨텍스트 메뉴
    window.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      window.electronAPI?.showContextMenu();
    });

    console.log('easy-live2d initialized successfully!');
  } catch (error) {
    console.error('Live2D 모델 로드 실패:', error);
  }
}

// DOM이 완전히 로드된 후 실행
window.addEventListener('DOMContentLoaded', init);