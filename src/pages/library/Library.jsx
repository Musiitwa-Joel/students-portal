"use client";

import { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Input,
  Button,
  Tabs,
  Pagination,
  Select,
  Tag,
  Modal,
  Spin,
  Empty,
  Typography,
  Divider,
  Space,
  List,
  Avatar,
  Tooltip,
  Badge,
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  FileTextOutlined,
  BookOutlined,
  ReadOutlined,
  HistoryOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  StarOutlined,
  StarFilled,
  FileProtectOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  FileExcelOutlined,
  FilePptOutlined,
  FileUnknownOutlined,
  InfoCircleOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import "./library-screen.css";

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

// Mock data for demonstration
const generateMockResources = () => {
  const resourceTypes = [
    "Paper",
    "Dissertation",
    "E-Book",
    "Journal",
    "Article",
  ];
  const subjects = [
    "Computer Science",
    "Mathematics",
    "Physics",
    "Biology",
    "Chemistry",
    "Literature",
    "History",
  ];
  const years = [2023, 2022, 2021, 2020, 2019, 2018];
  const authors = [
    "John Smith",
    "Maria Garcia",
    "Wei Zhang",
    "Aisha Patel",
    "James Johnson",
    "Emma Wilson",
    "Mohammed Al-Farsi",
    "Sophia Lee",
    "Daniel Brown",
    "Olivia Martinez",
  ];

  const resources = [];

  for (let i = 1; i <= 120; i++) {
    const type =
      resourceTypes[Math.floor(Math.random() * resourceTypes.length)];
    const subject = subjects[Math.floor(Math.random() * subjects.length)];
    const year = years[Math.floor(Math.random() * years.length)];
    const author = authors[Math.floor(Math.random() * authors.length)];
    const isPastPaper = Math.random() > 0.7;

    resources.push({
      id: i,
      title: `${subject} ${type} ${i}: Advanced Concepts and Applications`,
      type,
      subject,
      year,
      author,
      abstract: `This ${type.toLowerCase()} explores the fundamental principles and advanced applications of ${subject}. It provides a comprehensive analysis of recent developments and future directions in the field.`,
      isPastPaper,
      dateAdded: new Date(Date.now() - Math.floor(Math.random() * 10000000000)),
      views: Math.floor(Math.random() * 1000),
      fileType: ["PDF", "DOCX", "PPTX", "XLSX"][Math.floor(Math.random() * 4)],
      pages: Math.floor(Math.random() * 200) + 10,
      isFavorite: Math.random() > 0.8,
      thumbnailColor: `hsl(${Math.floor(Math.random() * 360)}, 70%, 80%)`,
    });
  }

  return resources;
};

// Mock content for preview
const generateMockContent = (resource) => {
  const paragraphs = [];
  const paragraphCount = 10 + Math.floor(Math.random() * 20);

  paragraphs.push(
    `# ${resource.title}\n\n**Author:** ${resource.author} | **Year:** ${resource.year} | **Type:** ${resource.type}\n\n## Abstract\n\n${resource.abstract}\n\n## Introduction\n`
  );

  for (let i = 0; i < paragraphCount; i++) {
    const paragraphLength = 100 + Math.floor(Math.random() * 20);
    let paragraph = "";

    for (let j = 0; j < paragraphLength; j++) {
      paragraph += "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ";
    }

    if (i % 3 === 0) {
      paragraphs.push(`\n## Section ${Math.floor(i / 3) + 1}\n`);
    }

    paragraphs.push(paragraph);
  }

  return paragraphs.join("\n\n");
};

// File type icon mapping
const getFileIcon = (fileType) => {
  switch (fileType) {
    case "PDF":
      return <FilePdfOutlined style={{ color: "#ff4d4f" }} />;
    case "DOCX":
      return <FileWordOutlined style={{ color: "#1890ff" }} />;
    case "PPTX":
      return <FilePptOutlined style={{ color: "#fa8c16" }} />;
    case "XLSX":
      return <FileExcelOutlined style={{ color: "#52c41a" }} />;
    default:
      return <FileUnknownOutlined />;
  }
};

const LibraryScreen = () => {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [totalItems, setTotalItems] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedResource, setSelectedResource] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewContent, setPreviewContent] = useState("");
  const [filterOptions, setFilterOptions] = useState({
    type: [],
    subject: [],
    year: [],
    author: [],
  });
  const [activeFilters, setActiveFilters] = useState({
    type: [],
    subject: [],
    year: [],
    author: [],
  });
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("dateAdded");
  const [sortOrder, setSortOrder] = useState("desc");

  // Load resources on component mount
  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        const data = generateMockResources();
        setResources(data);

        // Extract filter options
        const types = [...new Set(data.map((item) => item.type))];
        const subjects = [...new Set(data.map((item) => item.subject))];
        const years = [...new Set(data.map((item) => item.year))];
        const authors = [...new Set(data.map((item) => item.author))];

        setFilterOptions({
          type: types,
          subject: subjects,
          year: years,
          author: authors,
        });

        setLoading(false);
      }, 1000);
    };

    fetchResources();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let result = [...resources];

    // Filter by tab
    if (activeTab === "pastPapers") {
      result = result.filter((item) => item.isPastPaper);
    } else if (activeTab !== "all") {
      result = result.filter((item) => item.type.toLowerCase() === activeTab);
    }

    // Apply search
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(searchLower) ||
          item.author.toLowerCase().includes(searchLower) ||
          item.subject.toLowerCase().includes(searchLower) ||
          item.abstract.toLowerCase().includes(searchLower)
      );
    }

    // Apply filters
    Object.keys(activeFilters).forEach((filterKey) => {
      if (activeFilters[filterKey].length > 0) {
        result = result.filter((item) =>
          activeFilters[filterKey].includes(item[filterKey])
        );
      }
    });

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "author":
          comparison = a.author.localeCompare(b.author);
          break;
        case "year":
          comparison = a.year - b.year;
          break;
        case "views":
          comparison = a.views - b.views;
          break;
        case "dateAdded":
        default:
          comparison = new Date(a.dateAdded) - new Date(b.dateAdded);
          break;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    setTotalItems(result.length);
    setFilteredResources(result);
  }, [resources, searchText, activeTab, activeFilters, sortBy, sortOrder]);

  // Handle resource preview
  const handlePreview = (resource) => {
    setSelectedResource(resource);
    setPreviewVisible(true);
    setPreviewLoading(true);

    // Simulate loading preview content
    setTimeout(() => {
      setPreviewContent(generateMockContent(resource));
      setPreviewLoading(false);
    }, 800);
  };

  // Handle page change
  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
    window.scrollTo(0, 0);
  };

  // Handle search
  const handleSearch = (value) => {
    setSearchText(value);
    setCurrentPage(1);
  };

  // Handle tab change
  const handleTabChange = (key) => {
    setActiveTab(key);
    setCurrentPage(1);
  };

  // Handle filter change
  const handleFilterChange = (filterType, values) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterType]: values,
    }));
    setCurrentPage(1);
  };

  // Toggle favorite status
  const handleToggleFavorite = (e, resourceId) => {
    e.stopPropagation();
    setResources((prev) =>
      prev.map((resource) =>
        resource.id === resourceId
          ? { ...resource, isFavorite: !resource.isFavorite }
          : resource
      )
    );
  };

  // Calculate current page items
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredResources.slice(startIndex, endIndex);
  };

  // Render resource card
  const renderResourceCard = (resource) => {
    return (
      <Card
        hoverable
        className="resource-card"
        onClick={() => handlePreview(resource)}
        cover={
          <div
            className="resource-thumbnail"
            style={{ backgroundColor: resource.thumbnailColor }}
          >
            {getFileIcon(resource.fileType)}
            <Text className="resource-pages">{resource.pages} pages</Text>
          </div>
        }
        actions={[
          <Tooltip title="Preview" key="preview">
            <EyeOutlined key="preview" />
          </Tooltip>,
          <Tooltip
            title={
              resource.isFavorite ? "Remove from favorites" : "Add to favorites"
            }
            key="favorite-tooltip"
          >
            {resource.isFavorite ? (
              <StarFilled
                key="favorite"
                style={{ color: "#faad14" }}
                onClick={(e) => handleToggleFavorite(e, resource.id)}
              />
            ) : (
              <StarOutlined
                key="favorite"
                onClick={(e) => handleToggleFavorite(e, resource.id)}
              />
            )}
          </Tooltip>,
          <Tooltip title="Information" key="info">
            <InfoCircleOutlined key="info" />
          </Tooltip>,
        ]}
      >
        <div className="resource-meta">
          <Tag color={resource.isPastPaper ? "purple" : "blue"}>
            {resource.type}
          </Tag>
          <Tag color="green">{resource.year}</Tag>
        </div>
        <Card.Meta
          title={resource.title}
          description={
            <>
              <Text type="secondary">{resource.author}</Text>
              <br />
              <Text type="secondary">{resource.subject}</Text>
              <div className="resource-stats">
                <Text type="secondary">
                  <EyeOutlined /> {resource.views}
                </Text>
                <Text type="secondary">
                  <ClockCircleOutlined />{" "}
                  {new Date(resource.dateAdded).toLocaleDateString()}
                </Text>
              </div>
            </>
          }
        />
      </Card>
    );
  };

  // Render resource list item
  const renderResourceListItem = (resource) => {
    return (
      <List.Item
        key={resource.id}
        actions={[
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => handlePreview(resource)}
          >
            Preview
          </Button>,
          resource.isFavorite ? (
            <StarFilled
              style={{ color: "#faad14", fontSize: "18px" }}
              onClick={(e) => handleToggleFavorite(e, resource.id)}
            />
          ) : (
            <StarOutlined
              style={{ fontSize: "18px" }}
              onClick={(e) => handleToggleFavorite(e, resource.id)}
            />
          ),
        ]}
      >
        <List.Item.Meta
          avatar={
            <Avatar
              icon={getFileIcon(resource.fileType)}
              style={{ backgroundColor: resource.thumbnailColor }}
              shape="square"
              size={48}
            />
          }
          title={
            <Space>
              {resource.title}
              {resource.isPastPaper && (
                <Badge
                  count="Past Paper"
                  style={{ backgroundColor: "#722ed1" }}
                />
              )}
            </Space>
          }
          description={
            <>
              <Space>
                <Tag color="blue">{resource.type}</Tag>
                <Tag color="green">{resource.year}</Tag>
                <Text type="secondary">{resource.author}</Text>
                <Text type="secondary">{resource.subject}</Text>
              </Space>
              <div style={{ marginTop: 8 }}>
                <Text type="secondary" ellipsis={{ rows: 2 }}>
                  {resource.abstract}
                </Text>
              </div>
              <div className="resource-stats" style={{ marginTop: 8 }}>
                <Text type="secondary">
                  <EyeOutlined /> {resource.views} views
                </Text>
                <Text type="secondary">
                  <ClockCircleOutlined /> Added:{" "}
                  {new Date(resource.dateAdded).toLocaleDateString()}
                </Text>
                <Text type="secondary">
                  <FileProtectOutlined /> {resource.pages} pages
                </Text>
              </div>
            </>
          }
        />
      </List.Item>
    );
  };

  // Render preview content
  const renderPreviewContent = () => {
    if (!selectedResource) return null;

    const lines = previewContent.split("\n");

    return (
      <div className="preview-content">
        {lines.map((line, index) => {
          if (line.startsWith("# ")) {
            return (
              <Title level={1} key={index}>
                {line.substring(2)}
              </Title>
            );
          } else if (line.startsWith("## ")) {
            return (
              <Title level={2} key={index}>
                {line.substring(3)}
              </Title>
            );
          } else if (line.startsWith("### ")) {
            return (
              <Title level={3} key={index}>
                {line.substring(4)}
              </Title>
            );
          } else if (line.startsWith("**") && line.endsWith("**")) {
            return (
              <Text strong key={index}>
                {line.substring(2, line.length - 2)}
              </Text>
            );
          } else if (line === "") {
            return <br key={index} />;
          } else {
            return <Paragraph key={index}>{line}</Paragraph>;
          }
        })}
      </div>
    );
  };

  return (
    <div className="library-container">
      <div className="library-header">
        <Title level={2}>Academic Library</Title>
        <Paragraph>Browse and preview academic resources</Paragraph>
      </div>

      <div className="search-section">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={12}>
            <Input.Search
              placeholder="Search by title, author, subject..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              onSearch={handleSearch}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Col>
          <Col xs={24} md={12}>
            <Space wrap>
              <Button
                icon={<FilterOutlined />}
                onClick={() => setFiltersVisible(!filtersVisible)}
                type={filtersVisible ? "primary" : "default"}
              >
                Filters
              </Button>
              <Select
                placeholder="View mode"
                value={viewMode}
                onChange={setViewMode}
                style={{ width: 120 }}
              >
                <Option value="grid">Grid View</Option>
                <Option value="list">List View</Option>
              </Select>
              <Select
                placeholder="Sort by"
                value={sortBy}
                onChange={setSortBy}
                style={{ width: 120 }}
              >
                <Option value="dateAdded">Date Added</Option>
                <Option value="title">Title</Option>
                <Option value="author">Author</Option>
                <Option value="year">Year</Option>
                <Option value="views">Views</Option>
              </Select>
              <Select
                placeholder="Order"
                value={sortOrder}
                onChange={setSortOrder}
                style={{ width: 120 }}
              >
                <Option value="desc">Descending</Option>
                <Option value="asc">Ascending</Option>
              </Select>
            </Space>
          </Col>
        </Row>

        {filtersVisible && (
          <div className="filter-section">
            <Divider orientation="left">Filters</Divider>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <div className="filter-group">
                  <Text strong>Resource Type</Text>
                  <Select
                    mode="multiple"
                    allowClear
                    style={{ width: "100%" }}
                    placeholder="Select types"
                    value={activeFilters.type}
                    onChange={(values) => handleFilterChange("type", values)}
                  >
                    {filterOptions.type.map((type) => (
                      <Option key={type} value={type}>
                        {type}
                      </Option>
                    ))}
                  </Select>
                </div>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <div className="filter-group">
                  <Text strong>Subject</Text>
                  <Select
                    mode="multiple"
                    allowClear
                    style={{ width: "100%" }}
                    placeholder="Select subjects"
                    value={activeFilters.subject}
                    onChange={(values) => handleFilterChange("subject", values)}
                  >
                    {filterOptions.subject.map((subject) => (
                      <Option key={subject} value={subject}>
                        {subject}
                      </Option>
                    ))}
                  </Select>
                </div>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <div className="filter-group">
                  <Text strong>Year</Text>
                  <Select
                    mode="multiple"
                    allowClear
                    style={{ width: "100%" }}
                    placeholder="Select years"
                    value={activeFilters.year}
                    onChange={(values) => handleFilterChange("year", values)}
                  >
                    {filterOptions.year.map((year) => (
                      <Option key={year} value={year}>
                        {year}
                      </Option>
                    ))}
                  </Select>
                </div>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <div className="filter-group">
                  <Text strong>Author</Text>
                  <Select
                    mode="multiple"
                    allowClear
                    style={{ width: "100%" }}
                    placeholder="Select authors"
                    value={activeFilters.author}
                    onChange={(values) => handleFilterChange("author", values)}
                  >
                    {filterOptions.author.map((author) => (
                      <Option key={author} value={author}>
                        {author}
                      </Option>
                    ))}
                  </Select>
                </div>
              </Col>
            </Row>
            <div className="filter-actions">
              <Button
                type="primary"
                onClick={() =>
                  setActiveFilters({
                    type: [],
                    subject: [],
                    year: [],
                    author: [],
                  })
                }
              >
                Clear All Filters
              </Button>
            </div>
          </div>
        )}
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={handleTabChange}
        className="resource-tabs"
      >
        <TabPane
          tab={
            <span>
              <BookOutlined />
              All Resources
            </span>
          }
          key="all"
        />
        <TabPane
          tab={
            <span>
              <FileTextOutlined />
              Papers
            </span>
          }
          key="paper"
        />
        <TabPane
          tab={
            <span>
              <ReadOutlined />
              Dissertations
            </span>
          }
          key="dissertation"
        />
        <TabPane
          tab={
            <span>
              <BookOutlined />
              E-Books
            </span>
          }
          key="e-book"
        />
        <TabPane
          tab={
            <span>
              <FileTextOutlined />
              Journals
            </span>
          }
          key="journal"
        />
        <TabPane
          tab={
            <span>
              <HistoryOutlined />
              Past Papers
            </span>
          }
          key="pastPapers"
        />
      </Tabs>

      <div className="resources-section">
        {loading ? (
          <div className="loading-container">
            <Spin size="large" />
            <Text>Loading resources...</Text>
          </div>
        ) : filteredResources.length === 0 ? (
          <Empty
            description="No resources found matching your criteria"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : viewMode === "grid" ? (
          <Row gutter={[16, 16]}>
            {getCurrentPageItems().map((resource) => (
              <Col xs={24} sm={12} md={8} lg={6} key={resource.id}>
                {renderResourceCard(resource)}
              </Col>
            ))}
          </Row>
        ) : (
          <List
            itemLayout="vertical"
            size="large"
            dataSource={getCurrentPageItems()}
            renderItem={renderResourceListItem}
          />
        )}

        <div className="pagination-container">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={totalItems}
            onChange={handlePageChange}
            showSizeChanger
            showQuickJumper
            showTotal={(total) => `Total ${total} items`}
          />
        </div>
      </div>

      <Modal
        title={
          <div className="preview-header">
            <div>
              {selectedResource && (
                <>
                  {getFileIcon(selectedResource?.fileType)}
                  <span className="preview-title">
                    {selectedResource?.title}
                  </span>
                </>
              )}
            </div>
            <Button
              icon={<CloseOutlined />}
              type="text"
              onClick={() => setPreviewVisible(false)}
            />
          </div>
        }
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={null}
        width="80%"
        className="preview-modal"
        style={{ top: 20 }}
        bodyStyle={{ maxHeight: "calc(90vh - 100px)", overflowY: "auto" }}
      >
        {previewLoading ? (
          <div className="preview-loading">
            <Spin size="large" />
            <Text>Loading preview...</Text>
          </div>
        ) : (
          <div className="preview-container">
            <div className="preview-toolbar">
              <div className="preview-info">
                {selectedResource && (
                  <>
                    <Tag color="blue">{selectedResource.type}</Tag>
                    <Tag color="green">{selectedResource.year}</Tag>
                    <Text>{selectedResource.author}</Text>
                    <Text>{selectedResource.subject}</Text>
                    <Text>
                      <FileProtectOutlined /> {selectedResource.pages} pages
                    </Text>
                  </>
                )}
              </div>
              <div className="preview-actions">
                <Tooltip title="This is a preview only. Downloads are not permitted.">
                  <Text type="secondary">Preview Mode</Text>
                </Tooltip>
                <Button
                  type="primary"
                  icon={
                    selectedResource?.isFavorite ? (
                      <StarFilled />
                    ) : (
                      <StarOutlined />
                    )
                  }
                  onClick={() => {
                    if (selectedResource) {
                      handleToggleFavorite(
                        { stopPropagation: () => {} },
                        selectedResource.id
                      );
                    }
                  }}
                >
                  {selectedResource?.isFavorite
                    ? "Remove from Favorites"
                    : "Add to Favorites"}
                </Button>
              </div>
            </div>
            <Divider />
            {renderPreviewContent()}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default LibraryScreen;
