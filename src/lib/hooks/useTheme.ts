import { ThemeContext } from "styled-components";
import { lightTheme } from "@/styles/theme";

import { useContext } from "react";

export default function useTheme() {
  const themeContext = useContext(ThemeContext);
  return themeContext ?? lightTheme;
}
