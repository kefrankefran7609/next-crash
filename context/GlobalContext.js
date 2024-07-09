"use client";
import { useState, useContext, createContext } from "react";

// Crate context
const GlobalContext = createContext();

// Create a provider
export function GlobalProvider({ children }) {
	const [unreadMessages, setUnreadMessages] = useState(0);

	return (
		<GlobalContext.Provider
			value={{
				unreadMessages,
				setUnreadMessages,
			}}>
			{children}
		</GlobalContext.Provider>
	);
}

// Create a custom hook to access context
export function useGlobalContext() {
	return useContext(GlobalContext);
}
