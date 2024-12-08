/*import React, { useEffect, useState, useContext } from "react";
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
} from "@mui/material";

const EditUsers = () => {
  const { auth } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Llamar al servicio para obtener todos los usuarios
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
        setUsers(response.data); // Asignar los usuarios a la tabla
      } catch (error) {
        setErrorMessage(
          error.response?.data?.message ||
            "Error al obtener los usuarios. Intenta de nuevo."
        );
      }
    };

    fetchUsers();
  }, [auth.token]);

  // Función para manejar la edición
  const handleEdit = (userId) => {
    console.log("Editar usuario con ID:", userId);
    // Aquí podrías redirigir a una página de edición específica
  };

  // Función para manejar la eliminación
  const handleDelete = async (userId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      try {
        await axios.delete(`http://localhost:8080/users/deleteUser/${userId}`, {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });
        // Actualizar la lista de usuarios después de eliminar
        setUsers(users.filter((user) => user._id !== userId));
      } catch (error) {
        setErrorMessage(
          error.response?.data?.message ||
            "Error al eliminar el usuario. Intenta de nuevo."
        );
      }
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Administrador - Editar Usuarios</h1>
      {errorMessage && <p style={styles.error}>{errorMessage}</p>}
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
                    onClick={() => handleDelete(user._id)}
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
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
  },
  tableContainer: {
    marginTop: "20px",
  },
  header: {
    fontWeight: "bold",
    textAlign: "center",
  },
  button: {
    margin: "0 5px",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginTop: "20px",
  },
};

export default EditUsers;
*/
/*
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const EditUsers = () => {
  const { auth } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null); // Para almacenar el ID del usuario seleccionado
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  useEffect(() => {
    // Llamar al servicio para obtener todos los usuarios
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
        setUsers(response.data); // Asignar los usuarios a la tabla
      } catch (error) {
        setErrorMessage(
          error.response?.data?.message ||
            "Error al obtener los usuarios. Intenta de nuevo."
        );
      }
    };

    fetchUsers();
  }, [auth.token]);

  // Manejar la apertura del diálogo de confirmación
  const handleOpenDialog = (userId) => {
    setSelectedUserId(userId);
    setDialogOpen(true);
  };

  // Manejar la confirmación de eliminación
  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:8080/users/deleteUser/${selectedUserId}`,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      // Actualizar la lista de usuarios después de eliminar
      setUsers(users.filter((user) => user._id !== selectedUserId));
      setDialogOpen(false); // Cerrar el diálogo
      setSelectedUserId(null); // Limpiar el usuario seleccionado
      setSuccessDialogOpen(true);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Error al eliminar el usuario. Intenta de nuevo."
      );
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Administrador - Editar Usuarios</h1>
      {errorMessage && <p style={styles.error}>{errorMessage}</p>}
      <TableContainer component={Paper} style={styles.tableContainer}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={styles.header}>Nombre</TableCell>
              <TableCell style={styles.header}>Email</TableCell>
              <TableCell style={styles.header}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.firstname}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() =>
                      console.log("Editar usuario con ID:", user._id)
                    }
                    style={styles.button}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleOpenDialog(user._id)} // Abrir diálogo de confirmación
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
*/

