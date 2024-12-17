import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import AuthContext from "../../context/authContext";
import {
  Table,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const EditUsers = () => {
  const { auth } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editFormVisible, setEditFormVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); // Almacenar datos del usuario seleccionado
  const [formErrors, setFormErrors] = useState({}); // Errores de validación
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // Diálogo de confirmación de eliminación
  const [userToDelete, setUserToDelete] = useState(null); // Usuario a eliminar

  //estados para manejar los valores de los filtros
  const [filters, setFilters] = useState({
    firstname: "",
    lastname: "",
    isAdmin: "",
    numeroflats: "",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/users/getAllUsers",
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );
        setUsers(response.data);
      } catch (error) {
        setErrorMessage(
          error.response?.data?.message ||
            "Error al obtener los usuarios. Intenta de nuevo."
        );
      }
    };

    fetchUsers();
  }, [auth.token]);

  // Validar el formulario
  const validateForm = () => {
    const errors = {};
    const nameRegex = /^[a-zA-Z]{2,20}$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*.])[A-Za-z\d!@#$%^&*.]{6,}$/;

    // Validar nombre
    if (!selectedUser.firstname || !nameRegex.test(selectedUser.firstname)) {
      errors.firstname = "Nombre debe tener minimo 2 letras";
    }

    // Validar apellido
    if (!selectedUser.lastname || !nameRegex.test(selectedUser.lastname)) {
      errors.lastname = "Nombre debe tener minimo 2 letras";
    }

    // Validar fecha de nacimiento (mínimo 18 años)
    const birthDate = new Date(selectedUser.birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    if (!selectedUser.birthdate || (age < 18 && age > 120)) {
      errors.birthdate = "El usuario debe tener al menos 18 años y maximo 120.";
    }

    // Validar contraseña si se modifica
    if (selectedUser.password && !passwordRegex.test(selectedUser.password)) {
      errors.password =
        "La contraseña debe tener al menos 6 caracteres, incluyendo una letra mayúscula, una minúscula, un número y un carácter especial.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Manejar guardar cambios
  const handleSaveChanges = async () => {
    if (!validateForm()) return;

    const userDataToSend = { ...selectedUser };
    if (!userDataToSend.password) {
      delete userDataToSend.password; // No enviar contraseña si no se modificó
    }
    console.log("Datos enviados al servidor:", userDataToSend);
    try {
      await axios.patch(
        `http://localhost:8080/users/updateUser/${selectedUser._id}`,
        userDataToSend,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      setSuccessMessage("Datos actualizados correctamente.");
      setTimeout(() => {
        setSuccessMessage("");
        setEditFormVisible(false);
      }, 3000);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === selectedUser._id ? { ...user, ...userDataToSend } : user
        )
      );
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Error al actualizar los datos. Intenta de nuevo."
      );
    }
  };

  // Manejar eliminación
  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:8080/users/deleteUser/${userToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      setSuccessMessage("Usuario eliminado correctamente");
      setUsers(users.filter((user) => user._id !== userToDelete));
      setDeleteDialogOpen(false);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Error al eliminar el usuario. Intenta de nuevo"
      );
    }
  };

  // Manejar edición
  const handleEdit = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/users/getUserById/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      setSelectedUser({ ...response.data, password: "" });
      setEditFormVisible(true);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Error al obtener los datos del usuario. Intenta de nuevo."
      );
    }
  };

  // Cancelar edición
  const handleCancel = () => {
    setEditFormVisible(false);
    setSelectedUser(null);
    setFormErrors({});
  };

  //funcion para actuualizar el estado de los filtros al modificar los input
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Función para limpiar los filtros
  const handleClearFilters = () => {
    setFilters({
      firstname: "",
      lastname: "",
      isAdmin: "",
      numeroflats: "",
    });
  };

  const filteredUsers = users.filter((user) => {
    return (
      (filters.firstname
        ? user.firstname.toLowerCase().includes(filters.firstname.toLowerCase())
        : true) &&
      (filters.lastname
        ? user.lastname.toLowerCase().includes(filters.lastname.toLowerCase())
        : true) &&
      (filters.isAdmin ? String(user.isAdmin) === filters.isAdmin : true) &&
      (filters.numeroflats
        ? user.numeroflats === Number(filters.numeroflats)
        : true)
    );
  });

  return (
    <div style={styles.container}>
      <h1 style={{ color: "#001f3d", textAlign: "center" }}>
        Administrador - Editar Usuarios
      </h1>
      {/* Inputs de filtro */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <TextField
          label="Nombre"
          name="firstname"
          value={filters.firstname}
          onChange={handleFilterChange}
          variant="outlined"
          size="small"
        />
        <TextField
          label="Apellido"
          name="lastname"
          value={filters.lastname}
          onChange={handleFilterChange}
          variant="outlined"
          size="small"
        />
        <TextField
          label="# Flats"
          name="numeroflats"
          value={filters.numeroflats}
          onChange={handleFilterChange}
          variant="outlined"
          size="small"
          type="number"
        />
        <TextField
          label="Admin (Sí/No)"
          name="isAdmin"
          value={filters.isAdmin}
          onChange={handleFilterChange}
          variant="outlined"
          size="small"
          select
          SelectProps={{
            native: true,
          }}
          fullWidth // Ajusta el ancho automáticamente
        >
          <option aria-label="Todos" value="">
            Todos
          </option>
          <option value="true">Sí</option>
          <option value="false">No</option>
        </TextField>
      </div>

      <Button
        variant="contained"
        color="secondary"
        onClick={handleClearFilters}
      >
        Limpiar Filtros
      </Button>
      {errorMessage && <p style={styles.error}>{errorMessage}</p>}
      {successMessage && (
        <div style={{ color: "green", marginTop: "10px" }}>
          {successMessage}
        </div>
      )}

      {/* Mostrar tabla o formulario según el estado */}
      {editFormVisible ? (
        <div style={styles.formContainer}>
          <h2 style={{ color: "#001f3d" }}>Editar Usuario</h2>
          <form>
            <TextField
              label="Nombre"
              name="firstname"
              value={selectedUser.firstname}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, firstname: e.target.value })
              }
              error={!!formErrors.firstname}
              helperText={formErrors.firstname}
              fullWidth
              margin="normal"
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    border: "2px solid purple", // Aplica el borde morado correctamente
                  },
                  "&:hover fieldset": {
                    borderColor: "darkviolet", // Cambia el borde al pasar el mouse
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "purple", // Borde morado al enfocar
                  },
                },
              }}
            />
            <TextField
              label="Apellido"
              name="lastname"
              value={selectedUser.lastname}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, lastname: e.target.value })
              }
              error={!!formErrors.lastname}
              helperText={formErrors.lastname}
              fullWidth
              margin="normal"
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    border: "2px solid purple", // Aplica el borde morado correctamente
                  },
                  "&:hover fieldset": {
                    borderColor: "darkviolet", // Cambia el borde al pasar el mouse
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "purple", // Borde morado al enfocar
                  },
                },
              }}
            />
            <TextField
              label="Email"
              name="email"
              value={selectedUser.email}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, email: e.target.value })
              }
              disabled // El email no se puede editar
              fullWidth
              margin="normal"
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    border: "2px solid purple", // Aplica el borde morado correctamente
                  },
                  "&:hover fieldset": {
                    borderColor: "darkviolet", // Cambia el borde al pasar el mouse
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "purple", // Borde morado al enfocar
                  },
                },
              }}
            />
            <TextField
              label="Fecha de Nacimiento"
              name="birthdate"
              type="date"
              value={selectedUser.birthdate}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, birthdate: e.target.value })
              }
              error={!!formErrors.birthdate}
              helperText={formErrors.birthdate}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    border: "2px solid purple", // Aplica el borde morado correctamente
                  },
                  "&:hover fieldset": {
                    borderColor: "darkviolet", // Cambia el borde al pasar el mouse
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "purple", // Borde morado al enfocar
                  },
                },
              }}
            />
            <TextField
              label="Contraseña (Deja este campo vacio su no requieres actualizar la contraseña)"
              name="password"
              type="password"
              value={selectedUser.password}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, password: e.target.value })
              }
              error={!!formErrors.password}
              helperText={formErrors.password}
              fullWidth
              margin="normal"
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    border: "2px solid purple", // Aplica el borde morado correctamente
                  },
                  "&:hover fieldset": {
                    borderColor: "darkviolet", // Cambia el borde al pasar el mouse
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "purple", // Borde morado al enfocar
                  },
                },
              }}
            />
            <FormLabel component="legend" style={{ marginTop: "20px" }}>
              ¿Es Administrador?
            </FormLabel>
            <RadioGroup
              name="isAdmin"
              value={String(selectedUser.isAdmin)} // Convertir el valor booleano a string para el manejo de RadioGroup
              onChange={(e) =>
                setSelectedUser({
                  ...selectedUser,
                  isAdmin: e.target.value === "true", // Convertir de string a boolean
                })
              }
              row
            >
              <FormControlLabel
                value="true"
                control={<Radio />}
                label="Sí"
                sx={{ color: "black" }} // Estilo inline para letras negras
              />
              <FormControlLabel
                value="false"
                control={<Radio />}
                label="No"
                sx={{ color: "black" }} // Estilo inline para letras negras
              />
            </RadioGroup>

            <div style={styles.buttonContainer}>
              <Button
                variant="contained"
                onClick={handleSaveChanges}
                style={styles.button}
                sx={{
                  backgroundColor: "#179fba",
                  "&:hover": {
                    backgroundColor: "#137d94", // Color ligeramente más oscuro al pasar el mouse
                  },
                }}
              >
                Guardar Cambios
              </Button>

              <Button
                variant="contained"
                color="secondary"
                onClick={handleCancel}
                style={styles.button}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <TableContainer component={Paper} style={styles.tableContainer}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={styles.cells}>Nombre</TableCell>
                <TableCell style={styles.cells}>Apellido</TableCell>
                <TableCell style={styles.cells}>#Flats</TableCell>
                <TableCell style={styles.cells}>Email</TableCell>
                <TableCell style={styles.cells}>Admin</TableCell>
                <TableCell style={styles.cells}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.firstname}</TableCell>
                  <TableCell>{user.lastname}</TableCell>
                  <TableCell>{user.numeroflats}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.isAdmin ? "Sí" : "No"}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      onClick={() => handleEdit(user._id)}
                      style={styles.button}
                      sx={{
                        backgroundColor: "#179fba",
                        "&:hover": {
                          backgroundColor: "#137d94", // Color ligeramente más oscuro al pasar el mouse
                        },
                      }}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => {
                        setUserToDelete(user._id);
                        setDeleteDialogOpen(true);
                      }}
                      style={styles.button}
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Diálogo de confirmación de eliminación */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          ¿Estás seguro de que deseas eliminar este usuario?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDelete} color="secondary">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const styles = {
  formContainer: {
    maxWidth: "600px",
    padding: "20px",
    backgroundColor: "white",
    borderRadius: "10px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },

  container: {
    marginTop: "200px",
    borderRadius: "10px",
  },

  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
  },
  button: {
    margin: "0 5px",
  },

  cells: {
    color: "#001f3d",
    fontWeight: "bold",
    fontSize: "15px",
  },

  success: {
    color: "green",
    textAlign: "center",
    padding: "10px",
    marginBottom: "10px",
  },
};

export default EditUsers;
