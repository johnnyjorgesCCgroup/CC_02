import { useEffect, useState } from "react";
import Chart from 'chart.js/auto';
import { Doughnut, Bar, Line } from "react-chartjs-2";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';

const options = {
  maintainAspectRatio: false,
};

export const SkuCard = ({ selectedMoveDetails }) => {
  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">SKU</h5>
        {selectedMoveDetails && selectedMoveDetails.skuProduct && (
          <p className="card-text">{selectedMoveDetails.skuProduct}</p>
        )}
      </div>
    </div>
  );
};
export const getList = async (setLista, setTotalMoves, fromDate, toDate) => {
  try {
    const response = await fetch(`https://api.cvimport.com/api/inventoryMoves?fromDate=${fromDate}&toDate=${toDate}`);
    if (response.ok) {
      const data = await response.json();
      setLista(data.data);
      setTotalMoves(data.data.length);
    } else {
      console.error(
        "Error al obtener la lista de movimientos",
        response.statusText
      );
    }
  } catch (error) {
    console.error("Error al obtener la lista de movimientos", error);
  }
};

const getTopMoves = (moves) => {
  const sortedMoves = moves.slice().sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
  return sortedMoves.slice(0, 3);
};

const MoveDoughnut = ({ moves }) => {
  const [moveCounts, setMoveCounts] = useState([]);

  useEffect(() => {
    const counts = getMoveCountsByType(moves);
    setMoveCounts(counts);
  }, [moves]);

  const getMoveCountsByType = (moves) => {
    const moveTypes = moves.map(move => move.tipo);
    const uniqueMoveTypes = [...new Set(moveTypes)];
    const moveCounts = uniqueMoveTypes.map(type => {
      const count = moves.filter(move => move.tipo === type).length;
      return { type, count };
    });
    return moveCounts;
  };

  const labels = moveCounts.map(move => move.type);
  const data = moveCounts.map(move => move.count);
  const doughnutData = {
    labels,
    datasets: [
      {
        label: 'Movimientos por Tipo',
        data,
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#66FF99' // Puedes agregar más colores si es necesario
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#66FF99' // Puedes agregar más colores si es necesario
        ]
      }
    ]
  };

  return (
    <div style={{ width: 400, height: 400 }}>
      <Doughnut data={doughnutData} options={options} />
    </div>
  );
};

