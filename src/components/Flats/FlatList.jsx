import React from "react";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

const FlatList = ({ flats }) => {
  return (
    <div>
      <h2>Lista de Flats</h2>
      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              {/* Add a suitable icon here, e.g., a house icon */}
            </ListItemIcon>
            <ListItemText primary="Ciudad" secondary="Calle" />
            <ListItemText primary="Número" secondary="Área (m²)" />
            <ListItemText primary="A/C" secondary="Año" />
            <ListItemText primary="Precio" secondary="Disponible" />
          </ListItemButton>
        </ListItem>
        {flats.map((flat) => (
          <ListItem disablePadding key={flat.id}>
            <ListItemButton>
              <ListItemIcon>
                {/* Add a suitable icon here, e.g., a house icon */}
              </ListItemIcon>
              <ListItemText primary={flat.city} secondary={flat.streetname} />
              <ListItemText
                primary={flat.streetnumber}
                secondary={flat.areasize + " m²"}
              />
              <ListItemText
                primary={flat.hasac ? "Sí" : "No"}
                secondary={flat.yearbuilt}
              />
              <ListItemText
                primary={flat.rentprice}
                secondary={flat.dateavaliable}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default FlatList;
