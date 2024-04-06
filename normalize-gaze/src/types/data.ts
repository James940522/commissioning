export type Gender = 'M' | 'F';

export type Rect = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export type Coordinate = {
  x: number;
  y: number;
};

export type AssetOrientation = 'portrait' | 'landscape';

export type TimelineIndex = number;

// 공통 속성을 갖는 기본 구조 정의
export interface GazeDataBase {
  // 타임라인의 인덱스와 동일한 값
  assetIndex: TimelineIndex;
  t: number;
  dt: number;
  sx: number;
  sy: number;
  out_of_screen: boolean;
  face_missing: boolean;
  is_valid_gaze: boolean;
  isBlink: boolean;
  pitch: number;
  yaw: number;
  roll: number;
  fx: number;
  fy: number;
  fz: number;
}

// 유효한 시선 데이터를 위한 타입, GazeDataBase를 확장하고 좌표 정보 추가
export type GazeData = GazeDataBase & {
  x: number;
  y: number;
};

// 유효하지 않은 시선 데이터를 위한 타입, GazeDataBase를 확장하고 x, y를 null로 설정
export type InvalidGazeData = GazeDataBase & {
  x: null;
  y: null;
};

export type GazeDataList = Array<GazeData | InvalidGazeData>;

export type Fixation = {
  x: number;
  y: number;
  minx: number;
  miny: number;
  maxx: number;
  maxy: number;
  st: number; // dt
  et: number;
  assetIndex: TimelineIndex;
  type: 'fixation';
  duration: number;
};

export type Saccade = {
  sx: number;
  sy: number;
  ex: number;
  ey: number;
  st: number;
  et: number;
  assetIndex: TimelineIndex;
  type: 'saccade';
};

export type Unknown = {
  t: number;
  dt: number;
  faceMissing: boolean;
  isBlink: boolean;
  isValidGaze: boolean;
  outOfScreen: boolean;
  assetIndex: TimelineIndex;
  type: 'unknown';
};

export type FilterOutput = Fixation | Saccade | Unknown;
export type FilterMethod = 'IVT' | 'LocalMax';

export type Choice = {
  key: string;
  choices: number[];
};

export type BasicRecords = {
  startTime: number; // 데이터 수집이 시작된 시간 (타임스탬프)
  id: string; // 기록의 고유 ID
  type: string; // 기록의 타입 (예: "default")
  subjectId: string; // 참여자의 고유 ID
  subjectName: string; // 참여자 이름
  gender: Gender; // 참여자 성별 ('M' 또는 'F')
  age: number; // 참여자 나이
  email: string; // 참여자 이메일
  versionName: string; // 데이터 수집에 사용된 앱의 버전
  deviceName: string; // 데이터 수집에 사용된 디바이스 이름
  screenWidth: number; // 디바이스의 화면 너비
  screenHeight: number; // 디바이스의 화면 높이
  screenDensity: number; // 디바이스 화면의 밀도 (dpi)
  cFailIndexFive: number; // 실패 지수 관련 데이터 (상황에 따라 다른 의미를 가질 수 있음)
  cFailProgressFive: number; // 실패 진행도 관련 데이터
  cResultFive: number[]; // 사용자 정의 실험 결과 데이터
  layout?: Rect[][]; // 데이터 수집 화면의 레이아웃 정보. 각 요소는 {x, y, w, h}로 구성된다.
  rect: Rect[][]; // 데이터 수집 화면의 영역 정보. 각 요소는 {x, y, w, h}로 구성된다.
  choice: Choice[]; // 사용자가 수행한 선택 관련 데이터
  data: GazeDataList; // 수집된 시선 데이터 배열
  filteredData: { [method in FilterMethod]: FilterOutput[] }; // 필터링된 시선 데이터. 필터링 방법에 따라 다른 데이터를 저장한다.
};

export type DataByTimelineIndex = Map<TimelineIndex, GazeDataList>;

export type FilteredDataByTimelineIndex = {
  IVT: Map<TimelineIndex, FilterOutput[]>;
  LocalMax: Map<TimelineIndex, FilterOutput[]>;
};

// BasicRecords에서 data와 filteredData를 제외한 타입 생성
type BasicRecordsWithoutData = Omit<BasicRecords, 'data' | 'filteredData'>;

// 새로 정의된 data와 filteredData를 포함하여 ParticipantTimelineData 타입 정의
export type ParticipantTimelineData = BasicRecordsWithoutData & {
  validity: number;
  data: DataByTimelineIndex;
  filteredData: FilteredDataByTimelineIndex;
};

export type DataBySubject = {
  [subjectId: string]: ParticipantTimelineData;
};

export type Records = {
  [subjectId: string]: BasicRecords;
};

//?@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

export type AggregatedRecords = {
  [subjectId: string]: BasicRecords;
};

export type ExtendedRecords = BasicRecords & {
  st: number;
  et: number;
  validity: number;
};

export type ParticipantGazeRecords = {
  [subjectId: string]: ExtendedRecords;
};

export type Size = {
  width: number;
  height: number;
};

export type DataTimeline = ParticipantGazeRecords[];

export type ChoiceAggregate = {
  [assetId: string]: {
    [choice: string]: string[];
  };
};

export type Participant = Pick<
  ExtendedRecords,
  'subjectId' | 'subjectName' | 'gender' | 'age' | 'deviceName' | 'validity'
>;

export type ExtendedParticipant = Participant & {
  isSelected: boolean;
};

export type CalcGaze = {
  x: number | null;
  y: number | null;
  t: number;
};

export type RectStorage = { [subjectId: string]: Rect[][] };
