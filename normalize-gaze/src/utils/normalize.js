"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConvertedRealScreenSize = exports.normalize = void 0;
function normalize(record) {
    console.log(record);
    Object.keys(record).forEach(function (subjectId) {
        var _a = record[subjectId], layout = _a.layout, rect = _a.rect, screenWidth = _a.screenWidth, screenHeight = _a.screenHeight;
        var orientation = 'portrait';
        if (!layout) {
            // TODO: landscape이고 layout이 1일경우 full screen 일 때 컨텐츠의 width가 작고 좌 정렬 했다면 답이 없음 orientation을 어떻게 처리할지 생각해보기
            var isLandscape = determineOrientationByRect(rect[0], screenWidth);
            if (isLandscape) {
                orientation = 'landscape';
                var realScreenSize = (0, exports.getConvertedRealScreenSize)({ width: screenWidth, height: screenHeight }, orientation);
                console.log(realScreenSize);
            }
        }
        // calculateLayout(, orientation)
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
exports.normalize = normalize;
function determineOrientationByRect(rects, screenWidth) {
    var maxRectWidth = Math.max.apply(Math, rects.map(function (r) { return r.x + r.w; }));
    return maxRectWidth > screenWidth;
}
function calculateLayout(projectRects, screenSize) {
    var screenWidth = screenSize.width, screenHeight = screenSize.height;
    var layout = projectRects.map(function (rect) {
        var isVertical = rect.length === 2 && rect[0].x === rect[1].x;
        var layout = [];
        if (isVertical) {
            // 세로 분할 레이아웃 계산
            layout = [
                { x: 0, y: 0, w: screenWidth, h: screenHeight / 2 },
                { x: 0, y: screenHeight / 2, w: screenWidth, h: screenHeight / 2 },
            ];
        }
        else {
            // 가로 분할 레이아웃 계산
            layout = [
                { x: 0, y: 0, w: screenWidth / 2, h: screenHeight },
                { x: screenWidth / 2, y: 0, w: screenWidth / 2, h: screenHeight },
            ];
        }
    });
    return layout;
}
var getConvertedRealScreenSize = function (size, orientation) {
    var isPortrait = orientation === 'portrait';
    return {
        width: isPortrait ? size.width : size.height,
        height: isPortrait ? size.height : size.width,
    };
};
exports.getConvertedRealScreenSize = getConvertedRealScreenSize;
// const cols2Rows1: Rect[] = [
//   {
//     x: 5,
//     y: 24.020588235294156,
//     w: 592.3529411764706,
//     h: 704.9,
//   },
//   {
//     x: 607.3529411764706,
//     y: 195.4327205882353,
//     w: 592.3529411764706,
//     h: 362.0757352941177,
//   },
// ];
// const cols1Rows2: Rect[] = [
//   {
//     x: 182.51457119067445,
//     y: 10,
//     w: 387.9120340892394,
//     h: 582.3529411764706,
//   },
//   {
//     x: 214.593467685893,
//     y: 612.3529411764706,
//     w: 323.75424109880225,
//     h: 582.3529411764706,
//   },
// ];
// console.log({ cols2Rows1, cols1Rows2 });
