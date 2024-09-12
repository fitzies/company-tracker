import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";

const ParadeDialog = ({ paradeState }: { paradeState: string }) => {
  return (
    <>
      <Dialog>
        <DialogTrigger>
          <Button variant={"default"}>Generate Parade State</Button>
        </DialogTrigger>
        <DialogContent className="lg:max-w-[60vw] max-w-[90vw] rounded-xl">
          <DialogHeader>
            <DialogDescription className="flex flex-col gap-4 p-1">
              <textarea
                className="w-full h-full bg-transparent border-4 p-2 rounded-xl border-zinc-900 outline-none resize-none"
                rows={12}
                value={paradeState}
              ></textarea>
              <Button
                variant={"default"}
                onClick={() => {
                  navigator.clipboard.writeText(paradeState);
                }}
              >
                Copy to clipboard
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ParadeDialog;
