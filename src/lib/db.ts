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
        remarks: status.remarks ? status.remarks : "",
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
        remarks: status.remarks ? status.remarks : "",
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
        remarks: status.remarks ? status.remarks : "",
      })),
  }));

  return result;
}

async function getPlusOneStatuses(
  companyId: number
): Promise<RecruitWithStatuses[]> {
  const today = new Date();
  const yesterday = new Date();
  const twoDaysAgo = new Date();

  // Normalize dates to the start of the day
  today.setHours(0, 0, 0, 0);
  yesterday.setDate(today.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  twoDaysAgo.setDate(today.getDate() - 2);
  twoDaysAgo.setHours(0, 0, 0, 0);

  // Debugging: Print out normalized dates
  console.log("Today:", today.toISOString());
  console.log("Yesterday:", yesterday.toISOString());
  console.log("Two Days Ago:", twoDaysAgo.toISOString());

  // Query recruits with statuses where type is "LD" or "MC"
  const recruits = await prisma.recruit.findMany({
    where: {
      companyId,
      statuses: {
        some: {
          type: {
            in: ["LD", "MC"], // Include only statuses with these types
          },
          endDate: {
            gte: twoDaysAgo, // Include statuses with endDate >= twoDaysAgo
            lt: today, // Exclude statuses with endDate on or after today
          },
        },
      },
    },
    include: {
      statuses: true,
    },
  });

  // Debugging: Print out raw recruits data
  console.log("Raw recruits data:", recruits);

  // Return filtered recruits and statuses with adjusted remarks
  const result: RecruitWithStatuses[] = recruits.map((recruit) => ({
    id: recruit.id,
    name: recruit.name,
    statuses: recruit.statuses
      .filter((status) => {
        const statusEndDate = new Date(status.endDate);
        statusEndDate.setHours(0, 0, 0, 0);

        // Debugging: Print out status endDate and remarks calculation
        console.log("Status endDate:", statusEndDate.toISOString());

        return (
          ["LD", "MC"].includes(status.type) && // Ensure type is LD or MC
          statusEndDate >= twoDaysAgo && // Include statuses ending on or after twoDaysAgo
          statusEndDate < today // Exclude statuses ending on or after today
        );
      })
      .map((status) => {
        const statusEndDate = new Date(status.endDate);
        statusEndDate.setHours(0, 0, 0, 0);

        let remarks = "";
        if (statusEndDate.getTime() === yesterday.getTime()) {
          remarks = "+ 1";
        } else if (statusEndDate.getTime() === twoDaysAgo.getTime()) {
          remarks = "+ 2";
        }

        // Debugging: Print out status endDate and calculated remarks
        console.log(
          "Status endDate:",
          statusEndDate.toISOString(),
          "Remarks:",
          remarks
        );

        return {
          id: status.id,
          type: status.type,
          startDate: status.startDate,
          endDate: status.endDate,
          remarks,
        };
      }),
  }));

  return result;
}

// FOR COMMANDERS

async function getCommanderStatusByType(
  companyId: number,
  statusType: string[]
): Promise<RecruitWithStatuses[]> {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  // Query recruits with statuses where type matches the provided statusType
  const commanders = await prisma.commander.findMany({
    where: {
      companyId,
      statuses: {
        some: {
          type: { in: statusType }, // Include only statuses of the provided type
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
  const result: RecruitWithStatuses[] = commanders.map((commander) => ({
    id: commander.id,
    name: commander.name,
    statuses: commander.statuses
      .filter(
        (status) =>
          statusType.includes(status.type) && // Check if status.type is in statusType array
          status.endDate > yesterday
      )
      .map((status) => ({
        id: status.id,
        type: status.type,
        startDate: status.startDate,
        endDate: status.endDate,
        remarks: status.remarks ? status.remarks : "",
      })),
  }));

  return result;
}

export {
  getCompany,
  getMcStatuses,
  getStatuses,
  getStatusesByType,
  getPlusOneStatuses,
  getCommanderStatusByType,
};
