import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  TextField,
  Checkbox,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
} from "@mui/material";
import { toast } from "react-toastify";
import axios from "axios";

const TeacherModal = ({ open, onClose, onSuccess, userId }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [identity, setIdentity] = useState("");
  const [dob, setDob] = useState("");
  const [degrees, setDegrees] = useState([]);
  const [positions, setPositions] = useState([]);
  const [teacherPositionId, setTeacherPositionId] = useState("");

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/teacher-positions"
        );
        console.log(response.data.data);
        
        setPositions(response.data.data);
      } catch (error) {
        toast.error("Không thể lấy danh sách vị trí");
      }
    };

    fetchPositions();
  }, []);

  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:8080/api/teachers", {
        name,
        email,
        phoneNumber,
        address,
        identity,
        dob,
        degrees,
        userId,
        teacherPositionId,
      });

      toast.success("Tạo giáo viên thành công");
      handleClose();
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || "Đã xảy ra lỗi");
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          width: 600,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <h2>Thêm Giáo viên</h2>
        <TextField
          label="Họ tên"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Số điện thoại"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Địa chỉ"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="CCCD"
          value={identity}
          onChange={(e) => setIdentity(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Ngày sinh"
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          select
          label="Vị trí"
          value={teacherPositionId} 
          onChange={(e) => setTeacherPositionId(e.target.value)} 
          fullWidth
          margin="normal"
        >
          
          {positions.map((position) => (
            <MenuItem key={position._id} value={position._id}>
              {position.name} 
            </MenuItem>
          ))}
        </TextField>

        {/* Bảng degrees */}
        <h4>Học vị</h4>
        <TableContainer component={Paper} sx={{ marginBottom: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Bậc</TableCell>
                <TableCell>Trường</TableCell>
                <TableCell>Chuyên ngành</TableCell>
                <TableCell>Đã tốt nghiệp</TableCell>
                <TableCell>Năm</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {degrees.map((degree, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <TextField
                      value={degree.type}
                      onChange={(e) =>
                        setDegrees((prev) =>
                          prev.map((d, i) =>
                            i === index ? { ...d, type: e.target.value } : d
                          )
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={degree.school}
                      onChange={(e) =>
                        setDegrees((prev) =>
                          prev.map((d, i) =>
                            i === index ? { ...d, school: e.target.value } : d
                          )
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={degree.major}
                      onChange={(e) =>
                        setDegrees((prev) =>
                          prev.map((d, i) =>
                            i === index ? { ...d, major: e.target.value } : d
                          )
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      checked={degree.isGraduated}
                      onChange={(e) =>
                        setDegrees((prev) =>
                          prev.map((d, i) =>
                            i === index
                              ? { ...d, isGraduated: e.target.checked }
                              : d
                          )
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={degree.year}
                      onChange={(e) =>
                        setDegrees((prev) =>
                          prev.map((d, i) =>
                            i === index ? { ...d, year: e.target.value } : d
                          )
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      color="secondary"
                      onClick={() =>
                        setDegrees((prev) => prev.filter((_, i) => i !== index))
                      }
                    >
                      Xóa
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button
            color="primary"
            onClick={() =>
              setDegrees([
                ...degrees,
                {
                  type: "",
                  school: "",
                  major: "",
                  isGraduated: false,
                  year: "",
                },
              ])
            }
          >
            Thêm học vị
          </Button>
        </TableContainer>

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          fullWidth
          sx={{ marginBottom: 2 }}
        >
          Lưu
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleClose}
          fullWidth
        >
          Hủy
        </Button>
      </Box>
    </Modal>
  );
};

export default TeacherModal;