export default function DashboardMoves() {
  const [lista, setLista] = useState([]);
  const [totalMoves, setTotalMoves] = useState(0);
  const [filteredMoves, setFilteredMoves] = useState([]);
  const [topMoves, setTopMoves] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedMoveDetails, setSelectedMoveDetails] = useState(null);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [selectedDocumentType, setSelectedDocumentType] = useState(null);
  const [selectedProductName, setSelectedProductName] = useState(null);
  const [productNames, setProductNames] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedChartType, setSelectedChartType] = useState('doughnut');
  const [barChartData, setBarChartData] = useState({});
  const [selectedMonth, setSelectedMonth] = useState('');
  const [monthView, setMonthView] = useState(false);
  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };
  const handleMonthlyButtonClick = () => {
    setSelectedMonth('');
    setMonthView(false);
  }

  useEffect(() => {
    getList(setLista, setTotalMoves, fromDate, toDate);
  }, [fromDate, toDate]);

  useEffect(() => {
    const names = lista.map(move => move.nameProduct);
    setProductNames([...new Set(names)]);
  }, [lista]);

  const moveEntities = lista.map(move => move.entity);
  const uniqueEntities = [...new Set(moveEntities)];
  const moveDocumentTypes = lista.map(move => move.document_type.trim());
  const uniqueDocumentTypes = [...new Set(moveDocumentTypes)];
  const totalEntradas = filteredMoves.filter(move => move.tipo === "Entrada").length;
  const totalSalidas = filteredMoves.filter(move => move.tipo === "Salida").length;
  const totalPriceEntradas = filteredMoves
    .filter(move => move.tipo === "Entrada")
    .reduce((total, move) => total + parseFloat(move.price) * move.quantity, 0);
  const totalPriceSalidas = filteredMoves
    .filter(move => move.tipo === "Salida")
    .reduce((total, move) => total + parseFloat(move.price) * move.quantity, 0);
  const handleEntityChange = (event, value) => {
    setSelectedEntity(value);
  };
  const handleDocumentTypeChange = (event, value) => {
    setSelectedDocumentType(value);
  };
  const handleProductChange = (event, value) => {
    setSelectedProductName(value);
    const selectedMove = lista.find(move => move.nameProduct === value);
    setSelectedMoveDetails(selectedMove); // Actualiza los detalles del movimiento seleccionado
  };
  const handleFromDateChange = (event) => {
    setFromDate(event.target.value);
  };
  const handleToDateChange = (event) => {
    setToDate(event.target.value);
  };
  const refreshData = async () => {
    try {
      if (fromDate !== '' && toDate !== '') {
        await getList(setLista, setTotalMoves, fromDate, toDate);
      } else {
        console.error("Las fechas 'Desde' y 'Hasta' son requeridas.");
      }
      setSelectedMoveDetails(null);
      setSelectedEntity(null); // Restablecer el valor seleccionado de entidad
      setSelectedDocumentType(null); // Restablecer el valor seleccionado de tipo de documento
      setSelectedProductName(null); // Restablecer el valor seleccionado de nombre del producto
      setFromDate(''); // Restablecer la fecha de inicio a una cadena vacía
      setToDate(''); // Restablecer la fecha de fin a una cadena vacía
      setSelectedChartType('doughnut'); // Restablecer el tipo de gráfico seleccionado
    } catch (error) {
      console.error("Error al actualizar los datos:", error);
    }
  };

  useEffect(() => {
    const filteredMoves = lista.filter(move => {
      return (!selectedEntity || move.entity === selectedEntity) &&
        (!selectedDocumentType || move.document_type.trim() === selectedDocumentType) &&
        (!selectedProductName || move.nameProduct === selectedProductName) &&
        (!fromDate || move.date >= fromDate) &&
        (!toDate || move.date <= toDate) &&
        (!selectedMonth || new Date(move.date).getMonth() === meses.indexOf(selectedMonth))
    });

    setFilteredMoves(filteredMoves);
    setTotalMoves(filteredMoves.length);

    const totalPrice = filteredMoves.reduce((total, move) => {
      return total + parseFloat(move.price) * move.quantity;
    }, 0);

    setTotalPrice(totalPrice);

    // Actualiza los datos para los gráficos de barras y líneas
    const entryMoneyByMonth = getMoneyByMonth(filteredMoves, 'Entrada');
    const exitMoneyByMonth = getMoneyByMonth(filteredMoves, 'Salida');
    const barChartData = {
      labels: getDaysInMonth(selectedMonth),
      datasets: [
        {
          label: 'Entradas',
          backgroundColor: '#36A2EB',
          data: entryMoneyByMonth,
        },
        {
          label: 'Salidas',
          backgroundColor: '#FF6384',
          data: exitMoneyByMonth,
        },
      ],
    };
    setBarChartData(barChartData); // Asume que hay un estado para el gráfico de barras
  }, [lista, selectedEntity, selectedDocumentType, selectedProductName, fromDate, toDate, selectedMonth]);

  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  const getDaysInMonth = (selectedMonth) => {
    if (selectedMonth) {
      const year = new Date().getFullYear(); // Obtener el año actual
      const monthIndex = meses.indexOf(selectedMonth); // Obtener el índice del mes seleccionado
      const filteredMoves = lista.filter(move => {
        const moveDate = new Date(move.date);
        return moveDate.getMonth() === monthIndex && moveDate.getFullYear() === year;
      }); // Filtrar los movimientos por mes y año
      const uniqueDates = [...new Set(filteredMoves.map(move => move.date))]; // Obtener fechas únicas
      return uniqueDates;
    } else {
      return meses; // Si no se ha seleccionado un mes, devolver los nombres de los meses
    }
  };
  const totalPriceFormatted = totalPrice.toFixed(2);

  useEffect(() => {
    const topMoves = getTopMoves(filteredMoves);
    setTopMoves(topMoves);
  }, [filteredMoves]);

  const getMoneyByMonth = (moves, type) => {
    const monthlyTotals = new Array(12).fill(0); // Inicializa un array con 12 elementos (uno por cada mes) y valor 0

    moves.forEach(move => {
      const monthIndex = new Date(move.date).getMonth(); // Obtiene el índice del mes (0-11)
      if (move.tipo === type) {
        const totalForMove = parseFloat(move.price) * move.quantity;
        monthlyTotals[monthIndex] += totalForMove;
      }
    });
    return monthlyTotals;
  };

  return (
    <div className="content-wrapper">
      <div className="card" style={{ padding: 20 }}>
        <div className="card card-outline">
          <div className="card-header">
            <h3 className="card-title">
              <b style={{ textAlign: "center" }}>Dashboard Movimientos</b>
            </h3>
          </div>
          <div className="card-body d-flex justify-content-center align-items-center">
            <TextField
              id="date-from"
              label="Desde"
              type="date"
              sx={{ width: 200 }}
              onChange={handleFromDateChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              id="date-to"
              label="Hasta"
              type="date"
              sx={{ width: 200 }}
              onChange={handleToDateChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <Autocomplete
              disablePortal
              id="combo-box-product-name"
              options={productNames}
              sx={{ width: 280 }}
              renderInput={(params) => <TextField {...params} label="Nombre del Producto" />}
              onChange={handleProductChange}
              value={selectedProductName}
            />
            <Autocomplete
              disablePortal
              id="combo-box-entity"
              options={uniqueEntities}
              sx={{ width: 150 }}
              renderInput={(params) => <TextField {...params} label="Entidad" />}
              onChange={handleEntityChange}
              value={selectedEntity}
            />
            <Autocomplete
              disablePortal
              id="combo-box-document-type"
              options={uniqueDocumentTypes}
              sx={{ width: 150 }}
              renderInput={(params) => <TextField {...params} label="Tipo de Documento" />}
              onChange={handleDocumentTypeChange}
              value={selectedDocumentType}
            />
            <button className="btn btn-primary" style={{ height: 55 }} onClick={refreshData}><i className="fas fa-arrows-rotate"></i></button>
          </div>
          <div style={{ display: "block" }}>
            <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
              <div id="dona">
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Button
                    variant={selectedChartType === 'doughnut' ? 'contained' : 'outlined'}
                    className="m-1"
                    style={{ backgroundColor: selectedChartType === 'doughnut' ? '#FF6384' : 'white', color: selectedChartType === 'doughnut' ? 'white' : '#FF6384', borderColor: selectedChartType === 'doughnut' ? 'white' : '#FF6384' }}
                    onClick={() => setSelectedChartType('doughnut')} // Actualiza el tipo de gráfico al hacer clic
                  >
                    <i className="fas fa-chart-pie" style={{ fontSize: "20px" }}></i>
                  </Button>
                  <Button
                    variant={selectedChartType === 'simple' ? 'contained' : 'outlined'}
                    className="m-1"
                    style={{ backgroundColor: selectedChartType === 'simple' ? '#FF6384' : 'white', color: selectedChartType === 'simple' ? 'white' : '#FF6384', borderColor: selectedChartType === 'simple' ? 'white' : '#FF6384' }}
                    onClick={() => {
                      setSelectedChartType('simple'); // Actualiza el tipo de gráfico al hacer clic
                      setShowBarChart(true); // Muestra el gráfico de barras al hacer clic
                    }}
                  >
                    <i className="fas fa-chart-simple" style={{ fontSize: "20px" }}></i>
                  </Button>
                  <Button
                    variant={selectedChartType === 'line' ? 'contained' : 'outlined'}
                    className="m-1"
                    style={{ backgroundColor: selectedChartType === 'line' ? '#FF6384' : 'white', color: selectedChartType === 'line' ? 'white' : '#FF6384', borderColor: selectedChartType === 'line' ? 'white' : '#FF6384' }}
                    onClick={() => {
                      setSelectedChartType('line'); // Actualiza el tipo de gráfico al hacer clic
                      setShowBarChart(true); // Muestra el gráfico de barras al hacer clic
                    }} // Actualiza el tipo de gráfico al hacer clic
                  >
                    <i className="fas fa-chart-line" style={{ fontSize: "20px" }}></i>
                  </Button>
                  <div style={{ display: selectedChartType === 'simple' || selectedChartType === 'line' ? 'flex' : 'none' }}>
                    <Button variant="text" onClick={handleMonthlyButtonClick} style={{ fontSize: "10px", color: "#FF6384" }}>Mensual</Button>
                    <select
                      className="form-control"
                      id="month-select"
                      value={selectedMonth}
                      onChange={handleMonthChange}
                      style={{ fontSize: "13px", color: "#FF6384", borderColor: "white", width: "20px" }}
                    >
                      {meses.map((month, index) => (
                        <option key={index} value={month}>{month}</option>
                      ))}
                    </select>
                  </div>
                </div>
                {selectedChartType === 'doughnut' && (
                  <MoveDoughnut moves={filteredMoves} />
                )}

                {selectedChartType === 'simple' && (
                  <div style={{ width: 600, height: 400, padding: "10px" }}>
                    <Bar
                      data={barChartData}
                      width={400}
                      height={200}
                      options={{
                        maintainAspectRatio: false,
                        scales: {
                          yAxes: [
                            {
                              ticks: {
                                beginAtZero: true,
                              },
                            },
                          ],
                        },
                      }}
                    />
                  </div>
                )}
                {selectedChartType === 'line' && (
                  <div style={{ width: 600, height: 400, padding: "10px" }}>
                    <Line
                      data={barChartData}
                      width={400}
                      height={200}
                      options={{
                        maintainAspectRatio: false,
                        scales: {
                          yAxes: [
                            {
                              ticks: {
                                beginAtZero: true,
                              },
                            },
                          ],
                        },
                        elements: {
                          line: {
                            tension: 0.4, // Ajusta el ancho de las líneas aquí
                          },
                        },
                      }}
                    />
                  </div>
                )}
              </div>
              <div style={{ display: "block" }} id="top3yEntradasySalidas">
                <div id="entradasYsalidas" style={{ display: "flex" }}>
                  <div className="ml-2" id="totalMovimientosYprecioTotal" style={{ display: "block" }}>
                    <div className="card bg-light mb-3">
                      <div className="card-header">Cantidad de Movimientos</div>
                      <div className="card-body">
                        <p className="card-text">
                          <h4>{totalMoves}</h4>
                        </p>
                      </div>
                    </div>
                    <div className="card bg-light mb-3">
                      <div className="card-header">Precio Total</div>
                      <div className="card-body">
                        <p className="card-text">
                          <h4>S/ {totalPriceFormatted}</h4>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="ml-2" id="totalEntradasSalidas" style={{ display: "block" }}>
                    <div id="movesEntradasSalidas" style={{ display: "flex", }}>
                      <div>
                        <div className="card bg-light mb-3" style={{ width: "auto" }}>
                          <div className="card-header">N° Entradas</div>
                          <div className="card-body">
                            <p className="card-text">
                              <h4>{totalEntradas}</h4>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="card bg-light mb-3 ml-2" style={{ width: "auto" }}>
                          <div className="card-header">N° Salidas</div>
                          <div className="card-body">
                            <p className="card-text">
                              <h4>{totalSalidas}</h4>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div id="preciosEntradasSalidas" style={{ display: "flex" }}>
                      <div>
                        <div className="card bg-light mb-3" style={{ width: "auto" }}>
                          <div className="card-header">$ Entradas</div>
                          <div className="card-body">
                            <p className="card-text">
                              <h4>S/ {totalPriceEntradas.toFixed(2)}</h4>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="card bg-light mb-3 ml-2" style={{ width: "auto" }}>
                          <div className="card-header">$ Salidas</div>
                          <div className="card-body">
                            <p className="card-text">
                              <h4>S/ {totalPriceSalidas.toFixed(2)}</h4>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ width: "100%", display: "flex", justifyContent: "center" }} id="top3">
                  <div className="card bg-light mb-3 ml-2" style={{ width: "100%" }}>
                    <div className="card-header"><i className="fas fa-trophy"></i> Top 3 Movimientos</div>
                    <div className="card-body">
                      {topMoves.map((move, index) => (
                        <div key={index} className="card-text">
                          <p style={{ fontSize: 13 }}><i className="fas fa-award"></i> {move.nameProduct}</p>
                          <p style={{ fontSize: 10 }}>Precio: S/ {move.price}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card-footer clearfix">
            <SkuCard selectedMoveDetails={selectedMoveDetails} />
          </div>
        </div>
      </div>
    </div>
  );
}