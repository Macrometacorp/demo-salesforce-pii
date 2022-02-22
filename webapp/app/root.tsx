import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "remix";

import type { MetaFunction } from "remix";

import Header from "./routes/components/header";
import styles from "./tailwind.css";
import { useEffect, useState } from "react";
import { Context } from "./interfaces";
import { PerformanceMeasurement } from "./utilities/performance";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export const meta: MetaFunction = () => {
  return { title: "Salesforce Dashboard" };
};

export default function App() {
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [showLatencyModal, setShowLatencyModal] = useState(false);
  const [performanceMeasurement, setPerformanceMeasurement] =
    useState<PerformanceMeasurement>();

  const context: Context = {
    addContactModal: { showAddContactModal, setShowAddContactModal },
    addLatencyModal: { showLatencyModal, setShowLatencyModal },
    performanceMeasurement,
  };

  useEffect(() => {
    const performanceMeasurement = new PerformanceMeasurement();
    setPerformanceMeasurement(performanceMeasurement);
  }, []);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Header
          setShowAddContactModal={setShowAddContactModal}
          setShowLatencyModal={setShowLatencyModal}
        />
        <Outlet context={context} />
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}
