import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { Editor } from "@tinymce/tinymce-react";
import { LabelPosition } from "components/constants";
import { Alignment } from "@blueprintjs/core";
import { TextSize } from "constants/WidgetConstants";

import { Colors } from "constants/Colors";
import LabelWithTooltip, {
  labelLayoutStyles,
} from "components/ads/LabelWithTooltip";

const StyledRTEditor = styled.div<{
  compactMode: boolean;
  labelPosition?: LabelPosition;
  isValid?: boolean;
}>`
  && {
    width: 100%;
    height: 100%;
    border: 1px solid
      ${(props) => (props.isValid ? "none" : Colors.DANGER_SOLID)};
    .tox .tox-editor-header {
      z-index: 0;
    }
  }
  .tox {
    width: 100%;
    .tox-tbtn {
      cursor: pointer;
      .tox-tbtn__select-label {
        cursor: inherit;
      }
    }
  }

  ${labelLayoutStyles}
`;

export const RichTextEditorInputWrapper = styled.div`
  display: flex;
  width: 100%;
  min-width: 0;
  height: 100%;
`;

export interface RichtextEditorComponentProps {
  value?: string;
  isMarkdown: boolean;
  placeholder?: string;
  widgetId: string;
  isDisabled: boolean;
  isVisible?: boolean;
  compactMode: boolean;
  isToolbarHidden: boolean;
  labelText: string;
  labelPosition?: LabelPosition;
  labelAlignment?: Alignment;
  labelWidth?: number;
  labelTextColor?: string;
  labelTextSize?: TextSize;
  labelStyle?: string;
  isValid?: boolean;
  onValueChange: (valueAsString: string) => void;
}
const initValue = "<p></p>";
export function RichtextEditorComponent(props: RichtextEditorComponentProps) {
  const {
    compactMode,
    isDisabled,
    labelAlignment,
    labelPosition,
    labelStyle,
    labelText,
    labelTextColor,
    labelTextSize,
    labelWidth,
  } = props;

  const [value, setValue] = React.useState<string>(props.value as string);

  const editorRef = useRef<any>(null);
  const isInit = useRef<boolean>(false);

  const toolbarConfig =
    "insertfile undo redo | formatselect | bold italic backcolor forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | removeformat | table | print preview media | forecolor backcolor emoticons' | help";

  useEffect(() => {
    if (!value && !props.value) return;
    // This Prevents calling onTextChange when initialized
    if (!isInit.current) return;
    const timeOutId = setTimeout(() => props.onValueChange(value), 1000);
    return () => clearTimeout(timeOutId);
  }, [value]);

  useEffect(() => {
    if (!editorRef.current) return;
    setValue(props.value as string);
  }, [props.value]);

  const onEditorChange = (newValue: string) => {
    // Prevents cursur shift in Markdown
    if (newValue === "" && props.isMarkdown) {
      setValue(initValue);
    } else {
      setValue(newValue);
    }
  };

  return (
    <StyledRTEditor
      className={`container-${props.widgetId}`}
      compactMode={compactMode}
      data-testid="rte-container"
      isValid={props.isValid}
      labelPosition={labelPosition}
    >
      {labelText && (
        <LabelWithTooltip
          alignment={labelAlignment}
          className={`rich-text-editor-label`}
          color={labelTextColor}
          compact={compactMode}
          disabled={isDisabled}
          fontSize={labelTextSize}
          fontStyle={labelStyle}
          position={labelPosition}
          text={labelText}
          width={labelWidth}
        />
      )}
      <RichTextEditorInputWrapper>
        <Editor
          disabled={props.isDisabled}
          id={`rte-${props.widgetId}`}
          init={{
            height: "100%",
            menubar: false,
            toolbar_mode: "sliding",
            forced_root_block: false,
            branding: false,
            resize: false,
            plugins: [
              "advlist autolink lists link image charmap print preview anchor",
              "searchreplace visualblocks code fullscreen",
              "insertdatetime media table paste code help",
            ],
          }}
          key={`editor_${props.isToolbarHidden}`}
          onEditorChange={onEditorChange}
          onInit={(evt, editor) => {
            editorRef.current = editor;
            isInit.current = true;
          }}
          tinymceScriptSrc="https://cdnjs.cloudflare.com/ajax/libs/tinymce/5.10.1/tinymce.min.js"
          toolbar={props.isToolbarHidden ? false : toolbarConfig}
          value={value}
        />
      </RichTextEditorInputWrapper>
    </StyledRTEditor>
  );
}

export default RichtextEditorComponent;
