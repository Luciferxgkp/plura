"use client";
import { EditorBtns } from "@/lib/constants";
import { EditorAction } from "./editor-action";
import React, { createContext } from "react";
import { FunnelPage } from "@prisma/client";

export type DeviceTypes = "Desktop" | "Tablet" | "Mobile";

export type EditorElement = {
  id: string;
  styles: React.CSSProperties;
  name: string;
  type: EditorBtns;
  content:
    | EditorElement[]
    | { href?: string; innerText?: string; src?: string };
};

export type Editor = {
  liveMode: boolean;
  elements: EditorElement[];
  selectedElement: EditorElement;
  device: DeviceTypes;
  previewMode: boolean;
  funnelPageId: string;
};

export type HistoryState = {
  history: Editor[];
  currentIndex: number;
};

export type EditorState = {
  editor: Editor;
  history: HistoryState;
};

const initialEditorState: EditorState["editor"] = {
  elements: [
    {
      content: [],
      id: "__body",
      name: "Body",
      styles: {},
      type: "__body",
    },
  ],
  selectedElement: {
    id: "",
    styles: {},
    name: "",
    type: null,
    content: {},
  },
  device: "Desktop",
  previewMode: false,
  funnelPageId: "",
  liveMode: false,
};

const initialHistoryState: EditorState["history"] = {
  history: [initialEditorState],
  currentIndex: 0,
};

const initialState: EditorState = {
  editor: initialEditorState,
  history: initialHistoryState,
};

const addAnElement = (
  editorArray: EditorElement[],
  action: EditorAction
): EditorElement[] => {
  if (action.type !== "ADD_ELEMENT") {
    throw new Error("You sent the wrong action type to addAnElement");
  }

  return editorArray.map((element) => {
    if (
      element.id === action.payload.containerId &&
      Array.isArray(element.content)
    ) {
      return {
        ...element,
        content: [...element.content, action.payload.elementDetails],
      };
    } else if (element.content && Array.isArray(element.content)) {
      return {
        ...element,
        content: addAnElement(element.content, action),
      };
    }
    return element;
  });
};

const updateAnElement = (
  editorArray: EditorElement[],
  action: EditorAction
): EditorElement[] => {
  if (action.type !== "UPDATE_ELEMENT") {
    throw new Error("You sent the wrong action type to updateAnElement");
  }

  return editorArray.map((element) => {
    if (element.id === action.payload.elementDetails.id) {
      return { ...element, ...action.payload.elementDetails };
    } else if (element.content && Array.isArray(element.content)) {
      return {
        ...element,
        content: updateAnElement(element.content, action),
      };
    }
    return element;
  });
};

