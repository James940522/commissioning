export type ProjectStatus = 'active' | 'edit' | 'done';

export type AssetOrientation = 'portrait' | 'landscape';

export type TimerMethod = 'strict' | 'none';

export type AssetAlign = 'top' | 'bottom' | 'left' | 'right' | 'center';

export type ScaleType = 'scrollable-fit' | 'full-screen'; // 'fit-center'

export type QuestionType = 'multiple-choices' | 'checkbox' | 'short-answer';

export type AssetType = 'image' | 'video' | 'survey';

export type AssetLayout = { col: number; row: number };

export type TimerProperties = {
  method: TimerMethod;
  timer: number;
};

export type ImageProperties = {
  scaleType: ScaleType;
  align: AssetAlign;
};

export type QuestionProperty = {
  type: QuestionType;
  question: string;
  choices: string[];
  mcAnswer: number;
};

export type ImageBlockType = {
  id: string;
  key: string;
  src?: string;
  imageProperties: ImageProperties;
};

export type BaseAsset = {
  id: string;
  ownerId: string;
};

export type ImageAssetType = BaseAsset & {
  assetType: 'image';
  image: {
    imageBlocks: ImageBlockType[]; // null 임시 처리. 추후 삭제
    layout: AssetLayout;
    timerProperties: TimerProperties;
  };
};

export type VideoAssetType = BaseAsset & {
  assetType: 'video';
  video: {
    id: string;
    key: string;
    src?: string;
    isProcessed?: boolean;
    processedKey: string;
    duration: number;
    videoProperties: {
      autoSkip: boolean;
    };
  };
};

export type SurveyAssetType = BaseAsset & {
  assetType: 'survey';
  survey: {
    id: string;
    timerProperties: TimerProperties;
    questionProperty: QuestionProperty[];
  };
};

export type UploadPart = {
  PartNumber: number;
  ETag: string;
};

export type ProjectAsset = ImageAssetType | VideoAssetType | SurveyAssetType;

export type ImageBlockBlobs = { [blockId: string]: string };

export type BlobUrlStorage = Record<string, string | ImageBlockBlobs>;
