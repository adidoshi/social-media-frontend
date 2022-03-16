import { createContext, useContext, useState } from "react";

export const themes = {
  light: {
    foreground: "#000000",
    background: "#ffffff",
    topbarColor: "#ffffff",
    topbarBackground: "#1877f2",
  },
  dark: {
    foreground: "#ffffff",
    background: "rgb(26, 32, 44)",
    topbarColor: "#ffffff",
    topbarBackground: "rgb(26, 32, 44)",
  },
};

const initialState = {
  theme: themes.light,
  setTheme: () => {},
};

const ThemeContext = createContext(initialState);

export const ThemeProvider = ({ children }) => {
  const checkUserPreference =
    localStorage.getItem("userTheme") === "light" ? themes.light : themes.dark;
  const [theme, setTheme] = useState(checkUserPreference);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a theme provider");
  }
  return context;
};

export default useTheme;
