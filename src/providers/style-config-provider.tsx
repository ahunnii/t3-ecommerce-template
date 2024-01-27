// contexts/ConfigContext.js
import React, { createContext, useContext, type ReactNode } from "react";
import type { dataConfig, themeConfig } from "~/data/config.custom";

type Config = {
  theme: themeConfig;
  data: dataConfig;
};

const ConfigContext = createContext({} as themeConfig);

export const useConfig = () => {
  return useContext(ConfigContext);
};

export const ConfigProvider = ({
  config,
  children,
}: {
  config: object;
  children: ReactNode;
}) => {
  return (
    <ConfigContext.Provider value={config as themeConfig}>
      {children}
    </ConfigContext.Provider>
  );
};
