// contexts/ConfigContext.js
import React, { ReactNode, createContext, useContext } from "react";
import { themeConfig } from "~/shop/custom/config";

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