{
  /* Diálogo de confirmación */
} /*
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          ¿Estás seguro de que deseas eliminar este usuario?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">
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
  container: {
    padding: "20px",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
  },
  tableContainer: {
    marginTop: "20px",
  },
  header: {
    fontWeight: "bold",
    textAlign: "center",
  },
  button: {
    margin: "0 5px",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginTop: "20px",
  },
};

export default EditUsers;
*/
//funcional 100%
/*
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
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    // Llamar al servicio para obtener todos los usuarios
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
        setUsers(response.data); // Asignar los usuarios a la tabla
      } catch (error) {
        setErrorMessage(
          error.response?.data?.message ||
            "Error al obtener los usuarios. Intenta de nuevo."
        );
      }
    };

    fetchUsers();
  }, [auth.token]);

  // Manejar la apertura del diálogo de confirmación
  const handleOpenDialog = (userId) => {
    setSelectedUserId(userId);
    setDialogOpen(true);
  };

  // Manejar la confirmación de eliminación
  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:8080/users/deleteUser/${selectedUserId}`,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      // Actualizar la lista de usuarios después de eliminar
      setUsers(users.filter((user) => user._id !== selectedUserId));
      setDialogOpen(false); // Cerrar el diálogo
      setSelectedUserId(null); // Limpiar el usuario seleccionado
      setSuccessMessage("Usuario eliminado correctamente.");
      setTimeout(() => setSuccessMessage(""), 3000); // Eliminar el mensaje después de 3 segundos
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Error al eliminar el usuario. Intenta de nuevo."
      );
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Administrador - Editar Usuarios</h1>
      {errorMessage && <p style={styles.error}>{errorMessage}</p>}
      {successMessage && <p style={styles.success}>{successMessage}</p>}{" "}
     */ {
  /* Mensaje de éxito */
}
/*
      <TableContainer component={Paper} style={styles.tableContainer}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={styles.header}>Nombre</TableCell>
              <TableCell style={styles.header}>Email</TableCell>
              <TableCell style={styles.header}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.firstname}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() =>
                      console.log("Editar usuario con ID:", user._id)
                    }
                    style={styles.button}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleOpenDialog(user._id)} // Abrir diálogo de confirmación
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
     */ {
  /* Diálogo de confirmación */
} /*
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          ¿Estás seguro de que deseas eliminar este usuario?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">
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
  container: {
    padding: "20px",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
  },
  tableContainer: {
    marginTop: "20px",
  },
  header: {
    fontWeight: "bold",
    textAlign: "center",
  },
  button: {
    margin: "0 5px",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginTop: "20px",
  },
  success: {
    color: "green",
    textAlign: "center",
    marginTop: "10px",
    fontWeight: "bold",
  },
};

export default EditUsers;*/
/////////
/*
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
} from "@mui/material";

const EditUsers = () => {
  const { auth } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState(null); // Para almacenar datos del usuario seleccionado
  const [editFormVisible, setEditFormVisible] = useState(false); // Controlar la visibilidad del formulario de edición

  useEffect(() => {
    // Llamar al servicio para obtener todos los usuarios
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
        setUsers(response.data); // Asignar los usuarios a la tabla
      } catch (error) {
        setErrorMessage(
          error.response?.data?.message ||
            "Error al obtener los usuarios. Intenta de nuevo."
        );
      }
    };

    fetchUsers();
  }, [auth.token]);

  // Manejar clic en "Editar" para mostrar los datos del usuario seleccionado
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
      setSelectedUser(response.data); // Asignar los datos del usuario al formulario
      setEditFormVisible(true); // Mostrar el formulario de edición
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Error al obtener los datos del usuario. Intenta de nuevo."
      );
    }
  };

  // Manejar cambios en los campos del formulario de edición
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedUser({ ...selectedUser, [name]: value });
  };

  // Manejar guardar cambios
  const handleSaveChanges = async () => {
    try {
      await axios.patch(
        `http://localhost:8080/users/updateUser/${selectedUser._id}`,
        selectedUser,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      setSuccessMessage("Datos actualizados correctamente.");
      setTimeout(() => setSuccessMessage(""), 3000); // Eliminar el mensaje después de 3 segundos
      setEditFormVisible(false); // Ocultar el formulario
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === selectedUser._id ? selectedUser : user
        )
      ); // Actualizar la lista de usuarios
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Error al actualizar los datos. Intenta de nuevo."
      );
    }
  };

  // Manejar cancelar
  const handleCancel = () => {
    setEditFormVisible(false);
    setSelectedUser(null);
  };

  return (
    <div style={styles.container}>
      {errorMessage && <p style={styles.error}>{errorMessage}</p>}
      {successMessage && <p style={styles.success}>{successMessage}</p>}
      {!editFormVisible ? (
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <div style={styles.formContainer}>
          <h2>Editar Usuario</h2>
          <TextField
            label="Nombre"
            name="firstname"
            value={selectedUser.firstname || ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Apellido"
            name="lastname"
            value={selectedUser.lastname || ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Fecha de Nacimiento"
            name="birthdate"
            type="date"
            value={selectedUser.birthdate || ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Contraseña"
            name="password"
            type="password"
            value={selectedUser.password || ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Es Administrador"
            name="isAdmin"
            value={selectedUser.isAdmin || ""}
            onChange={(e) =>
              setSelectedUser({
                ...selectedUser,
                isAdmin: e.target.value === "true",
              })
            }
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
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
  },
  tableContainer: {
    marginTop: "20px",
  },
  header: {
    fontWeight: "bold",
    textAlign: "center",
  },
  button: {
    margin: "0 5px",
  },
  formContainer: {
    maxWidth: "600px",
    margin: "0 auto",
  },
  buttonContainer: {
    marginTop: "20px",
    textAlign: "center",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginTop: "20px",
  },
  success: {
    color: "green",
    textAlign: "center",
    marginTop: "10px",
    fontWeight: "bold",
  },
};

export default EditUsers;*/
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
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Typography,
} from "@mui/material";

