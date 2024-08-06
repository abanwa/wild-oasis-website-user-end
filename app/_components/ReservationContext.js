"use client";

import { createContext, useContext, useState } from "react";
import {} from "react";

const ReservationContext = createContext();

const initialState = { from: undefined, to: undefined };

function ReservationProvider({ children }) {
  const [range, setRange] = useState(initialState);
  const resetRange = () => setRange(initialState);

  return (
    <ReservationContext.Provider value={{ range, setRange, resetRange }}>
      {children}
    </ReservationContext.Provider>
  );
}

function useReservation() {
  const context = useContext(ReservationContext);
  if (context === undefined)
    throw new Error("context was used outside provider");

  return context;
}

// The ReservationProvider was used in the RootLayout so that it can be accessed globaly
export { ReservationProvider, useReservation };
