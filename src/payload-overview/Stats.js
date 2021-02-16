import React from 'react';
import { ChartDonut, ChartLegend } from '@patternfly/react-charts';
import { getMergeStatus, translateMergeStatus } from './TableUtil'

const colors = {
  "merged (work branch)": "light-green-300",
  "merged (full)": "light-green-400",
  "no pr": "black-300",
  "open (unstable)": "orange-400",
  "open (unknown)": "orange-200",
  "open (clean)": "green-500",
  "open (blocked)": "red-300"
}

const getColor = (name) => {
  let color = colors[name] || "black-800";
  return `var(--pf-global--palette--${color})`;
}

const prTypes = {
  "standalone": "Standalone PRs",
  "upgrades": "Upgrade PRs"
};

const prStats = (data) => {
  let stats = {};
  for (let type in prTypes) {
    stats[type] = {
      "subtitle": prTypes[type],
      "data": {},
      "legend": [],
      "total": 0
    }
  };

  const update = (type, status) => {
    if (!stats[type].data[status]) {
      stats[type].data[status] = 0;
    }
    stats[type].data[status]++;
    stats[type].total++;
  };

  const toChartData = (data) => {
    return Object.keys(data).sort().map(item => {
      return { 'x': item, 'y': data[item], 'color': getColor(item)};
    })
  };

  const toLegendData = (data) =>
    data.map(item => {return { name: `${item.x}: ${item.y}`, color: item.color }});

  const processIssue = (type) => {
    return ((issue) => {
      if (!issue.pullRequest.length) {
        update(type, 'no pr');
      }
      issue.pullRequest.forEach((pr, i) => {
        let status = translateMergeStatus(getMergeStatus(pr));
        update(type, status);
      });
    });
  }

  data.standalone.forEach(processIssue("standalone"));

  let processUpgrade = processIssue("upgrades");
  data.upgrades.forEach(item => {
    processUpgrade(item);
    item.nested.forEach(nestedItem => {
      processUpgrade(nestedItem)
    })
  });

  for (let type in prTypes) {
    stats[type].data = toChartData(stats[type].data);
    stats[type].legend = toLegendData(stats[type].data);
  }

  return stats;
}

const Donut = ({chartData}) => {
  const fillStyle = {
    data: {
      fill: ({datum}) => datum.color
    }
  };

  return (
    <div style={{ height: '230px', width: '500px' }}>
      <ChartDonut
        ariaDesc="Pull request statuses"
        ariaTitle="Pull requests"
        constrainToVisibleArea={true}
        data={chartData.data}
        labels={({ datum }) => `${datum.x}: ${datum.y}`}
        legendComponent={<ChartLegend data={chartData.legend} style={fillStyle} />}
        legendOrientation="vertical"
        legendPosition="right"
        padding={{
          bottom: 20,
          left: 20,
          right: 140,
          top: 20
        }}
        title={chartData.total}
        subTitle={chartData.subtitle}
        style={fillStyle}
        width={350}
      />
    </div>
  )
}

const Stats = ({data}) => {
  const donutData = prStats(data);
  return (
    <div style={{ display: 'flex' }}>
      {Object.keys(prTypes).map((type, i) =>
        <Donut chartData={donutData[type]} key={i} />
      )}
    </div>
  )
}

export default Stats;