const EditUsers = () => {
  const { auth } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState(null); // Para almacenar datos del usuario seleccionado
  const [editFormVisible, setEditFormVisible] = useState(false); // Controlar la visibilidad del formulario de edición
  const [formErrors, setFormErrors] = useState({}); // Almacenar errores de validación

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
      setSelectedUser(response.data);
      setEditFormVisible(true);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Error al obtener los datos del usuario. Intenta de nuevo."
      );
    }
  };

  const validateForm = () => {
    const errors = {};
    const nameRegex = /^[a-zA-Z]{1,20}$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

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

    // Validar contraseña
    if (!selectedUser.password || !passwordRegex.test(selectedUser.password)) {
      errors.password =
        "La contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula, una minúscula, un número y un carácter especial.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveChanges = async () => {
    if (!validateForm()) return;

    try {
      await axios.patch(
        `http://localhost:8080/users/updateUser/${selectedUser._id}`,
        selectedUser,
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
          user._id === selectedUser._id ? selectedUser : user
        )
      );
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Error al actualizar los datos. Intenta de nuevo."
      );
    }
  };

  const handleCancel = () => {
    setEditFormVisible(false);
    setSelectedUser(null);
    setFormErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedUser({ ...selectedUser, [name]: value });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Administrador - Editar Usuarios</h1>
      {errorMessage && <p style={styles.error}>{errorMessage}</p>}
      {successMessage && <p style={styles.success}>{successMessage}</p>}
      {!editFormVisible ? (
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <div style={styles.formContainer}>
          <h2>Editar Usuario</h2>
          <TextField
            label="Nombre"
            name="firstname"
            value={selectedUser.firstname || ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            error={!!formErrors.firstname}
            helperText={formErrors.firstname}
          />
          <TextField
            label="Apellido"
            name="lastname"
            value={selectedUser.lastname || ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            error={!!formErrors.lastname}
            helperText={formErrors.lastname}
          />
          <TextField
            label="Fecha de Nacimiento"
            name="birthdate"
            type="date"
            value={selectedUser.birthdate || ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            error={!!formErrors.birthdate}
            helperText={formErrors.birthdate}
          />
          <TextField
            label="Contraseña"
            name="password"
            type="password"
            value={selectedUser.password || ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            error={!!formErrors.password}
            helperText={formErrors.password}
          />
          <FormControl component="fieldset" margin="normal">
            <Typography>Es Administrador</Typography>
            <RadioGroup
              row
              name="isAdmin"
              value={String(selectedUser.isAdmin)}
              onChange={(e) =>
                setSelectedUser({
                  ...selectedUser,
                  isAdmin: e.target.value === "true",
                })
              }
            >
              <FormControlLabel value="true" control={<Radio />} label="Sí" />
              <FormControlLabel value="false" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>
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
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: "20px" },
  title: { textAlign: "center", marginBottom: "20px" },
  tableContainer: { marginTop: "20px" },
  header: { fontWeight: "bold", textAlign: "center" },
  button: { margin: "0 5px" },
  formContainer: { maxWidth: "600px", margin: "0 auto" },
  buttonContainer: { marginTop: "20px", textAlign: "center" },
  error: { color: "red", textAlign: "center", marginTop: "20px" },
  success: {
    color: "green",
    textAlign: "center",
    marginTop: "10px",
    fontWeight: "bold",
  },
};

export default EditUsers;
