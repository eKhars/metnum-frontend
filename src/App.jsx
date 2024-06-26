import React, { useState } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';
import { log } from 'mathjs';

function App() {
  const [method, setMethod] = useState("");
  const [func, setFunc] = useState("");
  const [intervalStart, setIntervalStart] = useState("");
  const [intervalEnd, setIntervalEnd] = useState("");
  const [iteracion, setIteracion] = useState("");
  const [errorMargin, setErrorMargin] = useState("");
  const [plotData, setPlotData] = useState(null);
  const [tableData, setTableData] = useState(null);
  const [solution, setSolution] = useState(null);
  const [iterationsCount, setIterationsCount] = useState(null);
  const [errorPercentage, setErrorPercentage] = useState(null);

  const backend = "http://localhost:3000/solve";

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Aquí puedes realizar la lógica para manejar el envío del formulario
    console.log("Método:", method);
    console.log("Función:", func);
    console.log("Intervalo de inicio:", intervalStart);
    console.log("Intervalo de fin:", intervalEnd);
    console.log("Iteracion:", iteracion);
    console.log("Margen de error:", errorMargin);

    if (
      !method ||
      !func ||
      !intervalStart ||
      !intervalEnd ||
      !iteracion ||
      !errorMargin
    ) {
      alert("Por favor, completa todos los campos");
      return;
    } else if (method === "newtonRaphson") {
      const data = {
        metodo: method,
        funcion: func,
        xi: parseFloat(intervalStart),
        xf: parseFloat(intervalEnd),
        iteraciones: parseInt(iteracion),
        error_permisible: parseFloat(errorMargin),
      };
      try {
        const result = await axios.post(backend, data);
        console.log(result.data);

        // Actualizar el estado con los datos de la tabla
        setTableData(result.data.tabla);
        setSolution(result.data.solucion);
        setIterationsCount(result.data.iteraciones);
        setErrorPercentage(result.data.error * 100);

      } catch (error) {
        console.log(error);
        return;
      }
    } else {
      const data = {
        metodo: method,
        funcion: `(x) => ${func}`,
        xi: parseFloat(intervalStart),
        xf: parseFloat(intervalEnd),
        iteraciones: parseInt(iteracion),
        error_permisible: parseFloat(errorMargin),
      };
      try {

        const result = await axios.post(backend, data);
        console.log(result.data);

        // Actualizar el estado con los datos de la tabla
        setTableData(result.data.tabla);
        setSolution(result.data.solucion);
        setIterationsCount(result.data.iteraciones);
        setErrorPercentage(result.data.error * 100);

      } catch (error) {
        console.log(error.message);
        return;
      }
    }
    const x = [];
    const y = [];
    const start = parseFloat(intervalStart);
    const end = parseFloat(intervalEnd);
    const step = (end - start) / 100;
    for (let i = start - step; i <= end + step; i += step) {
      x.push(i);
      const parsedFunc = func.replace(/\^/g, "**");
      const evaluatedFunc = parsedFunc.replace(/x/g, `(${i})`);
      y.push(eval(evaluatedFunc));
    }
    setPlotData({ x, y });
  };


  return (
    <div className="">
      <div className="flex w-full ">
        <form onSubmit={handleSubmit} className="flex-1 ml-8 mt-16">
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="method"
            >
              Método
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="method"
              value={method}
              onChange={(event) => setMethod(event.target.value)}
            >
              <option value="">Seleccionar método</option>
              <option value="falsaPosicion">Falsa Posición</option>
              <option value="biseccion">Bisección</option>
              <option value="newtonRaphson">Newton-Raphson</option>
              <option value="secante">Secante</option>
            </select>
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="function"
            >
              Función
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="function"
              type="text"
              placeholder="Ingrese una función, por ejemplo: x^2-2"
              value={func}
              onChange={(event) => setFunc(event.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="intervalStart"
            >
              Intervalo de inicio
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="intervalStart"
              type="number"
              placeholder="Inicio del intervalo"
              value={intervalStart}
              onChange={(event) => setIntervalStart(event.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="intervalEnd"
            >
              Intervalo de fin
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="intervalEnd"
              type="number"
              placeholder="Fin del intervalo"
              value={intervalEnd}
              onChange={(event) => setIntervalEnd(event.target.value)}
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="iteracion"
            >
              Iteracion
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="iteracion"
              type="number"
              placeholder="Iteraciones maximas permitidas"
              value={iteracion}
              onChange={(event) => setIteracion(event.target.value)}
            />
          </div>

          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="errorMargin"
            >
              Margen de error
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="errorMargin"
              type="number"
              step="any"
              placeholder="Margen de error"
              value={errorMargin}
              onChange={(event) => setErrorMargin(event.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Enviar
            </button>
          </div>
        </form>
        {plotData && (
          <div className="flex-1">
            <div className="mt-8">
              <Plot
                data={[
                  {
                    x: plotData.x,
                    y: plotData.y,
                    type: "scatter",
                    mode: "lines",
                    marker: { color: "blue" },
                  },
                ]}
                layout={{
                  width: 600,
                  height: 400,
                  title: "Gráfica de la función",
                }}
              />
            </div>
            {solution && ( // Mostrar la solución si está disponible
              <div className="mt-4">
                <p>Solución aproximada: {solution}</p>
                <p>Encontrada en {iterationsCount} iteraciones.</p>
                <p>Con un error de: {errorPercentage}%</p>
              </div>
            )}
            {tableData && ( // Mostrar la tabla si hay datos disponibles
              <div className="mt-8 max-h-96 overflow-y-auto">
                <table className="table-auto">
                  <thead>
                    <tr>
                      {Object.keys(tableData[0]).map((key) => (
                        <th key={key} className="px-4 py-2 bg-gray-800 text-white">{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((row, index) => (
                      <tr key={index}>
                        {Object.values(row).map((value, idx) => (
                          <td key={idx} className="px-4 py-2 border">{value}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
