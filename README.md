# TaskFlow

## Descripción

Este proyecto es una aplicación estilo Trello que permite a los usuarios crear y gestionar proyectos colaborativos. La aplicación ofrece funcionalidades para añadir tarjetas (cards) a los proyectos, donde cada tarjeta puede contener múltiples tareas (tasks) con distintos estados. Además, incluye características de colaboración en tiempo real y un chat integrado para facilitar la comunicación en equipo.

## Características

- **Gestión de Proyectos**: 
  - Crear, editar y eliminar proyectos.
  - Añadir y gestionar tarjetas (cards) dentro de cada proyecto.
  - Cambiar el color de las tarjetas para una mejor identificación.
  - Exportar e importar proyectos

- **Gestión de Tareas**:
  - Crear, editar y eliminar tareas (tasks) dentro de cada tarjeta.
  - Estados de las tareas: Pendiente, En progreso, Urgente, Completada.

- **Colaboración en Tiempo Real**:
  - Integración con websockets para la sincronización instantánea de los cambios entre los miembros del equipo.
  - Añadir otros usuarios por correo electrónico (requiere que tengan una cuenta en la aplicación).

- **Chat Integrado**:
  - Chat en cada proyecto para comunicación y notas.

## Tecnologías Utilizadas

- **Frontend**: 
  - Vite
  - React
  
- **Backend**: 
  - NodeJs
  - Express
  - WebSocket
  


