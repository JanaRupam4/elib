import { Button } from "@/components/ui/button";

import { PlusIcon } from "lucide-react";

export function Homepage() {
  return (
    <>
      <div className="flex flex-col items-center gap-y-2">
        <h2 className="text-[18px] text-slate-600">
          No book is added in the store.
        </h2>
        <Button>
          <PlusIcon />
          <span>Add new Book</span>
        </Button>
      </div>
    </>
  );
}
