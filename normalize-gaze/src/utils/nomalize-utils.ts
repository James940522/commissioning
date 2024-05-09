import { AssetOrientation, Rect, Size } from '../types/data';

export function calculateLayout(
  projectRects: Rect[][],
  screenSize: Size,
): Rect[][] {
  const { width: screenWidth, height: screenHeight } = screenSize;

  const layout = projectRects.map(rect => {
    if (rect.length === 1) {
      // 전체 화면
      return [{ x: 0, y: 0, w: screenWidth, h: screenHeight }];
    }

    const layoutType = determineLayout(rect, screenSize);
    const totalRects = rect.length;
    const isRows = layoutType === 'rows';

    return rect.map((r, i) => {
      const padding = Math.min(r.x, r.y);

      console.log('padding', padding);

      if (isRows) {
        // 상하 레이아웃
        const rectHeight = screenHeight / totalRects;
        const rectY = rectHeight * i;
        return { ...r, x: 0, y: rectY, w: screenWidth, h: rectHeight };
      } else {
        // 좌우 레이아웃
        const rectWidth = screenWidth / totalRects;
        const rectX = rectWidth * i;
        return { ...r, x: rectX, y: 0, w: rectWidth, h: screenHeight };
      }
    });
  });

  return layout;
}

export const getConvertedRealScreenSize = (
  size: Size,
  orientation: AssetOrientation,
) => {
  const isPortrait = orientation === 'portrait';

  return {
    width: isPortrait ? size.width : size.height,
    height: isPortrait ? size.height : size.width,
  };
};

export function determineOrientationByRect(
  rects: Rect[],
  screenWidth: number,
): 'landscape' | 'portrait' {
  const maxRectWidth = Math.max(...rects.map(r => r.x + r.w));
  if (maxRectWidth > screenWidth) {
    return 'landscape';
  }

  return 'portrait';
}

export function determineLayout(
  rects: Rect[],
  screenSize: Size,
): 'cols' | 'rows' {
  if (rects.length === 1) {
    throw new Error('Rects must have more than one element.');
  }

  console.log('rects', rects);

  const firstRect = rects[0];
  const secondRect = rects[1];

  // 화면의 너비와 높이를 최대한 활용하는 Rect를 찾음
  const maxWidth = Math.max(...rects.map(rect => rect.x + rect.w));
  const maxHeight = Math.max(...rects.map(rect => rect.y + rect.h));

  // 화면 너비를 초과하는 Rect가 있는지 확인
  const exceedsScreenWidth = maxWidth > screenSize.width;
  // 화면 높이를 초과하는 Rect가 있는지 확인
  const exceedsScreenHeight = maxHeight > screenSize.height;

  // 화면 너비를 초과하지 않고, 높이는 초과한다면, 이는 'cols' 레이아웃
  if (!exceedsScreenWidth && exceedsScreenHeight) {
    return 'cols';
  }
  // 화면 높이를 초과하지 않고, 너비는 초과한다면, 이는 'rows' 레이아웃
  else if (exceedsScreenWidth && !exceedsScreenHeight) {
    return 'rows';
  }
  // 둘 다 초과하지 않는다면, 모든 Rect가 화면 내에 꽉 차게 배치된 것

  // 이 경우 추가적인 논리가 필요할 수 있음
  else if (!exceedsScreenWidth && !exceedsScreenHeight) {
    // 추가적인 판단 로직
    // 예를 들어, 가장 넓은 Rect가 화면의 대부분을 차지한다면 해당 방향으로 결정할 수 있음
    const dominantRect = rects.reduce((max, rect) =>
      rect.w * rect.h > max.w * max.h ? rect : max,
    );
    if (dominantRect.w >= dominantRect.h) {
      return 'cols';
    } else {
      return 'rows';
    }
  }
  // 화면의 높이와 너비를 모두 초과하는 경우는 이 로직으로는 처리할 수 없음
  else {
    throw new Error(
      'Unable to determine layout with given rects and screen size.',
    );
  }
}

export function calculateGaps(
  layouts: Rect[][],
  rects: Rect[][],
): { x: number; y: number }[][] {
  const gaps: { x: number; y: number }[][] = [];

  layouts.forEach((layoutRow, rowIndex) => {
    const rowGaps: { x: number; y: number }[] = [];
    layoutRow.forEach((layoutItem, itemIndex) => {
      const rectItem = rects[rowIndex][itemIndex];
      // x와 y 좌표 사이의 gap을 계산하고 배열에 추가합니다.
      const xGap = layoutItem.x - rectItem.x;
      const yGap = layoutItem.y - rectItem.y;
      rowGaps.push({
        x: xGap,
        y: yGap,
      });
    });
    gaps.push(rowGaps);
  });

  return gaps;
}

export const findLayoutIndex = (
  currentLayouts: Rect[],
  point: { x: number; y: number },
) => {
  const layoutIndex = currentLayouts.findIndex(
    layout =>
      point.x >= layout.x &&
      point.x <= layout.x + layout.w &&
      point.y >= layout.y &&
      point.y <= layout.y + layout.h,
  );

  return layoutIndex;
};

const cols2Rows1: Rect[] = [
  {
    x: 5,
    y: 24.020588235294156,
    w: 592.3529411764706,
    h: 704.9,
  },
  {
    x: 607.3529411764706,
    y: 195.4327205882353,
    w: 592.3529411764706,
    h: 362.0757352941177,
  },
];

const cols1Rows2: Rect[] = [
  {
    x: 182.51457119067445,
    y: 10,
    w: 387.9120340892394,
    h: 582.3529411764706,
  },
  {
    x: 214.593467685893,
    y: 612.3529411764706,
    w: 323.75424109880225,
    h: 582.3529411764706,
  },
];
