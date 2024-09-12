"use server";

import { getStatuses, getMcStatuses, getStatusesByType } from "./db";
import prisma from "./prisma";
import { convertToMilitaryDate, getDaysBetweenDates } from "./utils";

const paradeState = (
  totalStrength: number,
  currentStrength: number,
  onMc: RecruitWithStatuses[],
  onStatus: RecruitWithStatuses[],
  onOther: RecruitWithStatuses[],
  onPhysio: RecruitWithStatuses[],
  onReportSick: RecruitWithStatuses[]
) => {
  return `
*Viper Last Parade State ${convertToMilitaryDate(new Date())}*

*Total Recruit Strength: ${totalStrength}*
*Current Recruit Strength: ${currentStrength}*

*MC (${onMc.length}):*
${onMc
  .map((recruit) => {
    const statusStrings = recruit.statuses
      .map((status) => {
        return `• ${getDaysBetweenDates(
          status.startDate,
          status.endDate
        )} DAY ${status.type} (${convertToMilitaryDate(
          status.startDate
        )} - ${convertToMilitaryDate(status.endDate)})`;
      })
      .join("\n"); // Join status strings with newline

    return `${recruit.id} ${recruit.name}\n${statusStrings}`;
  })
  .join("\n\n")}

*Statuses (${onStatus.length}):*
${onStatus
  .map((recruit) => {
    const statusStrings = recruit.statuses
      .map((status) => {
        return `• ${getDaysBetweenDates(
          status.startDate,
          status.endDate
        )} DAY ${status.type} (${convertToMilitaryDate(
          status.startDate
        )} - ${convertToMilitaryDate(status.endDate)})`;
      })
      .join("\n"); // Join status strings with newline

    return `${recruit.id} ${recruit.name}\n${statusStrings}`;
  })
  .join("\n\n")}

*Other (${onOther.length}):*
${onOther
  .map((recruit) => {
    const statusStrings = recruit.statuses
      .map((status) => {
        return `• ${getDaysBetweenDates(
          status.startDate,
          status.endDate
        )} DAY ${status.remarks} (${convertToMilitaryDate(
          status.startDate
        )} - ${convertToMilitaryDate(status.endDate)})`;
      })
      .join("\n"); // Join status strings with newline

    return `${recruit.id} ${recruit.name}\n${statusStrings}`;
  })
  .join("\n\n")}

*Physio (${onPhysio.length}):*
${onPhysio
  .map((recruit) => {
    const statusStrings = recruit.statuses
      .map((status) => {
        return `• ${getDaysBetweenDates(
          status.startDate,
          status.endDate
        )} DAY ${status.type} (${convertToMilitaryDate(
          status.startDate
        )} - ${convertToMilitaryDate(status.endDate)})`;
      })
      .join("\n"); // Join status strings with newline

    return `${recruit.id} ${recruit.name}\n${statusStrings}`;
  })
  .join("\n\n")}

*Reporting Sick (${onReportSick.length}):*
${onReportSick
  .map((recruit) => {
    const statusStrings = recruit.statuses
      .map((status) => {
        return `• ${getDaysBetweenDates(
          status.startDate,
          status.endDate
        )} DAY ${status.type} (${convertToMilitaryDate(
          status.startDate
        )} - ${convertToMilitaryDate(status.endDate)})`;
      })
      .join("\n"); // Join status strings with newline

    return `${recruit.id} ${recruit.name}\n${statusStrings}`;
  })
  .join("\n\n")}

*Commanders Total: 36*
*Commanders Present: 29*

`;
};

export const generateParadeState = async (data: FormData) => {
  const companyId = parseInt(data.get("companyId")!.toString()!);

  const onMc = await getMcStatuses(companyId);
  const onStatus = await getStatuses(companyId);
  const onOther = await getStatusesByType(companyId, "Other");
  const onPhysio = await getStatusesByType(companyId, "Physio");
  const onReportSick = await getStatusesByType(companyId, "Report Sick");

  const totalStrength = (
    await prisma.recruit.findMany({ where: { companyId } })
  ).length;

  const currentStrength = totalStrength - (onMc.length + onOther.length);

  const res = paradeState(
    totalStrength,
    currentStrength,
    onMc,
    onStatus,
    onOther,
    onPhysio,
    onReportSick
  );

  console.log(res);

  return res;
};
