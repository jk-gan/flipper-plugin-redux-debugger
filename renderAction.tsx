import { Typography } from "antd";

export const renderAction = (action: string) => {
  const splitted = split(action);
  if (splitted.length <= 1) return action;

  const categorized = categorize(splitted);
  const colorized = colorize(categorized);
  const component = componentrize(colorized);
  return <>{component}</>;
};

const componentrize = (list: Category[]) => {
  const components = list.map(({ text, isSeparator, isSpecialText, color }) => {
    const paddingHorizontal = isSeparator
      ? { paddingLeft: 1, paddingRight: 1 }
      : {};
    return (
      <Typography.Text
        style={{ color, ...paddingHorizontal }}
        italic={isSpecialText}
        underline={isSpecialText}
      >
        {text}
      </Typography.Text>
    );
  });
  return <>{components}</>;
};

const SEPARATOR = "/";
const split = (text: string) => {
  let parts = text.split(SEPARATOR);
  for (let i = parts.length; i-- > 1; ) parts.splice(i, 0, SEPARATOR);
  return parts;
};

const RTK_THUNK_LIST = ["pending", "fulfilled", "rejected"]; // NOTE: https://redux-toolkit.js.org/api/createAsyncThunk#type

type Category = {
  text: string;
  isSeparator?: boolean;
  isSpecialText?: boolean;
  color?: string;
};

const categorize = (list: string[]): Category[] => {
  return list.map((text) => {
    if (text === SEPARATOR) return { text, isSeparator: true };
    if (RTK_THUNK_LIST.includes(text)) return { text, isSpecialText: true };
    return { text };
  });
};

const COLOR_PALETTE = ["#ec5f67", "#E0AF02", "#0c969b", "#994cc3"];
const SEPARATOR_COLOR = "#CCD1E4";
const SPECIAL_TEXT_COLOR = "#CCD1E4";

const colorize = (list: Category[]) => {
  let i = 0;
  return list.map((item) => {
    if (item.isSeparator) return { ...item, color: SEPARATOR_COLOR };
    if (item.isSpecialText) return { ...item, color: SPECIAL_TEXT_COLOR };
    const obj = { ...item, color: COLOR_PALETTE[i] };
    if (i === COLOR_PALETTE.length - 1) {
      i = 0;
    } else {
      i += 1;
    }
    return obj;
  });
};
