import "react";
import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";

export default function ContentState() {
  const getList = async (setLista) => {
    try {
      const response = await fetch("https://api.cvimport.com/api/warehouse");
      if (response.ok) {
        const data = await response.json();
        setLista(data.data);
      } else {
        console.error(
          "Error al obtener la lista de trabajadores",
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error al obtener la lista de trabajadores", error);
    }
  };

  const [contador, setContador] = useState(0);
  const [nombre, setNombre] = useState();
  const [lista, setLista] = useState([]);

  const handleViewNombre = (event) => {
    setNombre(event.target.value);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Nombres", width: 200 },
    { field: "quantity", headerName: "Cantidad", width: 130 },
    { field: "created_at", headerName: "Fecha Creación", width: 170 },
    {
      field: "acciones",
      headerName: "Acciones",
      width: 180,
    },
  ];

  useEffect(() => {
    getList(setLista); // Pasamos setLista como parámetro
  }, []);

  useEffect(() => {
    alert(`${nombre} el contador ha cambiado: ${contador}`);
  }, [contador]);

  return (
    <div className="content-wrapper p-4">
      <p>
        {nombre} tu tienes: {contador}
      </p>
      <button onClick={() => setContador(contador + 1)}>
        Sumale uno a: {contador}
      </button>
      <input
        type="text"
        value={nombre}
        onChange={handleViewNombre}
        placeholder="Ingresa tu nombre"
      />

      <br />
      <br />
        <DataGrid rows={lista} columns={columns} />
    </div>
  );
}
