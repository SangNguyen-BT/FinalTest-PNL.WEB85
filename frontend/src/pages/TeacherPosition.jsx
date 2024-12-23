import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Grid2,
  Button,
  Modal,
  Box,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "white",
  padding: 2,
  borderRadius: 2,
  width: "400px",
};

const TeacherPosition = () => {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [newPosition, setNewPosition] = useState({
    code: "",
    name: "",
    des: "",
    isActive: true,
    isDeleted: false,
  });

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/teacher-positions"
        );
        setPositions(response.data.data); // Giả sử API trả về danh sách trong `data`
      } catch (error) {
        setError("Không thể tải danh sách vị trí công tác.");
      } finally {
        setLoading(false);
      }
    };
    fetchPositions();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setNewPosition({
      code: "",
      name: "",
      des: "",
      isActive: true,
      isDeleted: false,
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewPosition((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/teacher-positions",
        newPosition
      );
      if (response.data.success) {
        setPositions((prevPositions) => [...prevPositions, response.data.data]);
        handleCloseModal();
      }
    } catch (error) {
      console.error("Error creating position:", error);
      setError("Có lỗi xảy ra khi tạo vị trí công tác.");
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Grid2 container spacing={2}>
      {/* Button to open modal */}
      <Grid2 item xs={12}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenModal}
          sx={{ marginBottom: 2 }}
        >
          Tạo mới Vị trí công tác
        </Button>
      </Grid2>

      {/* Table to display positions */}
      <Grid2 item xs={12}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>STT</TableCell>
                <TableCell>Mã</TableCell>
                <TableCell>Tên</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Mô tả</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {positions.map((position, index) => (
                <TableRow key={position._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{position.code}</TableCell>
                  <TableCell>{position.name}</TableCell>
                  <TableCell>
                    {position.isActive ? "Hoạt động" : "Không hoạt động"}
                  </TableCell>
                  <TableCell>{position.des}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid2>

      {/* Modal to create a new position */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{ ...modalStyle }}>
          <Typography variant="h6" gutterBottom>
            Tạo Vị trí Công tác mới
          </Typography>
          <TextField
            label="Mã"
            name="code"
            value={newPosition.code}
            onChange={handleChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Tên"
            name="name"
            value={newPosition.name}
            onChange={handleChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Mô tả"
            name="des"
            value={newPosition.des}
            onChange={handleChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={newPosition.isActive}
                onChange={handleChange}
                name="isActive"
              />
            }
            label="Trạng thái hoạt động"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            fullWidth
            sx={{ marginTop: 2 }}
          >
            Lưu Vị trí
          </Button>
        </Box>
      </Modal>
    </Grid2>
  );
};

export default TeacherPosition;
