import { useEffect, useState } from "react";
import moment from "moment";

export default function Ticket() {
  const [tickets, setTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [closedTicketsCount, setClosedTicketsCount] = useState(0);
  const [openTicketsCount, setOpenTicketsCount] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const handleTicketCreated = () => {
    // Actualizar estado de los tickets después de crear un nuevo ticket
    fetch("http://40.71.163.209:3000/tickets")
      .then((response) => response.json())
      .then((data) => {
        setTickets(data);
        const closedTickets = data.filter(
          (ticket) => ticket.estado === "Cerrado"
        );
        setClosedTicketsCount(closedTickets.length);
        const openTickets = data.filter(
          (ticket) => ticket.estado === "Abierto"
        );
        setOpenTicketsCount(openTickets.length);
      })
      .catch((error) => console.error("Error al obtener datos:", error));
  };

  const handleEliminar = (id) => {
    // Realiza la solicitud de eliminación a la API
    fetch(`hhttp://40.71.163.209:3000/tickets${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error deleting ticket");
        }
        // Actualiza el estado de los tickets después de la eliminación
        setTickets((prevTickets) =>
          prevTickets.filter((ticket) => ticket.id !== id)
        );

        // Realiza una solicitud adicional para obtener la lista actualizada de tickets
        return fetch("http://40.71.163.209:3000/tickets");
      })
      .then((response) => response.json())
      .then((data) => {
        // Calcular la cantidad de tickets cerrados y abiertos después de la eliminación
        const closedTickets = data.filter(
          (ticket) => ticket.estado === "Cerrado"
        );
        setClosedTicketsCount(closedTickets.length);

        const openTickets = data.filter(
          (ticket) => ticket.estado === "Abierto"
        );
        setOpenTicketsCount(openTickets.length);
      })
      .catch((error) => console.error("Error deleting ticket:", error));
  };

  const handleUpdate = async () => {
    try {
      // Realizar la solicitud PUT a la API para actualizar el ticket
      const response = await fetch(
        `http://40.71.163.209:3000/tickets${selectedTicket.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(selectedTicket),
        }
      );

      if (response.ok) {
        console.log("Ticket actualizado exitosamente");
        // Actualizar el estado de los tickets después de la actualización
        handleTicketCreated();
        // Puedes realizar acciones adicionales después de la actualización del ticket
        setShowModal(false);
        setSelectedTicket(null);
      } else {
        console.error("Error al actualizar el ticket:", response.statusText);
      }
    } catch (error) {
      console.error("Error al actualizar el ticket:", error);
    }
  };

  useEffect(() => {
    // Realizar la solicitud a la API aquí
    fetch("http://40.71.163.209:3000/tickets")
      .then((response) => response.json())
      .then((data) => {
        setTickets(data);
        // Calcular la cantidad de tickets cerrados
        const closedTickets = data.filter(
          (ticket) => ticket.estado === "Cerrado"
        );
        setClosedTicketsCount(closedTickets.length);
        // Calcular la cantidad de tickets cerrados
        const openTickets = data.filter(
          (ticket) => ticket.estado === "Abierto"
        );
        setOpenTicketsCount(openTickets.length);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []); // El segundo argumento [] asegura que el efecto se ejecute solo una vez al montar el componente

  // Filtra los tickets según el término de búsqueda
  const filteredTickets = tickets.filter((ticket) =>
    Object.values(ticket)
      .join(" ") // Combina todos los valores del ticket en una cadena
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const formatDateTime = (dateTime) => {
    return moment(dateTime).format("DD/MM/YYYY HH:mm");
  };

  const [nuevoTicket, setNuevoTicket] = useState({
    usuario: "",
    tipologia: "",
    comentario: "",
    urgente: false,
    estado: "Abierto",
  });

  const [selectedTicket, setSelectedTicket] = useState(null);

  const handleEditar = (ticket) => {
    setSelectedTicket(ticket); // Utilizar el ticket actual para editar
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Verificar si hay un ticket seleccionado para edición
    if (selectedTicket) {
      // Actualizar el estado del ticket seleccionado
      setSelectedTicket((prevTicket) => ({
        ...prevTicket,
        [name]: type === "checkbox" ? checked : value,
      }));
    } else {
      // Si no hay un ticket seleccionado, actualizar el estado del nuevo ticket
      setNuevoTicket((prevTicket) => ({
        ...prevTicket,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let response; // Declarar la variable response antes del bloque try

    try {
      // Realizar la solicitud POST o PUT a la API para crear o editar el ticket
      if (selectedTicket) {
        // Editar un ticket existente
        response = await fetch(
          `http://40.71.163.209:3000/tickets${selectedTicket.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(selectedTicket),
          }
        );

        // Restablecer el estado del ticket seleccionado después de la edición
        setSelectedTicket(null);
      } else {
        // Crear un nuevo ticket
        response = await fetch(
          "http://40.71.163.209:3000/tickets",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(nuevoTicket),
          }
        );

        // Puedes realizar acciones adicionales después de la creación del ticket
        setNuevoTicket({
          usuario: "",
          tipologia: "",
          comentario: "",
          urgente: false,
          estado: "Abierto",
        });
      }

      if (response.ok) {
        console.log("Operación exitosa");
        handleTicketCreated();
        // Puedes realizar acciones adicionales después del éxito
        setShowModal(false);
      } else {
        console.error("Error en la operación:", response.statusText);
      }
    } catch (error) {
      console.error("Error al procesar la solicitud:", error);
    }
  };

  return (
    <div className="content-wrapper">
      {/* /TICKET*/}
      <div className="card" style={{padding:20}}>
        <div className="card card-outline">
          <div className="card-header border-0">
            <h3 className="card-title">
              <b>Ticket</b>
            </h3>
            {/* /BUSCAR , AÑADIR Y DESCARGAR*/}
            <div className="card-tools">
              <input
                type="text"
                name="table_search"
                placeholder="Search"
                style={{ height: 20, borderColor: "white" }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <a
                href="#"
                className="btn btn-tool btn-flat"
                data-toggle="modal"
                data-target="#modal-default"
                /*onClick={() => setDisplayDialog(true)}*/
              >
                <i className="fas fa-plus" />
              </a>
              <a href="#" className="btn btn-tool btn-flat">
                <i className="fas fa-download" />
              </a>
              <a href="#" className="btn btn-tool btn-flat">
                <i className="fas fa-bars" />
              </a>
            </div>
          </div>
          {/* AQUÍ AGREGA EL FORMULARIO DE EDICION DE TICKET */}
          <div>
            <div className="modal fade" id="modal-editar">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="card-primary">
                    <div className="card-header">
                      <h3 className="card-title">Editar Ticket</h3>
                      <button
                        type="button"
                        className="close"
                        data-dismiss="modal"
                        aria-label="Close"
                        style={{ color: "white" }}
                      >
                        <span aria-hidden="true">×</span>
                      </button>
                    </div>
                    <div className="card-body">
                      {/* ... (contenido del formulario) */}
                      <form onSubmit={handleUpdate}>
                        {/* ... (otros campos del formulario) */}
                        <div className="form-group">
                          <label htmlFor="exampleInputEmail1">ID</label>
                          <input
                            className="form-control"
                            type="text"
                            placeholder="Ingresa texto"
                            name="ID"
                            value={selectedTicket ? selectedTicket.id : ""}
                            onChange={handleChange}
                            disabled
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="exampleInputEmail1">Usuario</label>
                          <input
                            className="form-control"
                            type="text"
                            placeholder="Ingresa texto"
                            name="usuario"
                            value={selectedTicket ? selectedTicket.usuario : ""}
                            onChange={handleChange}
                            disabled
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="exampleSelectRounded0">
                            Tipología
                          </label>
                          <select
                            className="custom-select rounded-0"
                            id="exampleSelectRounded0"
                            name="tipologia"
                            value={
                              selectedTicket ? selectedTicket.tipologia : ""
                            }
                            onChange={handleChange}
                            disabled
                          >
                            <option>Selecciona Tipología</option>
                            <option>Consulta</option>
                            <option>Reclamo</option>
                            <option>Solicitud</option>
                            <option>Reparación</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label htmlFor="exampleInputEmail1">Comentario</label>
                          <input
                            className="form-control"
                            type="text"
                            placeholder="Ingresa texto"
                            name="comentario"
                            value={
                              selectedTicket ? selectedTicket.comentario : ""
                            }
                            onChange={handleChange}
                            disabled
                          />
                        </div>
                        {/* ... (otros campos del formulario) */}
                        <div className="form-group">
                          <label htmlFor="exampleSelectRounded0">
                            Estado<code>*</code>
                          </label>
                          <select
                            className="custom-select rounded-0"
                            id="exampleSelectRounded0"
                            name="estado"
                            value={selectedTicket ? selectedTicket.estado : ""}
                            onChange={handleChange}
                          >
                            <option>Abierto</option>
                            <option>Cerrado</option>
                          </select>
                        </div>

                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="exampleCheck1"
                            name="urgente"
                            checked={
                              selectedTicket ? selectedTicket.urgente : false
                            }
                            onChange={handleChange}
                            disabled
                          />
                          <label
                            className="form-check-label"
                            htmlFor="exampleCheck1"
                          >
                            Urgente
                          </label>
                        </div>
                        <div className="card-footer">
                          <button
                            type="submit"
                            className="btn btn-primary"
                            onClick={handleSubmit}
                            data-dismiss="modal"
                          >
                            Enviar
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AQUÍ AGREGA EL FORMULARIO DE CREACIÓN DE TICKET */}
        <div>
          <div className="modal fade" id="modal-default">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="card-primary">
                  <div className="card-header">
                    <h3 className="card-title">Crear Ticket</h3>
                    <button
                      type="button"
                      className="close"
                      data-dismiss="modal"
                      aria-label="Close"
                      style={{ color: "white" }}
                    >
                      <span aria-hidden="true">×</span>
                    </button>
                  </div>
                  <div className="card-body">
                    {/* ... (contenido del formulario) */}
                    <form onSubmit={handleSubmit}>
                      <div className="form-group">
                        <label htmlFor="exampleSelectRounded0">
                          Usuario <code>*</code>
                        </label>
                        <select
                          className="custom-select rounded-0"
                          id="exampleSelectRounded0"
                          name="usuario"
                          value={nuevoTicket.usuario}
                          onChange={handleChange}
                        >
                          <option>Selecciona Usuario</option>
                          <option>Sara</option>
                          <option>Jaime</option>
                          <option>Ray</option>
                          <option>Francys</option>
                          <option>Cristian</option>
                          <option>Rodolfo</option>
                          <option>Julio</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label htmlFor="exampleSelectRounded0">
                          Tipología <code>*</code>
                        </label>
                        <select
                          className="custom-select rounded-0"
                          id="exampleSelectRounded0"
                          name="tipologia"
                          value={nuevoTicket.tipologia}
                          onChange={handleChange}
                        >
                          <option>Selecciona Tipología</option>
                          <option>Consulta</option>
                          <option>Reclamo</option>
                          <option>Solicitud</option>
                          <option>Reparación</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label htmlFor="exampleInputEmail1">
                          Comentario <code>*</code>
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Ingresa texto"
                          name="comentario"
                          value={nuevoTicket.comentario}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="exampleInputFile">Subir Imagen</label>
                        <div className="input-group">
                          <div className="custom-file">
                            <input
                              type="file"
                              className="custom-file-input"
                              id="exampleInputFile"
                            />
                            <label
                              className="custom-file-label"
                              htmlFor="exampleInputFile"
                            >
                              Elija el Archivo
                            </label>
                          </div>
                          <div className="input-group-append">
                            <span className="input-group-text">Upload</span>
                          </div>
                        </div>
                      </div>
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="exampleCheck1"
                          name="urgente"
                          checked={nuevoTicket.urgente}
                          onChange={handleChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="exampleCheck1"
                        >
                          Urgente (Solo si es de vida o muerte 🧐)
                        </label>
                      </div>
                      <div className="card-footer">
                        <button
                          type="submit"
                          className="btn btn-primary"
                          onClick={handleSubmit}
                          data-dismiss="modal"
                        >
                          Enviar
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* /TABLA DE TICKET*/}
        <div className="card-body table-responsive p-0">
          <table className="table table-bordered table-hover">
            <thead>
              <tr>
                <th scope="col">Id</th>
                <th scope="col">Usuario</th>
                <th scope="col">Tipología</th>
                <th scope="col">F.Creación</th>
                <th scope="col">F.Actualización</th>
                <th scope="col">Urgente</th>
                <th scope="col">Comentario</th>
                <th scope="col">Estado</th>
                <th scope="col">Editar</th>
                <th scope="col">Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td>{ticket.id}</td>
                  <td>{ticket.usuario}</td>
                  <td>{ticket.tipologia}</td>
                  <td>{formatDateTime(ticket.fecha_creacion)}</td>
                  <td>
                    {ticket.fecha_actualizacion
                      ? formatDateTime(ticket.fecha_actualizacion)
                      : "NO HUBO CAMBIOS"}
                  </td>
                  <td className={ticket.urgente ? "text-danger" : ""}>
                    <b>{ticket.urgente ? "Sí" : "No"}</b>
                  </td>
                  <td>{ticket.comentario}</td>
                  <td
                    className={
                      ticket.estado === "Abierto" ? "text-info" : "text-success"
                    }
                  >
                    <b>{ticket.estado}</b>
                  </td>
                  <td>
                    <button
                      className="btn btn-outline-primary"
                      data-toggle="modal"
                      data-target="#modal-editar"
                      onClick={() => handleEditar(ticket)}
                    >
                      Editar
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn btn-outline-danger"
                      onClick={() => handleEliminar(ticket.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="card-footer clearfix">
          <ul className="pagination pagination-sm m-0 float-right">
            <li className="page-item">
              <a className="page-link" href="#">
                «
              </a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">
                1
              </a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">
                2
              </a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">
                3
              </a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">
                »
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* /TICKET STATUS */}
      <div className="card"  style={{padding:20}}>
        <div className="card card-outline">
          <div className="card-header border-0">
            <h3 className="card-title">
              <b>Ticket Status</b>
            </h3>
          </div>
        </div>
        <div
          className="row flex justify-content-center align-items-center"
          style={{ margin: 10 }}
        >
          <div className="col-12 col-sm-6 col-md-3">
            <div className="info-box">
              <span className="info-box-icon bg-info elevation-1">
                <i className="fas fa-cog" />
              </span>
              <div className="info-box-content">
                <span className="info-box-text">Pendientes</span>
                <span className="info-box-number">{openTicketsCount}</span>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-md-3">
            <div className="info-box mb-3">
              <span className="info-box-icon bg-danger elevation-1">
                <i className="fas fa-thumbs-up" />
              </span>
              <div className="info-box-content">
                <span className="info-box-text">Completados</span>
                <span className="info-box-number">{closedTicketsCount}</span>
              </div>
            </div>
          </div>
          <div className="clearfix hidden-md-up" />
        </div>

        {/* PROGRESS TICKET */}
        <div>
          <div className="card-body">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th style={{ width: 10 }}>#</th>
                  <th>Usuarios</th>
                  <th>Progress</th>
                  <th style={{ width: 40 }}>Label</th>
                </tr>
              </thead>
              <tbody>
                {/* Crear un objeto para realizar el seguimiento del progreso por usuario */}
                {Object.values(
                  filteredTickets.reduce((progressByUser, ticket, index) => {
                    const userTickets = filteredTickets.filter(
                      (t) => t.usuario === ticket.usuario
                    );
                    const totalUserTickets = userTickets.length;
                    const closedUserTickets = userTickets.filter(
                      (t) => t.estado === "Cerrado"
                    ).length;

                    const progressPercentage =
                      totalUserTickets > 0
                        ? (closedUserTickets / totalUserTickets) * 100
                        : 0;

                    const progressDisplay =
                      totalUserTickets > 0
                        ? `${(
                            (closedUserTickets / totalUserTickets) *
                            100
                          )}%`
                        : "Ningún ticket cerrado";

                    // Verificar si ya se ha mostrado el usuario
                    if (!progressByUser[ticket.usuario]) {
                      progressByUser[ticket.usuario] = {
                        index: index + 1,
                        jsx: (
                          <tr key={index + 1}>
                            <td>{index + 1}.</td>
                            <td>{ticket.usuario}</td>
                            <td>
                              <div className="progress progress-xs progress-striped active">
                                <div
                                  className="progress-bar bg-success"
                                  style={{ width: `${progressPercentage}%` }}
                                />
                              </div>
                            </td>
                            <td>
                              <span className="badge bg-success">
                                {`${progressDisplay}`}
                              </span>
                            </td>
                          </tr>
                        ),
                      };

                      return progressByUser;
                    }

                    // Si el usuario ya se mostró, devolver el progreso calculado
                    return progressByUser;
                  }, {})
                ).map((userProgress) => userProgress.jsx)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
