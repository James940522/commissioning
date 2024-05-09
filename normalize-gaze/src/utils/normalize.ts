import {
  AggregatedRecords,
  AssetOrientation,
  GazeData,
  InvalidGazeData,
  Records,
  Rect,
} from '../types/data';

// import dummyProject from '../dummy/project-landscape-2layout-cols.json';
// import dummyRecords from '../dummy/records-landscape-2layout-cols.ㄴㄴjson';
// import dummyProject from '../dummy/project-landscape-2layout-rows.json';
// import dummyRecords from '../dummy/records-landscape-2layout-rows.json';
// import dummyProject from '../dummy/project-portrait-1layout.json';
import dummyRecords from '../dummy/records-portrait-1layout.json';

import {
  calculateLayout,
  getConvertedRealScreenSize,
  determineOrientationByRect,
  calculateGaps,
  findLayoutIndex,
} from './nomalize-utils';

const METHOD = 'LocalMax';

//! @@@@@@@@@@@@@@@@ 실패작 코드 @@@@@@@@@@@@@@@@
/**
 *
 * canvas는 프론트에서 하드하게 정해놓은 screen size임
 * Gaze와 FilterOutput 좌표는 screen 기준임
 * Rect의 좌표는 이미지의 좌측 상단을 기준
 * Layout의 좌표는 해당 screen을 row col로 나눴을 때 각 나눠진 layout의 좌측 상단을 기준
 * 이 gaze와 filterOutput의 좌표를 각 layout 내부의 rect 좌표 퍼센티지로 변환해야함
 *
 * 근데 gaze와 filterOutput의 좌표를 퍼신티지로 변경해두면
 * 만약에 gaze 와 fixation은 괜찮을 것 같은데
 * saccade는 어떻게 처리해야할지 모르겠다. sx sy ex ey는 startX startY endX endY인데
 * startX startY endX endY가 각각 다른 layout에 속해있다면 어떻게 처리해야할지 모르겠다.
 *
 * 각 좌표가 어느 Rect에 속하는지도 같이 저장해야하나?
 *
 * 가장 우선적으로 고려해야할 부분은 하나의 gaze의 값을 정확한 퍼센티지 좌표로 변환하는 것
 * 두 번째는 하나의 gaze의 값을 변환할 때 시간 복잡도를 최소화 하는 것이다.
 *
 * 각 record에서 가지고 있는 screenSize에 layout이 있다면 그 layout으로 screen 영역을 나누고
 * 그 layout 내부에서 rect의 좌표를 이용하여 gaze가 그 layout 내부에서 어느 위치에 있는지 퍼센티지로 치환
 *
 * */
