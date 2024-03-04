import React, { useEffect, useState } from 'react'

export default function prueba() {
    const [lista, setLista] = useState([])

    useEffect(() => {
        getList()
    }, []);
    

    const getList = async () => {
        try {
            const response = await fetch("https://apiticketccgroup.onrender.com/tickets")
            if (response.ok) {
                const data = await response.json();
                setLista(data);
            }
            else { console.error("No se puede cargar la información: ", response.statusText) };
        }
        catch (error) { console.error("Error: ", error) }
    }

    

    return (
        <div className='content-wrapper'>
            {lista.map(ticket => (
                <div key={ticket.id}>
                    <h2>{ticket.tipologia}</h2>
                    <p>{ticket.usuario}</p>
                </div>
            ))}
        </div>
    )
}
