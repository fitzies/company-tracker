"use server";

import {
  getStatuses,
  getMcStatuses,
  getStatusesByType,
  getPlusOneStatuses,
  getCommanderStatusByType,
} from "./db";
import prisma from "./prisma";
import { convertToMilitaryDate, getDaysBetweenDates } from "./utils";

const paradeState = (
  totalStrength: number,
  currentStrength: number,
  onMc: RecruitWithStatuses[],
  onStatus: RecruitWithStatuses[],
  onOther: RecruitWithStatuses[],
  onPhysio: RecruitWithStatuses[],
  onReportSick: RecruitWithStatuses[],
  onPlusOne: RecruitWithStatuses[],
  commanderOnStatus: RecruitWithStatuses[],
  commanderOnMC: RecruitWithStatuses[],
  commanderOnOther: RecruitWithStatuses[],
  totalCommanderStrength: number,
  currentCommanderStrength: number
) => {
  return `
*Viper First Parade State ${convertToMilitaryDate(new Date())}*

*Total Recruit Strength: ${totalStrength}*
*Current Recruit Strength: ${currentStrength}*

*MC (${onMc.length}):*
${onMc
  .map((recruit, index) => {
    const statusStrings = recruit.statuses
      .map((status) => {
        return `\t• ${getDaysBetweenDates(
          status.startDate,
          status.endDate
        )} DAY ${status.type} (${convertToMilitaryDate(
          status.startDate
        )} - ${convertToMilitaryDate(status.endDate)})`;
      })
      .join("\n"); // Join status strings with newline

    return `${index + 1}. ${recruit.id.substring(1)} ${
      recruit.name
    }\n${statusStrings}`;
  })
  .join("\n\n")}

*Statuses (${onStatus.length + onPlusOne.length}):*
${onStatus
  .map((recruit, index) => {
    const statusStrings = recruit.statuses
      .map((status) => {
        return `\t• ${getDaysBetweenDates(
          status.startDate,
          status.endDate
        )} DAY ${
          status.type === "Custom Status" ? status.remarks : status.type
        } (${convertToMilitaryDate(status.startDate)} - ${convertToMilitaryDate(
          status.endDate
        )})`;
      })
      .join("\n"); // Join status strings with newline

    return `${index + 1}. ${recruit.id.substring(1)} ${
      recruit.name
    }\n${statusStrings}`;
  })
  .join("\n\n")}

${onPlusOne
  .map((recruit, index) => {
    const statusStrings = recruit.statuses
      .map((status) => {
        return `\t• ${status.type} ${status.remarks}`;
      })
      .join("\n"); // Join status strings with newline

    return `${onStatus.length + (index + 1)}. ${recruit.id.substring(1)} ${
      recruit.name
    }\n${statusStrings}`;
  })
  .join("\n\n")}

*Other (${onOther.length}):*
${onOther
  .map((recruit, index) => {
    const statusStrings = recruit.statuses
      .map((status) => {
        return `\t• ${getDaysBetweenDates(
          status.startDate,
          status.endDate
        )} DAY ${status.remarks} (${convertToMilitaryDate(
          status.startDate
        )} - ${convertToMilitaryDate(status.endDate)})`;
      })
      .join("\n"); // Join status strings with newline

    return `${index + 1}. ${recruit.id.substring(1)} ${
      recruit.name
    }\n${statusStrings}`;
  })
  .join("\n\n")}

*Physio (${onPhysio.length}):*
${onPhysio
  .map((recruit, index) => {
    const statusStrings = recruit.statuses
      .map((status) => {
        return `\t• ${getDaysBetweenDates(
          status.startDate,
          status.endDate
        )} DAY ${status.type} (${convertToMilitaryDate(
          status.startDate
        )} - ${convertToMilitaryDate(status.endDate)})`;
      })
      .join("\n"); // Join status strings with newline

    return `${index + 1}. ${recruit.id.substring(1)} ${
      recruit.name
    }\n${statusStrings}`;
  })
  .join("\n\n")}

*Reporting Sick (${onReportSick.length}):*
${onReportSick
  .map((recruit, index) => {
    const statusStrings = recruit.statuses
      .map((status) => {
        return `\t• ${getDaysBetweenDates(
          status.startDate,
          status.endDate
        )} DAY ${status.type} (${convertToMilitaryDate(
          status.startDate
        )} - ${convertToMilitaryDate(status.endDate)})`;
      })
      .join("\n"); // Join status strings with newline

    return `${index + 1}. ${recruit.id.substring(1)} ${
      recruit.name
    }\n${statusStrings}`;
  })
  .join("\n\n")}

*Commanders Total: ${totalCommanderStrength}*
*Commanders Present: ${currentCommanderStrength}*
${commanderOnStatus
  .map((commander, index) => {
    const statusStrings = commander.statuses
      .map((status) => {
        return `\t• ${getDaysBetweenDates(
          status.startDate,
          status.endDate
        )} DAY ${status.type} (${convertToMilitaryDate(
          status.startDate
        )} - ${convertToMilitaryDate(status.endDate)})`;
      })
      .join("\n"); // Join status strings with newline

    return `${index + 1}. ${commander.name}\n${statusStrings}`;
  })
  .join("\n\n")}
${commanderOnMC
  .map((commander, index) => {
    const statusStrings = commander.statuses
      .map((status) => {
        return `\t• ${getDaysBetweenDates(
          status.startDate,
          status.endDate
        )} DAY ${status.type} (${convertToMilitaryDate(
          status.startDate
        )} - ${convertToMilitaryDate(status.endDate)})`;
      })
      .join("\n"); // Join status strings with newline

    return `${commanderOnStatus.length + (index + 1)}. ${
      commander.name
    }\n${statusStrings}`;
  })
  .join("\n\n")}
${commanderOnOther
  .map((commander, index) => {
    const statusStrings = commander.statuses
      .map((status) => {
        return `\t• ${getDaysBetweenDates(
          status.startDate,
          status.endDate
        )} DAY ${status.remarks} (${convertToMilitaryDate(
          status.startDate
        )} - ${convertToMilitaryDate(status.endDate)})`;
      })
      .join("\n"); // Join status strings with newline

    return `${commanderOnStatus.length + commanderOnMC.length + (index + 1)}. ${
      commander.name
    }\n${statusStrings}`;
  })
  .join("\n\n")}
`;
};

