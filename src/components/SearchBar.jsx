import React, { useState } from "react";
import { AutoComplete, Input, message } from "antd";
import axios from "axios";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

const SearchBar = ({ onSelectLocation }) => {
  const [options, setOptions] = useState([]);

  const handleSearch = async (value) => {
    if (!value.trim()) {
      setOptions([]);
      return;
    }

    try {
      const res = await axios.get(
        "https://api.openweathermap.org/geo/1.0/direct",
        {
          params: {
            q: value,
            limit: 5,
            appid: API_KEY,
          },
        }
      );

      const suggestions = res.data.map((item) => ({
        label: `${item.name}${item.state ? ", " + item.state : ""}, ${
          item.country
        }`,
        value: JSON.stringify({
          lat: item.lat,
          lon: item.lon,
          name: item.name,
        }),
      }));

      setOptions(suggestions);
    } catch (err) {
      console.error("Lỗi tìm kiếm:", err);
      message.error("Không thể tải danh sách địa điểm.");
    }
  };

  const handleSelect = (value) => {
    try {
      const location = JSON.parse(value);
      onSelectLocation(location); // Gọi callback khi user chọn 1 item
    } catch (err) {
      message.error("Lỗi khi chọn địa điểm.");
    }
  };

  return (
    <AutoComplete
      options={options}
      onSearch={handleSearch}
      onSelect={handleSelect}
      style={{ width: 300, marginBottom: 24 }}
      filterOption={false} // Không cho lọc nội bộ → dùng kết quả API
    >
      <Input.Search placeholder="Tìm địa điểm" enterButton />
    </AutoComplete>
  );
};

export default SearchBar;
