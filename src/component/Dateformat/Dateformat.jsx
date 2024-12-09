import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

function DatePicker({ value, onChange }) {
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Pastikan tanggal hanya diubah jika semua nilai day, month, dan year tersedia
  const handleDateChange = () => {
    console.log("Day:", day, "Month:", month, "Year:", year); // Log nilai day, month, year
    if (day && month && year) {
      setErrorMessage(""); // Hapus pesan error
      const newDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      console.log("Formatted date:", newDate); // Log tanggal yang diformat
      onChange(newDate); // Pastikan semua nilai valid
    } else {
      console.log("Incomplete date input"); // Log jika input tidak lengkap
      onChange(""); // Kembalikan string kosong jika data tidak lengkap
      setErrorMessage("Available date is empty"); // Tampilkan pesan error
    }
  };

  // Efek untuk menyinkronkan nilai `value` jika berubah dari luar
  useEffect(() => {
    console.log("Initial value:", value); // Log nilai awal yang diterima
    if (!value || typeof value !== "string" || value.split("-").length !== 3) {
      setDay("");
      setMonth("");
      setYear("");
      setErrorMessage("Available date is empty");
    } else {
      const [newYear, newMonth, newDay] = value.split("-");
      setDay(newDay || "");
      setMonth(newMonth || "");
      setYear(newYear || "");
      setErrorMessage(""); // Hapus pesan error jika value valid
    }
  }, [value]);

  return (
    <div className="date-picker">
      <div style={{ marginBottom: "10px", color: "red" }}>{errorMessage}</div>
      <input
        type="number"
        placeholder="Day"
        value={day}
        onChange={(e) => {
          setDay(e.target.value);
          handleDateChange();
        }}
        style={{ width: "30%", marginRight: "5px" }}
      />
      <select
        value={month}
        onChange={(e) => {
          setMonth(e.target.value);
          handleDateChange();
        }}
        style={{ width: "30%", marginRight: "5px" }}
      >
        <option value="">Month</option>
        <option value="01">January</option>
        <option value="02">February</option>
        <option value="03">March</option>
        <option value="04">April</option>
        <option value="05">May</option>
        <option value="06">June</option>
        <option value="07">July</option>
        <option value="08">August</option>
        <option value="09">September</option>
        <option value="10">October</option>
        <option value="11">November</option>
        <option value="12">December</option>
      </select>
      <input
        type="number"
        placeholder="Year"
        value={year}
        onChange={(e) => {
          setYear(e.target.value);
          handleDateChange();
        }}
        style={{ width: "30%" }}
      />
    </div>
  );
}

DatePicker.propTypes = {
  value: PropTypes.string, // Nilai tanggal dalam format YYYY-MM-DD
  onChange: PropTypes.func.isRequired, // Callback ketika tanggal berubah
};

export default DatePicker;
