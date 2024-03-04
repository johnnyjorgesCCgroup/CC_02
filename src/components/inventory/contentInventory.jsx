import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Modal, Typography, Button, Box, TextField, FormControl, InputLabel, Select, MenuItem, Switch } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faDownload } from '@fortawesome/free-solid-svg-icons';

export default function contentInventory() {
    const [incidentes, setIncidentes] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedIncident, setSelectedIncident] = useState(null);
    const [switchOn, setSwitchOn] = useState(false);
    const [nuevaIncidencia, setNuevaIncidencia] = useState({});
    const [crearModalOpen, setCrearModalOpen] = useState(false);

    const obtenerIncidentes = async () => {
        try {
            const response = await fetch("http://40.71.163.209:3000/inventario");
            if (response.ok) {
                const data = await response.json();
                setIncidentes(data);
            } else {
                console.error("Error de fetch", response.statusText);
            }
        } catch (error) {
            console.error("Error de bd", error);
        }
    }

    const label = { inputProps: { 'aria-label': 'Size switch demo' } };

    useEffect(() => {
        obtenerIncidentes();
    }, []);

    const handleRowClick = (id) => {
        const incident = incidentes.find(incidente => incidente.id === id);
        setSelectedIncident(incident);
        setModalOpen(true);
    }

    const handleCloseModal = () => {
        setModalOpen(false);
    }

    const handleOpenCrearModal = () => {
        setCrearModalOpen(true);
    }

    const handleSwitchChange = () => {
        setSwitchOn(!switchOn);
    }

    const handleNuevaIncidenciaChange = (e) => {
        const { name, value } = e.target;
        setNuevaIncidencia({ ...nuevaIncidencia, [name]: value });
    }

    const handleEstadoChange = (e) => {
        const { value } = e.target;
        setNuevaIncidencia({ ...nuevaIncidencia, estado: value });
    }

    const handleCrearIncidencia = async () => {
        try {
            const response = await fetch("http://40.71.163.209:3000/inventario", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(nuevaIncidencia),
            });
            if (response.ok) {
                console.log("Incidencia creada correctamente");
                setCrearModalOpen(false); // Cerrar el modal después de crear la incidencia
                obtenerIncidentes(); // Volver a cargar los incidentes
            } else {
                console.error("Error al crear la incidencia", response.statusText);
            }
        } catch (error) {
            console.error("Error de conexión al crear la incidencia", error);
        }
    }

    const buttonBackgroundColor = switchOn ? "#22FF94" : "#9C27B0";

    const columns = [
        { field: 'id', headerName: 'ID', flex: 1 },
        { field: 'fecha', headerName: 'Fecha', flex: 1 },
        { field: 'nombre', headerName: 'Nombre', flex: 1 },
        { field: 'estado', headerName: 'Estado', flex: 1 },
        { field: 'empleado', headerName: 'Empleado', flex: 1 },
        { field: 'area', headerName: 'Area', flex: 1 },
        {
            field: 'action',
            headerName: 'Acción',
            flex: 1,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    style={{ backgroundColor: switchOn ? "#9C27B0" : "#22FF94", color: switchOn ? "white" : "black" }}
                    size="small"
                    onClick={() => handleRowClick(params.row.id)}
                >
                    Ver Detalles
                </Button>
            ),
        },
    ];

    const options = {
        filterType: 'checkbox',
        print: false,
        search: true,
    };

    return (
        <div className="content-wrapper">
            <div className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-6">
                            <div style={{ display: "flex" }}>
                                <h1 className="m-0">Inventario</h1>
                                <Switch id="switch1" {...label} checked={switchOn} onChange={handleSwitchChange} color="secondary" />
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <ol className="breadcrumb float-sm-right">
                                <li className="breadcrumb-item">
                                    <a href="#">Home</a>
                                </li>
                                <li className="breadcrumb-item active">Inventario</li>
                            </ol>
                        </div>
                    </div>
                </div>
                <div className="content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="card">
                                    <div className="card-header border-0">
                                        <div className="d-flex justify-content-between">
                                            <h3 className="card-title">Listado de Inventario</h3>
                                            <div className='justify-content-end'>
                                                <Button
                                                    variant="contained"
                                                    style={{ backgroundColor: switchOn ? "#55CD49" : "#DAF7A6", color: switchOn ? "white" : "black" }}
                                                    startIcon={<FontAwesomeIcon icon={faDownload} />}
                                                >
                                                    Descargar
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    style={{ backgroundColor: switchOn ? "#9C27B0" : "#22FF94", color: switchOn ? "white" : "black", marginLeft: "4px" }}
                                                    startIcon={<FontAwesomeIcon icon={faPlusCircle} />}
                                                    onClick={handleOpenCrearModal}
                                                >
                                                    Añadir Activo
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='card-body'>
                                        <Box display="flex" justifyContent="center" alignItems="center">
                                            <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', width: '100%' }}>
                                                <DataGrid
                                                    rows={incidentes}
                                                    columns={columns}
                                                    pageSize={5}
                                                    rowsPerPageOptions={[5, 10, 25]}
                                                    autoHeight
                                                    checkboxSelection
                                                    {...options}
                                                />
                                            </div>
                                            <Modal open={crearModalOpen} onClose={() => setCrearModalOpen(false)}>
                                                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>
                                                    <Typography variant="h6" gutterBottom component="div">
                                                        Agregar nuevo activo
                                                    </Typography>
                                                    <Box>
                                                        <TextField
                                                            id="nombre"
                                                            label="Nombre"
                                                            type="search"
                                                            fullWidth
                                                            margin="normal"
                                                            value={nuevaIncidencia.nombre || ''}
                                                            onChange={handleNuevaIncidenciaChange}
                                                            name="nombre"
                                                        />
                                                        <FormControl fullWidth>
                                                            <InputLabel id="demo-simple-select-label">Estado</InputLabel>
                                                            <Select
                                                                labelId="demo-simple-select-label"
                                                                id="demo-simple-select"
                                                                value={nuevaIncidencia.estado || ''}
                                                                onChange={handleEstadoChange}
                                                                name="estado"
                                                            >
                                                                <MenuItem value={"Activo"}>Activo</MenuItem>
                                                                <MenuItem value={"Inactivo"}>Inactivo</MenuItem>
                                                                <MenuItem value={"Dañado"}>Dañado</MenuItem>
                                                                <MenuItem value={"En Reparacion"}>En reparación</MenuItem>
                                                                <MenuItem value={"Sin Solución"}>Sin solución</MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                        <TextField
                                                            id="empleado"
                                                            label="Empleado"
                                                            type="search"
                                                            fullWidth
                                                            margin="normal"
                                                            value={nuevaIncidencia.empleado || ''}
                                                            onChange={handleNuevaIncidenciaChange}
                                                            name="empleado"
                                                        />
                                                        <TextField
                                                            id="area"
                                                            label="Area"
                                                            type="search"
                                                            fullWidth
                                                            margin="normal"
                                                            value={nuevaIncidencia.area || ''}
                                                            onChange={handleNuevaIncidenciaChange}
                                                            name="area"
                                                        />
                                                        <TextField
                                                            id="detalles"
                                                            label="Observación"
                                                            type="search"
                                                            fullWidth
                                                            margin="normal"
                                                            value={nuevaIncidencia.detalles || ''}
                                                            onChange={handleNuevaIncidenciaChange}
                                                            name="detalles"
                                                        />
                                                    </Box>
                                                    <br />
                                                    <Button
                                                        variant="contained" onClick={handleCrearIncidencia}
                                                        style={{
                                                            backgroundColor: switchOn ? "#22FF94" : "#9C27B0",
                                                            color: switchOn ? "black" : "white",
                                                            marginLeft: "4px"
                                                        }}>
                                                        Crear
                                                    </Button>
                                                </div>
                                            </Modal>
                                            <Modal open={modalOpen} onClose={handleCloseModal}>
                                                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>
                                                    {selectedIncident && (
                                                        <>
                                                            <Typography variant="h6" gutterBottom component="div">
                                                                {selectedIncident.nombre}
                                                            </Typography>
                                                            <Typography>
                                                                Empleado: {selectedIncident.empleado}<br />
                                                                Area: {selectedIncident.area}<br />
                                                                Observaciones: {selectedIncident.detalles}<br />
                                                            </Typography>
                                                        </>
                                                    )}
                                                </div>
                                            </Modal>
                                        </Box>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
