import React from "react";
import { Card, Button, Tooltip } from "antd";
import {
  LeftOutlined,
  RightOutlined,
  ExpandOutlined,
  CompressOutlined,
} from "@ant-design/icons";
import HourlyForecastCard from "./HourlyForecastCard";

const HourlyForecastList = ({
  selectedDate,
  groupedByDay,
  hourlyScrollRef,
  scrollX,
  expandedAll,
  setExpandedAll,
  showHourlyScrollButtons,
}) => {
  return (
    <Card
      style={{
        background: "#2a2f4a",
        color: "#fff",
        marginTop: 16,
        borderRadius: 12,
        width: "100%",
      }}
      bodyStyle={{
        padding: 12,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ fontWeight: 500, fontSize: 14 }}>Dự báo theo giờ</div>
        <Tooltip title={expandedAll ? "Thu gọn tất cả" : "Xem tất cả"}>
          <Button
            shape="circle"
            size="small"
            type="text"
            icon={expandedAll ? <CompressOutlined /> : <ExpandOutlined />}
            onClick={() => setExpandedAll((prev) => !prev)}
            style={{ color: "#fff" }}
          />
        </Tooltip>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          width: "100%",
        }}
      >
        {showHourlyScrollButtons && (
          <Button
            icon={<LeftOutlined />}
            onClick={() => scrollX(hourlyScrollRef, -1)}
          />
        )}
        <div
          ref={hourlyScrollRef}
          style={{
            display: "flex",
            gap: 12,
            overflowX: "auto",
            flex: 1,
            padding: "0 8px",
          }}
        >
          {groupedByDay[selectedDate]?.map((hour, idx) => (
            <div key={idx} style={{ minWidth: 160 }}>
              <HourlyForecastCard data={hour} expandedAll={expandedAll} />
            </div>
          ))}
        </div>
        {showHourlyScrollButtons && (
          <Button
            icon={<RightOutlined />}
            onClick={() => scrollX(hourlyScrollRef, 1)}
          />
        )}
      </div>
    </Card>
  );
};

export default HourlyForecastList;
