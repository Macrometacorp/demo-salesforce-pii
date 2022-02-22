import { AppPaths, LatencyRequest } from "~/constants";
import { LatencyInfo } from "~/interfaces";

export class PerformanceMeasurement {
  private static LIMIT = 50;
  private static POST_PATHS = [AppPaths.UserManagement];
  private performances: Array<PerformanceResourceTiming>;

  constructor() {
    this.performances = [];
    const observer = new PerformanceObserver((list) => {
      const perfs = list
        .getEntriesByType(LatencyRequest.Type)
        .filter((perf: any) => perf.initiatorType === LatencyRequest.FETCH);
      this.newEvent(perfs as Array<PerformanceResourceTiming>);
    });
    observer.observe({ entryTypes: [LatencyRequest.Type] });
  }

  private newEvent(perfs: Array<PerformanceResourceTiming>) {
    this.performances.push(...perfs);
    while (this.performances.length > PerformanceMeasurement.LIMIT) {
      this.performances.shift();
    }
  }

  getPerformances(): Array<LatencyInfo> {
    /**
     * each call to app path + resource path will be GET
     * but if both "action" and "loader" are present, then
     * first call will be "POST" to that action
     * second will be "GET" to get new data from "loader".
     * This is represented by "POST_PATHS"
     */
    return this.performances.map((curr: PerformanceResourceTiming, index) => {
      const { name, responseEnd, fetchStart, transferSize } = curr;

      const isPostPath = !!PerformanceMeasurement.POST_PATHS.find((path) =>
        name.includes(path)
      );
      const nextElem =
        index < this.performances.length - 1
          ? this.performances[index + 1]
          : null;
      const method = isPostPath
        ? nextElem?.name === curr.name
          ? "POST"
          : "GET"
        : "GET";

      const responseValue = {
        Name: name,
        Status: "200",
        Path: name.split(`${window.location.origin}/`)[1],
        Time: `${Math.floor(responseEnd - fetchStart)} ms`,
        Method: method,
        Size: `${transferSize} B`,
      };
      return responseValue;
    });
  }
}
