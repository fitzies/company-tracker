import prisma from "./prisma";

const getCompany = async (id: number) => {
  const company = await prisma.company
    .findFirst({ where: { id } })
    .catch((err) => console.log("error", err));
  return company;
};

async function getMcStatuses(
  companyId: number
): Promise<RecruitWithStatuses[]> {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  // Query recruits with statuses where type is "MC"
  const recruits = await prisma.recruit.findMany({
    where: {
      companyId,
      statuses: {
        some: {
          type: "MC",
          endDate: {
            gt: yesterday, // Include statuses with endDate greater than or equal to today
          },
        },
      },
    },
    include: {
      statuses: true,
    },
  });

  // Filter statuses to include only those with type "MC" and endDate >= today
  const result: RecruitWithStatuses[] = recruits.map((recruit) => ({
    id: recruit.id,
    name: recruit.name,
    statuses: recruit.statuses
      .filter((status) => status.type === "MC" && status.endDate > yesterday)
      .map((status) => ({
        id: status.id,
        type: status.type,
        startDate: status.startDate,
        endDate: status.endDate,
        remarks: status.remarks ?? "",
      })),
  }));

  return result;
}

async function getStatuses(companyId: number): Promise<RecruitWithStatuses[]> {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  // Query recruits with statuses where type is "LD" or "Custom Status"
  const recruits = await prisma.recruit.findMany({
    where: {
      companyId,
      statuses: {
        some: {
          type: {
            in: ["LD", "Custom Status"], // Include only statuses with these types
          },
          endDate: {
            gt: yesterday, // Include statuses with endDate greater than or equal to today
          },
        },
      },
    },
    include: {
      statuses: true,
    },
  });

  // Filter statuses to include only those with type "LD" or "Custom Status" and endDate >= today
  const result: RecruitWithStatuses[] = recruits.map((recruit) => ({
    id: recruit.id,
    name: recruit.name,
    statuses: recruit.statuses
      .filter(
        (status) =>
          ["LD", "Custom Status"].includes(status.type) &&
          status.endDate > yesterday
      )
      .map((status) => ({
        id: status.id,
        type: status.type,
        startDate: status.startDate,
        endDate: status.endDate,
        remarks: status.remarks ?? "",
      })),
  }));

  return result;
}

async function getStatusesByType(
  companyId: number,
  statusType: string
): Promise<RecruitWithStatuses[]> {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  // Query recruits with statuses where type matches the provided statusType
  const recruits = await prisma.recruit.findMany({
    where: {
      companyId,
      statuses: {
        some: {
          type: statusType, // Include only statuses of the provided type
          endDate: {
            gt: yesterday, // Include statuses with endDate greater than or equal to today
          },
        },
      },
    },
    include: {
      statuses: true,
    },
  });

  // Filter statuses to include only those with the provided type and endDate >= today
  const result: RecruitWithStatuses[] = recruits.map((recruit) => ({
    id: recruit.id,
    name: recruit.name,
    statuses: recruit.statuses
      .filter(
        (status) => status.type === statusType && status.endDate > yesterday
      )
      .map((status) => ({
        id: status.id,
        type: status.type,
        startDate: status.startDate,
        endDate: status.endDate,
        remarks: status.remarks ?? "",
      })),
  }));

  return result;
}

export { getCompany, getMcStatuses, getStatuses, getStatusesByType };