export const generateParadeState = async (data: FormData) => {
  const companyId = parseInt(data.get("companyId")!.toString()!);

  const onMc = await getMcStatuses(companyId);
  const onStatus = await getStatuses(companyId);
  const onOther = await getStatusesByType(companyId, "Other");
  const onPhysio = await getStatusesByType(companyId, "Physio");
  const onReportSick = await getStatusesByType(companyId, "Report Sick");
  const onPlusOne = await getPlusOneStatuses(companyId);

  const commanderOnStatus = await getCommanderStatusByType(companyId, [
    "LD",
    "Custom Status",
  ]);
  const commanderOnMC = await getCommanderStatusByType(companyId, ["MC"]);
  const commanderOnOther = await getCommanderStatusByType(companyId, ["Other"]);

  const totalStrength = (
    await prisma.recruit.findMany({ where: { companyId } })
  ).length;

  const currentStrength = totalStrength - (onMc.length + onOther.length);

  const totalCommanderStrength = (
    await prisma.commander.findMany({ where: { companyId } })
  ).length;

  const currentCommanderStrength =
    totalCommanderStrength - (commanderOnMC.length + commanderOnOther.length);

  const res = paradeState(
    totalStrength,
    currentStrength,
    onMc,
    onStatus,
    onOther,
    onPhysio,
    onReportSick,
    onPlusOne,
    commanderOnStatus,
    commanderOnMC,
    commanderOnOther,
    totalCommanderStrength,
    currentCommanderStrength
  );

  console.log(res);

  return res;
};
