"use client";

import { generateParadeState } from "@/lib/generate-parade-state";
import { Button } from "@/components/ui/button";
import { Company } from "@prisma/client";
import { useState } from "react";
import ParadeDialog from "./parade-dialog";

const ParadeState = ({ company }: { company: Company }) => {
  const [paradeState, setParadeState] = useState<string>(
    "Generating parade state..."
  );
  return (
    <div>
      <div className="flex gap-4 justify-center items-center">
        <form
          action={async (data: FormData) => {
            const res = await generateParadeState(data);
            setParadeState(() => res);
          }}
        >
          <input
            type="number"
            name="companyId"
            value={company.id}
            className="hidden"
          />
          {/* <Button variant={"default"}>Generate Parade State</Button> */}
          <ParadeDialog paradeState={paradeState ?? ""} />
        </form>
        <form action="">
          <input
            type="number"
            name="companyId"
            value={company.id}
            className="hidden"
          />
          <Button variant={"secondary"}>Add Status</Button>
        </form>
      </div>
    </div>
  );
};

export default ParadeState;
