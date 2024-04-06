import {
  AggregatedRecords,
  AssetOrientation,
  Records,
  Rect,
} from '../types/data';

// import dummyRecords from '../dummy/records-landscape-2layout-cols.json';
// import dummyProject from '../dummy/project-landscape-2layout-cols.json';
// import dummyRecords from '../dummy/records-landscape-2layout-rows.json';
// import dummyProject from '../dummy/project-landscape-2layout-rows.json';
import dummyRecords from '../dummy/records-portrait-1layout.json';
import dummyProject from '../dummy/project-portrait-1layout.json';

import {
  calculateLayout,
  getConvertedRealScreenSize,
  determineOrientationByRect,
} from './nomalize-utils';

export function normalize(record: Records) {
  Object.keys(record).forEach(subjectId => {
    const participantRecord = record[subjectId];

    if (!participantRecord) return;

    const { rect, screenWidth, screenHeight } = participantRecord;

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

    console.log('layout', layout);
  });

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
   *
   * */

  // do somethings
}

normalize(dummyRecords as AggregatedRecords);
