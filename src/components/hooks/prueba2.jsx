import React, { useState, useEffect } from 'react'

export default function prueba2() {
    const [lista, setLista] = useState([])

    const getList = async () => {
        try {
            const response = await fetch("https://apiticketccgroup.onrender.com/tickets")
            if (response.ok) {
                const data = await response.json();
                setLista(data);
            }
            else { console.error("Esto es un error", response.statusText); }
        }
        catch { console.error("Esto es otro error", error) }
    };

    useEffect(() => {
        getList();
    }, []);

    return (
        <div>
            <div className='content-wrapper'>{lista.map(ticket => (
            <div key={ticket.id}>
                <h2>{ticket.id}</h2>
                <p>{ticket.tipologia}</p>
            </div>
        ))}</div>
        </div>
        
    )
}
