import { useEffect, useState } from 'react'

export default function ContentEffect() {
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');

    useEffect(() => {
        const handleClick = () => {
            console.log('Se hizo clic en el documento');
        };
    
        // Agregar un evento de clic al documento
        document.addEventListener('click', handleClick);
    
        // Función de limpieza
        return () => {
            // Remover el evento de clic al desmontar el componente
            document.removeEventListener('click', handleClick);
        };
    }, []);

    useEffect(() => {
        const handleClick = () => {
            document.title = "Prueba2"
        };
    
        // Agregar un evento de clic al documento
        document.addEventListener('click', handleClick);
    
        // Función de limpieza
        return () => {
            // Remover el evento de clic al desmontar el componente
            document.removeEventListener('click', handleClick);
        };
    }, []);

    useEffect(() => {
        console.log(`El nombre completo es: ${nombre} ${apellido}`);
    }, [nombre, apellido]); // Dependencias: se ejecuta cuando cambia el nombre o el apellido

    const handleViewApellido = (event) => {
        console.log('Información del evento:', event);
        alert(apellido);
    }

    return (
        <div className='content-wrapper p-4'>
            <h1>{nombre}{apellido}</h1>
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre" />
            <input type="text" value={apellido} onChange={(e) => setApellido(e.target.value)} placeholder="Apellido" />
            <button onClick={handleViewApellido}>
                Presiona Aquí
            </button>
        </div>
    );
}