export function normalize(record: Records) {
  Object.keys(record).forEach(subjectId => {
    const participantRecord = record[subjectId];

    if (!participantRecord) return;

    const { rect, screenWidth, screenHeight, data, filteredData } =
      participantRecord;

    const layout: Rect[][] = participantRecord.layout || [];

    console.log(`${subjectId} start`);

    // TODO: landscape이고 layout이 1일경우 full screen 일 때 컨텐츠의 width가 작고 좌 정렬 했다면 답이 없음 orientation을 어떻게 처리할지 생각해보기
    const orientation: AssetOrientation = determineOrientationByRect(
      rect[0],
      screenWidth,
    );

    const realScreenSize = getConvertedRealScreenSize(
      { width: screenWidth, height: screenHeight },
      orientation,
    );

    if (!layout.length) {
      console.log('realScreenSize', realScreenSize);

      const calculatedLayout = calculateLayout(rect, realScreenSize);

      layout.push(...calculatedLayout);
    }

    /**
     * layout과 rect의 x, y 좌표의 차이값 (gap)을 구하고 screen의 width 대비 몇퍼센트인지 치환해놓음
     * 만약에 차이가 발생했다면 실제 그릴 때 그 좌표에서 gap 퍼센트를 gaze에 더해주면 됨?
     * 
      우선 알아둬야할건 gaze의 x, y, sx, sy는 screen size 기준
      
      예를 들어, 화면이 1920x1080이라면 gaze의 좌표는 그 내부안의 값인것이지

      그리고 모든 디바이스는 gap이 있을 수 있고 없을 수 있어

      rect와 layout의 gap이 있어도 한 축만 있을거야 아마 x가 있다면 y는 0, y가 있다면 x는 0

      rect와 layout의 gap이 몇인지를 x와 y를 계산해

      gaze의 좌표에서 우선 gap만큼 빼주고 저장 해

      그 다음 gap을 screen의 x면 width, y면 height의 몇퍼센트 값인지를 기억해두고,

      나중에 그려낼 때는

      gaze의 x y를 본인의 스크린의 몇퍼센트 위치인지 퍼센티지로 변환하고

      실제 그려진 box 크기에 그 퍼센티지를 적용해서 gaze를 찍어내지

      이 때 gap이 있다면 그 gap도 box 크기에 그 퍼센티지를 적용해서 값을 도출해내고

      그 gaze 좌표에 더해주는거야
     * 
     * 
     * 
     */

    console.log('layout', layout);
    console.log('rect', rect);
    const gapList: { x: number; y: number }[][] = calculateGaps(rect, layout);
    console.log('gapList', gapList);

    const normalizedData: Array<InvalidGazeData | NormalizedGaze> = data.map(
      gaze => {
        // 0. invalid한 gaze라면 그냥 반환
        if (gaze.x === null || gaze.y === null) return gaze;

        // 1. 해당 gaze가 어느 layout에 속하는지 찾음
        const { assetIndex } = gaze;
        const currentLayouts = layout[assetIndex];

        const layoutIndex = findLayoutIndex(currentLayouts, {
          x: gaze.x,
          y: gaze.y,
        });

        // 찾은 layout 배열 내에서 gaze가 속하는 layout을 찾음

        console.log(layoutIndex, 'layoutIndex');
        if (layoutIndex === -1) {
          return {
            ...gaze,
            layoutIndex: -1,
          };
        }

        // layout 인덱스를 이용해서 gap을 찾아서 gaze에 좌표에 빼줌 이 때 gaze에 그 layout의 인덱스를 저장해놓음
        const gap = gapList[assetIndex][layoutIndex];

        const normalizedGaze: NormalizedGaze = {
          ...gaze,
          layoutIndex,
          x: gaze.x - gap.x,
          y: gaze.y - gap.y,
          sx: gaze.sx - gap.x,
          sy: gaze.sy - gap.y,
        };

        // 2. 저장한 gaze의 좌표를 반환
        return normalizedGaze;
      },
    );

    // filteredData도 같은 방식으로 처리
    const normalizedFilteredData = filteredData[METHOD].map(filterOutput => {
      const { type, assetIndex } = filterOutput;

      const currentLayouts = layout[assetIndex];

      switch (type) {
        case 'fixation': {
          const layoutIndex = findLayoutIndex(currentLayouts, {
            x: filterOutput.x,
            y: filterOutput.y,
          });

          if (layoutIndex < 0) {
            return { ...filterOutput, layoutIndex };
          }

          const gap = gapList[assetIndex][layoutIndex];

          return {
            ...filterOutput,
            x: filterOutput.x - gap.x,
            y: filterOutput.y - gap.y,
            layoutIndex,
          };
        }
        case 'saccade': {
          const sLayoutIndex = findLayoutIndex(currentLayouts, {
            x: filterOutput.sx,
            y: filterOutput.sy,
          });

          const eLayoutIndex = findLayoutIndex(currentLayouts, {
            x: filterOutput.sx,
            y: filterOutput.sy,
          });

          if (sLayoutIndex < 0 || eLayoutIndex < 0) {
            return { ...filterOutput, sLayoutIndex, eLayoutIndex };
          }

          return {
            ...filterOutput,
            sx: filterOutput.sx - gapList[assetIndex][sLayoutIndex].x,
            sy: filterOutput.sy - gapList[assetIndex][sLayoutIndex].y,
            ex: filterOutput.ex - gapList[assetIndex][eLayoutIndex].x,
            ey: filterOutput.ey - gapList[assetIndex][eLayoutIndex].y,
            sLayoutIndex,
            eLayoutIndex,
          };
        }

        default: {
          return filterOutput;
        }
      }
    });
  });

  type NormalizedGaze = GazeData & {
    layoutIndex: number;
  };
}

normalize(dummyRecords as AggregatedRecords);
