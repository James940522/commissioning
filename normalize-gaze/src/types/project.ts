import { AssetOrientation, ProjectAsset, ProjectStatus } from './asset';

export type LastKey = {
  id: string;
  owner: string;
  createdAt: string;
};

export type ProjectQuery = {
  lastId: string | null;
  lastCreatedAt: string | null;
  tags: string | null;
  limit: number;
};

export type ProjectListResponse = {
  data: Project[];
  lastKey: LastKey;
};

export type Project = {
  id: string;
  pid: string;
  owner: string;
  status: ProjectStatus;
  name: string;
  description: string;
  tags: string[];
  post_password: string;
  orientation: AssetOrientation;
  participant: number;
  cost: number;
  target: number;
  assets: ProjectAsset[];
  createdAt: string;
  updatedAt: string;
};

export type UpdateProject = Omit<Project, 'id'>;

export type ProjectBasicInfo = Omit<
  Project,
  'assets' | 'createdAt' | 'updatedAt'
>;

export type Hashtag = {
  id: string;
  name: string;
};
