import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Grid2,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  Typography,
} from "@mui/material";
import TeacherModal from "../components/TeacherModal";

const ListTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [openModal, setOpenModal] = useState(false);
  const [userId, setUserId] = useState("")

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const fetchUserId = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/user-id');
      setUserId(response.data.userId); 
    } catch (error) {
      console.error('Lỗi khi lấy userId', error);
    }
  };

  const getTeachers = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/teachers?page=${page}&limit=10`
      );
      console.log(response.data);
      setTeachers(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.error("Lỗi lấy danh sách GV", error);
    }
  };
  
  const handleSuccess = () => {
    console.log("Teacher added successfully");
    getTeachers()
  };
  
  useEffect(() => {
    fetchUserId();
    getTeachers();
  }, [page]);

  const handleChangePage = (e, value) => {
    setPage(value);
  };

  return (
    <Grid2 container spacing={2}>
      <Grid2 item xs={3}>
        <Typography variant="h6" gutterBottom>
          Quản lý
        </Typography>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          sx={{ marginBottom: 2 }}
        >
          Danh sách Giáo viên
        </Button>
        <Button
          fullWidth
          variant="contained"
          color="secondary"
          sx={{ marginBottom: 2 }}
        >
          <Link
            to="/teacher-positions"
            style={{ color: "white", textDecoration: "none" }}
          >
            Danh sách Vị trí Công tác
          </Link>
        </Button>
      </Grid2>
      <Grid2 item xs={9}>
        <Typography variant="h5" gutterBottom>
          Danh sách Giáo viên
        </Typography>

        <Button
          variant="contained"
          color="primary"
          sx={{ marginBottom: 2 }}
          onClick={handleOpenModal}
        >
          Thêm Giáo viên
        </Button>

        <TeacherModal
          open={openModal}
          onClose={handleCloseModal}
          onSuccess={handleSuccess}
          userId={userId}
        />

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Mã</TableCell>
                <TableCell>Giáo Viên</TableCell>
                <TableCell>Trình độ</TableCell>
                <TableCell>Địa chỉ</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Vị trí</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {teachers && teachers.length > 0 ? (
                teachers.map((teacher) => (
                  <TableRow key={teacher.code}>
                    <TableCell>{teacher.code}</TableCell>
                    <TableCell>
                      <div>
                        <strong>{teacher.name}</strong>
                      </div>
                      <div>{teacher.email}</div>
                      <div>{teacher.phoneNumber}</div>
                    </TableCell>
                    <TableCell>
                      {teacher.degrees && teacher.degrees.length > 0 ? (
                        teacher.degrees.map((degree, index) => (
                          <div key={index}>
                            <strong>{degree.type}</strong> - {degree.school} (
                            {degree.major})
                          </div>
                        ))
                      ) : (
                        <div>Chưa có học vấn</div>
                      )}
                    </TableCell>
                    <TableCell>{teacher.address}</TableCell>
                    <TableCell
                      sx={{ color: teacher.isActive ? "green" : "red" }}
                    >
                      {teacher.isActive ? "Đang công tác" : "Nghỉ Bệnh"}{" "}
                    </TableCell>
                    <TableCell>{teacher.position}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Không có dữ liệu giáo viên
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Phân trang */}
        <Pagination
          count={totalPages}
          page={page}
          onChange={handleChangePage}
          color="primary"
          sx={{ marginTop: 2 }}
        />
      </Grid2>
    </Grid2>
  );
};

export default ListTeachers;
