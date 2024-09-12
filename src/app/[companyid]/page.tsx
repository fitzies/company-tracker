import ParadeState from "@/components/parade-state";
import { getCompany } from "@/lib/db";

const Page = async ({ params }: { params: { companyid: string } }) => {
  const company = await getCompany(parseInt(params.companyid));

  if (!company) {
    return <>No company found</>;
  }

  return (
    <div className="w-screen px-8 py-16 flex flex-col items-center gap-4">
      <h1 className="text-2xl font-bold">{company.name} Company</h1>
      <ParadeState company={company} />
    </div>
  );
};

export default Page;
