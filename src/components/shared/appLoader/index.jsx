import React, { useEffect } from "react";
import { ResetLoading, getLoadStatus, getTotalRequest } from "../../../redux/features/loader";
import { useDispatch, useSelector } from "react-redux";
import { Spin } from "antd";
import './style.css';

const AppLoader = () => {
  const dispatch = useDispatch();
  const loading = useSelector(getLoadStatus);
  const totalRequest = useSelector(getTotalRequest);

  useEffect(() => {
    // '===' use kiya warning khatam karne ke liye
    if (loading !== 0 && loading === totalRequest) {
      dispatch(ResetLoading());
    }
  }, [loading, totalRequest, dispatch]);

  useEffect(() => {
    dispatch(ResetLoading());
  }, [dispatch]);

  // Agar loading nahi hai toh component render hi na ho
  if (loading >= totalRequest) return null;

  return (
    <div className="sub-container">
       <Spin size="large" />
       <p style={{ marginTop: 10, color: '#1677ff' }}>Loading Stay Haven...</p>
    </div>
  );
};

export default AppLoader;