import React, { useEffect, useState } from 'react'

export default function prueba3() {
    const [lista, setLista] = useState([]);

    const getList = async () => {
        try{ const response = await fetch("https://apiticketccgroup.onrender.com/tickets");
            if(response.ok){
                const data = await response.json();
                setLista(data);
            }
            else{
                console.error("esto es un error de sintaxis: ", response.StatusText)
            }
        }
        catch (error){
            console.error("Esto es un error de API: ", error);
        }
    };

    useEffect(() => {
        getList();
    }, []);
    
  return (
    <div className='content-wrapper'>{lista.map(ticket => (
        <div key={ticket.id}>
            <h2>{ticket.id}</h2>
            <p>{ticket.tipologia}</p>
        </div>
    ))}</div>
  )
}
