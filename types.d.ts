type RecruitWithStatuses = {
  id: string;
  name: string;
  statuses: {
    id: number;
    type: T;
    startDate: Date;
    endDate: Date;
    remarks?: string;
  }[];
};
