export const single = [
  {
    name: 'Hastane',
    value: 40
  },
  {
    name: 'Bilgi İşlem',
    value: 49
  },
  {
    name: 'Kütüphane',
    value: 36
  },
  {
    name: 'Mühendislik',
    value: 36
  },
  {
    name: 'Donanım',
    value: 33
  },
  {
    name: 'Rektörlük',
    value: 35
  }
];

export const multi = [
  {
    name: 'Hastane',
    series: [
      {
        name: '2010',
        value: 40
      },
      {
        name: '2000',
        value: 36
      },
      {
        name: '1990',
        value: 31
      }
    ]
  },
  {
    name: 'Bilgi İşlem',
    series: [
      {
        name: '2010',
        value: 49
      },
      {
        name: '2000',
        value: 45
      },
      {
        name: '1990',
        value: 37
      }
    ]
  },
  {
    name: 'Kütüphane',
    series: [
      {
        name: '2010',
        value: 36
      },
      {
        name: '2000',
        value: 34
      },
      {
        name: '1990',
        value: 29
      }
    ]
  },
  {
    name: 'Mühendislik',
    series: [
      {
        name: '2010',
        value: 36
      },
      {
        name: '2000',
        value: 32
      },
      {
        name: '1990',
        value: 26
      }
    ]
  }
];

export const bubble = [
  {
    name: 'Germany',
    series: [
      {
        name: new Date(Math.floor(1473700105009 +  Math.random() * 1000000000)),
        x: new Date(Math.floor(1473700105009 +  Math.random() * 1000000000)),
        y: 80.3,
        r: 80.4
      },
      {
        name: new Date(Math.floor(1473700105009 +  Math.random() * 1000000000)),
        x: new Date(Math.floor(1473700105009 +  Math.random() * 1000000000)),
        y: 80.3,
        r: 78
      },
      {
        name: new Date(Math.floor(1473700105009 +  Math.random() * 1000000000)),
        x: new Date(Math.floor(1473700105009 +  Math.random() * 1000000000)),
        y: 75.4,
        r: 79
      }
    ]
  },
  {
    name: 'USA',
    series: [
      {
        name: new Date(Math.floor(1473700105009 +  Math.random() * 1000000000)),
        x: new Date(Math.floor(1473700105009 +  Math.random() * 1000000000)),
        y: 78.8,
        r: 310
      },
      {
        name: new Date(Math.floor(1473700105009 +  Math.random() * 1000000000)),
        x: new Date(Math.floor(1473700105009 +  Math.random() * 1000000000)),
        y: 76.9,
        r: 283
      },
      {
        name: new Date(Math.floor(1473700105009 +  Math.random() * 1000000000)),
        x: new Date(Math.floor(1473700105009 +  Math.random() * 1000000000)),
        y: 75.4,
        r: 253
      }
    ]
  },
  {
    name: 'France',
    series: [
      {
        name: new Date(Math.floor(1473700105009 +  Math.random() * 1000000000)),
        x: new Date(Math.floor(1473700105009 +  Math.random() * 1000000000)),
        y: 81.4,
        r: 63
      },
      {
        name: new Date(Math.floor(1473700105009 +  Math.random() * 1000000000)),
        x: new Date(Math.floor(1473700105009 +  Math.random() * 1000000000)),
        y: 79.1,
        r: 59.4
      },
      {
        name: new Date(Math.floor(1473700105009 +  Math.random() * 1000000000)),
        x: new Date(Math.floor(1473700105009 +  Math.random() * 1000000000)),
        y: 77.2,
        r: 56.9
      }
    ]
  },
  {
    name: 'United Kingdom',
    series: [
      {
        name: new Date(Math.floor(1473700105009 +  Math.random() * 1000000000)),
        x: new Date(Math.floor(1473700105009 +  Math.random() * 1000000000)),
        y: 80.2,
        r: 62.7
      },
      {
        name: new Date(Math.floor(1473700105009 +  Math.random() * 1000000000)),
        x: new Date(Math.floor(1473700105009 +  Math.random() * 1000000000)),
        y: 77.8,
        r: 58.9
      },
      {
        name: new Date(Math.floor(1473700105009 +  Math.random() * 1000000000)),
        x: new Date(Math.floor(1473700105009 +  Math.random() * 1000000000)),
        y: 75.7,
        r: 57.1
      }
    ]
  }
];

export const countries = ['Hastane', 'Bilgi İşlem', 'Kütüphane', 
'Mühendislik', 'Donanım', 'Rektörlük'
];

export function generateGraph(nodeCount: number) {
  const nodes = [];
  const links = [];
  for (let i = 0; i < nodeCount; i++) {
    const country = countries[Math.floor(Math.random() * countries.length)];
    nodes.push({
      value: country,
    });
    for (let j = 0; j < nodes.length - 1; j++) {
      if (Math.random() < 0.03) {
        links.push({
          source: country,
          target: nodes[j].value,
        });
      }
    }
  }
  return { links, nodes };
}

export function generateData(seriesLength: number, includeMinMaxRange: boolean): any[] {
  const results = [];

  const domain: Date[] = []; // array of time stamps in milliseconds

  for (let j = 0; j < 8; j++) {
    // random dates between Sep 12, 2016 and Sep 24, 2016
    domain.push(new Date(Math.floor(1473700105009 +  Math.random() * 1000000000)));
  }

  for (let i = 0; i < seriesLength; i++) {
    const country = countries[Math.floor(Math.random() * countries.length)];
    const series = {
      name: country,
      series: []
    };

    for (let j = 0; j < domain.length; j++) {
      const value = Math.floor(2 + Math.random() * 5);
      // let timestamp = Math.floor(1473700105009 + Math.random() * 1000000000);
      const timestamp = domain[j];
      if (includeMinMaxRange) {
        const errorMargin = 0.02 + Math.random() * 0.08;

        series.series.push({
          value,
          name: timestamp,
          min: Math.floor(value * (1 - errorMargin)),
          max: Math.ceil(value * (1 + errorMargin))
        });
    } else {
        series.series.push({
          value,
          name: timestamp
        });
      }
    }

    results.push(series);
  }
  return results;
}
