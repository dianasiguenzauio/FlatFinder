import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import AuthContext from "../../context/authContext";
import {
  Table,
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
    const nameRegex = /^[a-zA-Z]{1,20}$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*.])[A-Za-z\d!@#$%^&*.]{8,}$/;

    // Validar nombre
    if (!selectedUser.firstname || !nameRegex.test(selectedUser.firstname)) {
      errors.firstname =
        "Nombre debe tener solo letras y máximo 20 caracteres.";
    }

    // Validar apellido
    if (!selectedUser.lastname || !nameRegex.test(selectedUser.lastname)) {
      errors.lastname =
        "Apellido debe tener solo letras y máximo 20 caracteres.";
    }

    // Validar fecha de nacimiento (mínimo 18 años)
    const birthDate = new Date(selectedUser.birthdate);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    if (!selectedUser.birthdate || age < 18) {
      errors.birthdate = "El usuario debe tener al menos 18 años.";
    }

    // Validar contraseña si se modifica
    if (selectedUser.password && !passwordRegex.test(selectedUser.password)) {
      errors.password =
        "La contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula, una minúscula, un número y un carácter especial.";
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
      setTimeout(() => setSuccessMessage(""), 3000);
      setEditFormVisible(false);
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
      setSuccessMessage("Usuario eliminado correctamente.");
      setUsers(users.filter((user) => user._id !== userToDelete));
      setDeleteDialogOpen(false);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Error al eliminar el usuario. Intenta de nuevo."
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

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Administrador - Editar Usuarios</h1>
      {errorMessage && <p style={styles.error}>{errorMessage}</p>}
      {successMessage && <p style={styles.success}>{successMessage}</p>}

      {/* Mostrar tabla o formulario según el estado */}
      {editFormVisible ? (
        <div style={styles.formContainer}>
          <h2>Editar Usuario</h2>
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
            />
            <div style={styles.buttonContainer}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveChanges}
                style={styles.button}
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
                <TableCell style={styles.header}>Nombre</TableCell>
                <TableCell style={styles.header}>Apellido</TableCell>
                <TableCell style={styles.header}>Email</TableCell>
                <TableCell style={styles.header}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.firstname}</TableCell>
                  <TableCell>{user.lastname}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleEdit(user._id)}
                      style={styles.button}
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
    margin: "0 auto",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
  },
  button: {
    margin: "0 5px",
  },
};

export default EditUsers;
