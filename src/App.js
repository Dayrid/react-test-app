import Plot from 'react-plotly.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import {useEffect, useState} from 'react';

function generateData(func, n = 1000) {
  const x = Array.from({ length: n }, (_, i) => (i - n / 2));
  const y = Array.from({ length: n }, (_, i) => func(i) * 0.6);
  return { x, y };
}

function linearInterpolation(x, y, numPoints = 1000) {
  const interpolatedX = Array.from({ length: numPoints }, (_, i) => {
    return (i * (x[x.length - 1] - x[0])) / (numPoints - 1) + x[0];
  });

  const interpolatedY = interpolatedX.map(xValue => {
    const idx = x.findIndex(val => val > xValue);
    if (idx === 0 || idx === -1) {
      return y[0];
    }
    const x0 = x[idx - 1];
    const x1 = x[idx];
    const y0 = y[idx - 1];
    const y1 = y[idx];
    const t = (xValue - x0) / (x1 - x0);

    return y0 + t * (y1 - y0);
  });

  return { x: interpolatedX, y: interpolatedY };
}

function RandomScatterPlot({ title, x, y }) {
  const { x: sampledX, y: sampledY } = linearInterpolation(x, y, 1000);

  return (
    <Plot
      data={[
        {
          x: sampledX,
          y: sampledY,
          mode: 'lines',
          type: 'scattergl',
          line: { shape: 'linear', color: 'blue' },
        },
      ]}
      layout={{
        title: title,
        autosize: true,
        xaxis: { title: 'X Axis', autorange: true },
        yaxis: { title: 'Y Axis', autorange: true },
        margin: { t: 50, r: 50, b: 50, l: 50 },
      }}
      style={{ width: '100%', height: '100%' }}
      useResizeHandler={true}
    />
  );
}

function App() {
  const sin = (x) => Math.sin(x);
  const cos = (x) => Math.cos(x);
  const tan = (x) => Math.tan(x);
  const cotan = (x) => 1 / Math.tan(x);

  const points_obj = {
    1000: '1000 точек',
    10000: '10 000 точек',
    100000: '100 000 точек',
    1000000: '1 000 000 точек',
  }
  const func_obj = {
    'sin': 'sin(x)',
    'cos': 'cos(x)',
    'tan': 'tan(x)',
    'cotan': 'cotan(x)',
  }

  const [plot_data, setPlotData] = useState({ x: [0], y: [0] });
  const [plot_type, setPlotType] = useState('sin');
  const [points, setPoints] = useState(1000);

  const changeSelectType = (event) => {
    setPlotType(event.target.value);
  };

  const changeSelectPoints = (event) => {
    setPoints(event.target.value);
  };

  useEffect(() => {
    if (plot_type === 'sin') {
      setPlotData(generateData(sin, points));
    } else if (plot_type === 'cos') {
      setPlotData(generateData(cos, points));
    } else if (plot_type === 'tan') {
      setPlotData(generateData(tan, points));
    } else if (plot_type === 'cotan') {
      setPlotData(generateData(cotan, points));
    } else {
      setPlotData(generateData(sin, points));
    }
  }, [plot_type, points]);


  return (
    <div className='d-flex flex-column w-100 h-100'>
      <div className='d-flex flex-row w-100 gap-2 pt-3 ps-3'>
        <label className='text-black'>Тип графика: </label>
        <select id="type" value={plot_type} onChange={changeSelectType}>
          {Object.entries(func_obj).map(([key, value]) => (
            <option key={key} value={key}>{value}</option>
          ))}
        </select>
        <label>Тип графика: </label>
        <select id="points" value={points} onChange={changeSelectPoints}>
          {Object.entries(points_obj).map(([key, value]) => (
            <option key={key} value={key}>{value}</option>
          ))}
        </select>
      </div>
      <div>
        <RandomScatterPlot title="Scattergl plot" x={plot_data.x} y={plot_data.y} />
      </div>
    </div>
  );
}

export default App;
