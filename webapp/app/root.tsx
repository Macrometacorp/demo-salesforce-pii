import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "remix";
import { LatencyRequest, SessionStorage } from '~/constants';

import type { MetaFunction } from "remix";

import Header from "./routes/components/header";
import styles from "./tailwind.css";
import { useState } from "react";
import { Context } from "./interfaces";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export const meta: MetaFunction = () => {
  return { title: "User Management Portal" };
};

export const measureLatency = (method: string) => {
  if (typeof document !== 'undefined') {
    let performances: any = performance
      .getEntriesByType('resource')
      .filter((item: any) => item.initiatorType === LatencyRequest.FETCH);

    const performanceRttArray = JSON.parse(
      sessionStorage.getItem(SessionStorage.ResponseTime) || '[]'
    );

    const newArray = [];
    for (let i = 0; i < performances.length; i++) {
      let duplicate = performanceRttArray.find((performanceItem: any) => {
        const performanceTime =
          Math.round(performances[i].responseEnd - performances[i].fetchStart) +
          ' ms';
        return (
          performanceItem.Name === performances[i].name &&
          performanceItem.Time === performanceTime &&
          performanceItem.URL === performances[i].transferSize + ' B'
        );
      });
      if (typeof duplicate == 'undefined') {
        let responseTimeValue = {};
        responseTimeValue = {
          Name: performances[i].name,
          Status: '200',
          Path: performances[i].name.split('?')[0].split(`${window.location.origin}/`)[1],
          Time:
            Math.round(
              performances[i].responseEnd - performances[i].fetchStart
            ) + ' ms',
          Method: method,
          Size: performances[i].transferSize + ' B',
        };
        newArray.push(responseTimeValue);
      }
    }

    let responseTimeArray = [...performanceRttArray, ...newArray];

    if (responseTimeArray.length > 100) {
      const difference = Math.abs(responseTimeArray.length - 100);
      responseTimeArray.splice(0, difference);
    }
    sessionStorage.setItem(SessionStorage.ResponseTime, JSON.stringify(responseTimeArray));
  }
};

export default function App() {
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [showLatencyModal, setShowLatencyModal] = useState(false);

  const context: Context = {
    addContactModal: { showAddContactModal, setShowAddContactModal },
    addLatencyModal: { showLatencyModal, setShowLatencyModal }
  };

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Header setShowAddContactModal={setShowAddContactModal} setShowLatencyModal={setShowLatencyModal}/>
        <Outlet context={context} />
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}
