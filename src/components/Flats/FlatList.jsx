//Componente para listar los flats
const FlatList = ({ flats }) => {
  return (
    <div>
      <h2>Lista de Flats</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Ciudad</th>
            <th>Calle</th>
            <th>Número</th>
            <th>Área (m²)</th>
            <th>Aire Acondicionado</th>
            <th>Año de Construcción</th>
            <th>Precio de Renta</th>
            <th>Fecha Disponible</th>
          </tr>
        </thead>
        <tbody>
          {flats.map((flat) => (
            <tr key={flat.id}>
              <td> {flat.city}</td>
              <td>{flat.streetname} </td>
              <td>{flat.streetnumber} </td>
              <td>{flat.areasize} m² </td>
              <td>{flat.hasac ? "Sí" : "No"} </td>
              <td> {flat.yearbuilt} </td>
              <td>{flat.rentprice} </td>
              <td> {flat.dateavaliable} </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FlatList;