const deleteAnElement = (
  editorArray: EditorElement[],
  action: EditorAction
): EditorElement[] => {
  if (action.type !== "DELETE_ELEMENT") {
    throw new Error("You sent the wrong action type to deleteAnElement");
  }

  return editorArray.filter((element) => {
    if (element.id === action.payload.elementDetails.id) {
      return false;
    } else if (element.content && Array.isArray(element.content)) {
      element.content = deleteAnElement(element.content, action);
    }
    return true;
  });
};
const editorReducer = (
  state: EditorState = initialState,
  action: EditorAction
): EditorState => {
  switch (action.type) {
    case "ADD_ELEMENT":
      const updateEditorState = {
        ...state.editor,
        elements: addAnElement(state.editor.elements, action),
      };

      const updateHistoryState = [
        ...state.history.history.slice(0, state.history.currentIndex + 1),
        { ...updateEditorState },
      ];
      const newEditorState = {
        ...state,
        editor: updateEditorState,
        history: {
          ...state.history,
          history: updateHistoryState,
          currentIndex: updateHistoryState.length - 1,
        },
      };

      return newEditorState;
    case "UPDATE_ELEMENT":
      const updateElement = updateAnElement(state.editor.elements, action);
      const updatedElementIsSelected =
        state.editor.selectedElement.id === action.payload.elementDetails.id;

      const updatedEditorStateWithUpdate = {
        ...state.editor,
        elements: updateElement,
        selectedElement: updatedElementIsSelected
          ? action.payload.elementDetails
          : {
              id: "",
              styles: {},
              name: "",
              type: null,
              content: [],
            },
      };

      const updatedHistoryWithUpdate = [
        ...state.history.history.slice(0, state.history.currentIndex + 1),
        { ...updatedEditorStateWithUpdate },
      ];

      const updateEditor = {
        ...state,
        editor: updatedEditorStateWithUpdate,
        history: {
          ...state.history,
          history: updatedHistoryWithUpdate,
          currentIndex: updatedHistoryWithUpdate.length - 1,
        },
      };

      return updateEditor;

    case "DELETE_ELEMENT":
      const deleteElement = deleteAnElement(state.editor.elements, action);

      const updateElementStateAfterDelete = {
        ...state.editor,
        elements: deleteElement,
      };

      const updateHistoryStateAfterDelete = [
        ...state.history.history.slice(0, state.history.currentIndex + 1),
        { ...updateElementStateAfterDelete },
      ];

      const updateEditorStateAfterDelete = {
        ...state,
        editor: updateElementStateAfterDelete,
        history: {
          ...state.history,
          history: updateHistoryStateAfterDelete,
          currentIndex: updateHistoryStateAfterDelete.length - 1,
        },
      };

      return updateEditorStateAfterDelete;
    case "CHANGE_CLICKED_ELEMENT":
      const clickedState = {
        ...state,
        editor: {
          ...state.editor,
          selectedElement: action.payload.elementDetails || {
            id: "",
            content: [],
            name: "",
            styles: {},
            type: null,
          },
        },
        history: {
          ...state.history,
          history: [
            ...state.history.history.slice(0, state.history.currentIndex + 1),
            { ...state.editor },
          ],
          currentIndex: state.history.currentIndex + 1,
        },
      };

      return clickedState;

    case "CHANGE_DEVICE":
      const changedDeviceState = {
        ...state,
        editor: {
          ...state.editor,
          device: action.payload.device,
        },
      };

      return changedDeviceState;
    case "TOGGLE_PREVIEW_MODE":
      const togglePreviewState = {
        ...state,
        editor: {
          ...state.editor,
          previewMode: !state.editor.previewMode,
        },
      };

      return togglePreviewState;
    case "TOGGLE_LIVE_MODE":
      const toggleLiveState = {
        ...state,
        editor: {
          ...state.editor,
          liveMode: action.payload
            ? action.payload.value
            : !state.editor.liveMode,
        },
      };

      return toggleLiveState;
    case "REDO":
      if (state.history.currentIndex < state.history.history.length - 1) {
        const nextIndex = state.history.currentIndex + 1;
        const nextEditorState = { ...state.history.history[nextIndex] };
        const reduState = {
          ...state,
          editor: nextEditorState,
          history: {
            ...state.history,
            currentIndex: nextIndex,
          },
        };

        return reduState;
      }
      return state;
    case "UNDO":
      if (state.history.currentIndex > 0) {
        const prevIndex = state.history.currentIndex - 1;
        const prevEditorState = { ...state.history.history[prevIndex] };
        const undoState = {
          ...state,
          editor: prevEditorState,
          history: {
            ...state.history,
            currentIndex: prevIndex,
          },
        };

        return undoState;
      }
      return state;
    case "LOAD_DATA":
      const loadState = {
        ...initialState,
        editor: {
          ...initialState.editor,
          elements: action.payload.elements || initialEditorState.elements,
          liveMode: !!action.payload.withLive,
        },
      };

      return loadState;
    case "SET_FUNNELPAGE_ID":
      const { funnelPageId } = action.payload;
      const updatedEditorStateWithFunnelPageId = {
        ...state.editor,
        funnelPageId,
      };

      const updatedHistoryStateWithFunnelPageId = [
        ...state.history.history.slice(0, state.history.currentIndex + 1),
        { ...updatedEditorStateWithFunnelPageId },
      ];

      const updatedStateWithFunnelPageId = {
        ...state,
        editor: updatedEditorStateWithFunnelPageId,
        history: {
          ...state.history,
          history: updatedHistoryStateWithFunnelPageId,
          currentIndex: updatedHistoryStateWithFunnelPageId.length - 1,
        },
      };

      return updatedStateWithFunnelPageId;
    default:
      return state;
  }
};

export type EditorContextData = {
  device: DeviceTypes;
  previewMode: boolean;
  setPreviewMode: (previewMode: boolean) => void;
  setDevice: (device: DeviceTypes) => void;
};

export const EditorContext = createContext<{
  state: EditorState;
  dispatch: React.Dispatch<EditorAction>;
  subaccountId: string;
  funnelId: string;
  pageDetails: FunnelPage | null;
}>({
  state: initialState,
  dispatch: () => undefined,
  subaccountId: "",
  funnelId: "",
  pageDetails: null,
});

type EditorProps = {
  children: React.ReactNode;
  subaccountId: string;
  funnelId: string;
  pageDetails: FunnelPage | null;
};

export const EditorProvider = ({
  children,
  subaccountId,
  funnelId,
  pageDetails,
}: EditorProps) => {
  const [state, dispatch] = React.useReducer(editorReducer, initialState);

  return (
    <EditorContext.Provider
      value={{ state, dispatch, subaccountId, funnelId, pageDetails }}
    >
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => {
  const context = React.useContext(EditorContext);
  if (context === undefined) {
    throw new Error("useEditor must be used within a EditorProvider");
  }
  return context;
};

export default EditorProvider;
