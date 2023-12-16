export interface IresJobsData {
  payload(arg0: string, payload: any): unknown;
  jobs: Job[];
  meta: Meta;
}
export interface IresSkillData {
  skill: Skill;
}
export interface Meta {
  next?: number;
  count: number;
  id?: string;
}

export interface Job {
  id: string;
  type: string;
  attributes: {
    title: string;
  };
  relationships: {
    skills: JobReference[];
  };
}
export interface JobReference {
  id: string;
}

export interface Skill {
  id: string;
  type: string;
  attributes: {
    name: string;
    type: string;
    importance: string;
    level: string;
  };
  relationships: {
    jobs: JobReference[];
    skills: JobReference[];
  };
}

export interface IinitJobs {
  jobs: Map<string, Job>;
  error?: any;
  meta?: Meta;
  isLoading?: boolean;
}
export interface IinitSkill {
  skills: Map<string, Skill>;
  isLoading?: boolean;
}

export interface CardJobProps {
  cardHeader: string;
  cardSkills?: (string | undefined)[];
  cardLink: string;
}

export const enum statusBar {
  idle = "idle",
  loading = "loading",
  success = "success",
  error = "error",
}

export interface LocalstorageProps {
  id: string;
  value: string;
}
