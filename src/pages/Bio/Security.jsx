import React from "react";
import { Form, Input, Button, List, Switch, Divider } from "antd";

const SecurityTab = () => (
  <div>
    <Form layout="vertical">
      <Form.Item label="Current Password">
        <Input.Password />
      </Form.Item>
      <Form.Item label="New Password">
        <Input.Password />
      </Form.Item>
      <Form.Item label="Confirm New Password">
        <Input.Password />
      </Form.Item>
      <Button size="small" type="primary">
        Update Password
      </Button>
    </Form>
  </div>
);

export default SecurityTab;
