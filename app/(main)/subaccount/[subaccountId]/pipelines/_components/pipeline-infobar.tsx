"use client";
import { useModal } from "@/providers/modal-provider";
import { Pipeline } from "@prisma/client";
import React from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import Link from "next/link";
import CustomModal from "@/components/global/custom-modal";
import CreatePipelineForm from "@/components/forms/create-pipeline";
type Props = {
  pipelineId: string;
  pipelines: Pipeline[];
  subAccountId: string;
};

const PipelineInfobar = ({ pipelineId, pipelines, subAccountId }: Props) => {
  const { setOpen: setOpenModal, setClose } = useModal();
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(pipelineId);

  const handleClickCreatePipeline = () => {
    setOpenModal(
      <CustomModal
        title="Create Pipeline"
        subheading="Pipeline allows you to group tickets into lanes and track business process all in one place."
      >
        <CreatePipelineForm subAccountId={subAccountId} />
      </CustomModal>
    );
  };
  return (
    <div>
      <div className="flex items-end gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[200px] justify-between"
            >
              {value
                ? pipelines.find((pipeline) => pipeline?.id === value)?.name
                : "Select a pipeline..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandEmpty>No pipelines found.</CommandEmpty>
              <CommandList>
                <CommandGroup>
                  {pipelines?.map((pipeline) => {
                    return (
                      <Link
                        key={pipeline?.id}
                        href={`/subaccount/${subAccountId}/pipelines/${pipeline?.id}`}
                      >
                        <CommandItem
                          key={pipeline?.id}
                          value={pipeline?.id}
                          onSelect={(currentValue) => {
                            setValue(currentValue);
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              value === pipeline?.id
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {pipeline?.name}
                        </CommandItem>
                      </Link>
                    );
                  })}
                  <Button
                    variant="secondary"
                    className="flex gap-2 w-full mt-4"
                    onClick={handleClickCreatePipeline}
                  >
                    <Plus size={15} />
                    Create Pipeline
                  </Button>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default PipelineInfobar;
