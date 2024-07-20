import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import { Trash } from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = {
  element: EditorElement;
};

const LinkComponent = ({ element }: Props) => {
  const { state, dispatch } = useEditor();
  const onDragStart = (e: React.DragEvent, type: string) => {
    if (type === null) return;
    e.dataTransfer.setData("componentType", type);
  };

  const handleOnClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({
      type: "CHANGE_CLICKED_ELEMENT",
      payload: {
        elementDetails: element,
      },
    });
  };

  const handleDeleteElement = () => {
    dispatch({
      type: "DELETE_ELEMENT",
      payload: { elementDetails: element },
    });
  };
  const styles = element.styles;
  console.log("element", element);
  return (
    <div
      style={styles}
      className={cn(
        "p-[2px] w-full m-[5px] relative text-[16px] transition-all flex items-center justify-center",
        {
          "!border-blue-500": state.editor.selectedElement.id === element.id,
          "!border-solid": state.editor.selectedElement.id === element.id,
          "border-dashed border-[1px] border-slate-300": !state.editor.liveMode,
        }
      )}
      draggable
      onDragStart={(e) => onDragStart(e, "link")}
      onClick={handleOnClick}
    >
      {" "}
      {state.editor.selectedElement.id === element.id &&
        !state.editor.liveMode && (
          <Badge className="absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg ">
            {state.editor.selectedElement.name}
          </Badge>
        )}
      {!Array.isArray(element.content) &&
        (state.editor.previewMode || state.editor.liveMode) && (
          <Link href={element.content.href || "#"}>
            {element.content.innerText}
          </Link>
        )}
      {!state.editor.previewMode && !state.editor.liveMode && (
        <span
          contentEditable={!state.editor.liveMode}
          onBlur={(e) => {
            const spanElement = e.target as HTMLSpanElement;
            dispatch({
              type: "UPDATE_ELEMENT",
              payload: {
                elementDetails: {
                  ...element,
                  content: {
                    innerText: spanElement.innerText,
                  },
                },
              },
            });
          }}
        >
          {!Array.isArray(element.content) && element.content.innerText}
        </span>
      )}
      {state.editor.selectedElement.id === element.id &&
        !state.editor.liveMode && (
          <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold  -top-[25px] -right-[1px] rounded-none rounded-t-lg !text-white">
            <Trash
              className="cursor-pointer"
              size={16}
              onClick={handleDeleteElement}
            />
          </div>
        )}
    </div>
  );
};

export default LinkComponent;
