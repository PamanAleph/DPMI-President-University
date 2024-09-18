"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface ContextProps {
   sidebar: boolean;
   toggleSidebar: (bool?: boolean) => void;
}

const AdminDashboardContext = createContext<ContextProps>({
   sidebar: true,
   toggleSidebar: (bool?: boolean) => {},
});

export const AdminDashboardContextProvider = ({
   children,
}: {
   children: React.ReactNode;
}) => {
   const [sidebar, setSidebar] = useState(true);
   useEffect(() => {
      const width = window.innerWidth;
      if (width < 1024) {
         setSidebar(false);
      }
   }, []);
   const toggleSidebar = (bool?: boolean) => {
		if(bool != undefined) {
			setSidebar(bool)
		} else {
			setSidebar(!sidebar);
		}
   };
   return (
      <AdminDashboardContext.Provider value={{ sidebar, toggleSidebar }}>
         {children}
      </AdminDashboardContext.Provider>
   );
};

export const useAdminDashboardContext = () => useContext(AdminDashboardContext);