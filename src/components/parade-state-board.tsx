"use client";

import { generateParadeState } from "@/lib/generate-parade-state";
import { Button } from "@/components/ui/button";
import { Company } from "@prisma/client";
import { useState } from "react";

const ParadeStateClipboard = ({ company }: { company: Company }) => {
  const [paradeState, setParadeState] = useState<string>();
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
          <Button variant={"default"}>Generate Parade State</Button>
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
      <textarea
        className="text-white bg-transparent lg:w-[50vw] w-screen h-screen "
        value={paradeState}
      />
    </div>
  );
};

export default ParadeStateClipboard;
