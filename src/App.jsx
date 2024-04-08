import React, { useState } from 'react';
import Plot from 'react-plotly.js';

function FunctionPlot() {
  const [functionString, setFunctionString] = useState('');
  const [startInterval, setStartInterval] = useState('');
  const [endInterval, setEndInterval] = useState('');
  const [errorMargin, setErrorMargin] = useState('');
  const [plotData, setPlotData] = useState(null);

  const handlePlot = () => {
    // Convertir los intervalos y el margen de error a números
    const start = parseFloat(startInterval);
    const end = parseFloat(endInterval);
    const error = parseFloat(errorMargin);

    // Verificar si los datos son válidos
    if (isNaN(start) || isNaN(end) || isNaN(error) || start >= end) {
      alert('Por favor, ingrese intervalos válidos.');
      return;
    }

    // Generar puntos para la gráfica
    const xValues = [];
    const yValues = [];
    for (let x = start; x <= end; x += 0.1) {
      xValues.push(x);
      yValues.push(evaluateFunction(x));
    }

    // Actualizar los datos de la gráfica
    setPlotData({
      x: xValues,
      y: yValues,
      type: 'scatter',
      mode: 'lines',
      marker: { color: 'blue' },
    });
  };

  const evaluateFunction = (x) => {
    try {
      // Evaluar la función matemática
      return eval(functionString);
    } catch (error) {
      console.error('Error al evaluar la función:', error);
      return null;
    }
  };

  return (
    <div>
      <h2>Ingrese los datos de la función:</h2>
      <label>
        Función: 
        <input type="text" value={functionString} onChange={(e) => setFunctionString(e.target.value)} />
      </label>
      <br />
      <label>
        Inicio del intervalo:
        <input type="text" value={startInterval} onChange={(e) => setStartInterval(e.target.value)} />
      </label>
      <br />
      <label>
        Fin del intervalo:
        <input type="text" value={endInterval} onChange={(e) => setEndInterval(e.target.value)} />
      </label>
      <br />
      <label>
        Margen de error:
        <input type="text" value={errorMargin} onChange={(e) => setErrorMargin(e.target.value)} />
      </label>
      <br />
      <button onClick={handlePlot}>Generar Gráfica</button>
      <br />
      {plotData && (
        <Plot
          data={[plotData]}
          layout={{
            width: 800,
            height: 400,
            title: 'Gráfico de Función',
            xaxis: { title: 'X' },
            yaxis: { title: 'Y' },
          }}
        />
      )}
    </div>
  );
}

export default FunctionPlot;
