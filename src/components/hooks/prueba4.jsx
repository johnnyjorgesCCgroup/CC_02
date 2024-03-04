import React, { useEffect, useState } from 'react'

export default function prueba4() {
    const [lista, setLista] = useState([])

    const getList = async () => {
        try{const response = await fetch("https://apiticketccgroup.onrender.com/tickets");
            if(response.ok){
                const data = await response.json();
                setLista(data)
            }
            else{
                console.error("Este es un error primario", response.statusText)
            }
        }
        catch (error){
            console.error("Este es un error de API", error)
        }
    }

    useEffect(() => {
        getList();
    })

  return (
    <div className='content-wrapper'>
        {lista.map(ticket => (
            <div key={ticket.id}>
                <h2>{ticket.fecha_creacion}</h2>
                <p>{ticket.tipologia}</p>
            </div>
        ))}
    </div>
  )
}
