import React, { useEffect, useState } from "react";
import { Card, Typography, Spin, Row, Col, Tag, message, Button } from "antd";
import { fetchWeatherNews } from "../services/weatherService";
import { LoadingOutlined, ReloadOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const News = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const loadNews = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const data = await fetchWeatherNews();
      setNewsList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      const msg = err.message || "Không thể tải tin tức thời tiết";
      setErrorMsg(msg);
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 20 }}>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />} />
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div style={{ textAlign: "center", padding: 20 }}>
        <Paragraph type="danger" style={{ fontSize: 16 }}>
          {errorMsg}
        </Paragraph>
        <Button type="primary" icon={<ReloadOutlined />} onClick={loadNews}>
          Thử lại
        </Button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <Title level={2}>Tin tức thời tiết mới nhất</Title>
      <Row gutter={[16, 16]}>
        {newsList.length > 0 ? (
          newsList.map((item, index) => (
            <Col xs={24} sm={12} md={8} key={index}>
              <Card
                hoverable
                cover={
                  <img
                    alt={item.title}
                    src={item.image || "https://via.placeholder.com/400x200?text=No+Image"}
                    style={{ height: 200, objectFit: "cover" }}
                  />
                }
                onClick={() => window.open(item.link, "_blank")}
              >
                <Tag color="blue">{item.source || "Nguồn tin"}</Tag>
                <Title level={4} style={{ marginTop: 8 }}>
                  {item.title}
                </Title>
                <Paragraph ellipsis={{ rows: 3 }}>
                  {item.description || "Không có mô tả."}
                </Paragraph>
                <Paragraph type="secondary" style={{ fontSize: 12 }}>
                  {item.publishedAt
                    ? new Date(item.publishedAt).toLocaleString("vi-VN")
                    : "Không rõ thời gian"}
                </Paragraph>
              </Card>
            </Col>
          ))
        ) : (
          <Col span={24}>
            <Paragraph>Không tìm thấy tin tức thời tiết.</Paragraph>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default News;
