import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Login from './pages/Login';
import UsersListForManagement from './pages/UsersListForManagement';
import UserForm from './pages/UserForm';
import ParcelForm from './pages/ParcelForm';
import ParcelsListWithDetails from './pages/ParcelsListWithDetails';
import DimensionsListWithDetails from './pages/DimensionsListWithDetails';
import DimensionsForm from './pages/DimensionsForm';
import SoilControlsListWithDetails from './pages/SoilControlsListWithDetails';
import SoilControlForm from './pages/SoilControlForm';
import GrapeTypesListWithDetails from './pages/GrapeTypesListWithDetails';
import GrapeTypeForm from './pages/GrapeTypeForm';
import SowingsListWithDetails from './pages/SowingsListWithDetails';
import SowingForm from './pages/SowingForm';

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta para el inicio de sesión */}
        <Route path="/login" element={<Login />} />

        {/* Ruta para mostrar el listado de usuarios */}
        <Route path="/users" element={<UsersListForManagement />} />
        
        {/* Ruta para crear un nuevo usuario */}
        <Route path="/create-user" element={<UserForm />} />

        {/* Ruta para mostrar el listado de parcelas con acordeones */}
        <Route path="/parcels" element={<ParcelsListWithDetails />} />
        
        {/* Ruta para crear una nueva parcela */}
        <Route path="/create-parcel" element={<ParcelForm />} />
        
        {/* Ruta para editar una parcela existente */}
        <Route path="/edit-parcel/:id" element={<ParcelForm />} />

        {/* Ruta para la visualización de dimensiones */}
        <Route path="/dimensions" element={<DimensionsListWithDetails />} />
        
        {/* Ruta para la edición de dimensiones */}
        <Route path="/edit-dimensions/:id" element={<DimensionsForm />} />

        {/* Ruta para la visualización de controles de tierra */}
        <Route path="/soil-controls" element={<SoilControlsListWithDetails />} />
        
        {/* Ruta para la creación de controles de tierra */}
        <Route path="/create-soil-control" element={<SoilControlForm />} />

        {/* Ruta para la visualización de tipos de uva */}
        <Route path="/grape-types" element={<GrapeTypesListWithDetails />} />
        
        {/* Ruta para la edición de tipos de uva */}
        <Route path="/edit-grape-type/:id" element={<GrapeTypeForm />} />

        {/* Ruta para la creación de tipos de uva */}
        <Route path="/create-grape-type" element={<GrapeTypeForm />} />

        {/* Ruta para la visualización de siembras */}
        <Route path="/sowings" element={<SowingsListWithDetails />} />

        {/* Ruta para la edición de siembras */}
        <Route path="/edit-sowing/:id" element={<SowingForm />} />

        {/* Ruta para la creación de siembras */}
        <Route path="/create-sowing" element={<SowingForm />} />

      </Routes>
    </Router>
  );
}

export default App;
