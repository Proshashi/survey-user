import React, { useState } from "react";
import { Layout, Button, Avatar, Dropdown, Space, Typography } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { useSession, signOut } from "next-auth/react";
import styled from "styled-components";
import Link from "next/link";
import { useRouter } from "next/navigation";

const { Header } = Layout;
const { Text } = Typography;

const StyledHeader = styled(Header)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  position: fixed;
  width: 100%;
  z-index: 1000;

  .logo {
    font-size: 20px;
    font-weight: bold;
    color: #1890ff;
  }

  .menu-section {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .mobile-menu {
    display: none;
  }

  @media (max-width: 768px) {
    .menu-items {
      display: none;
    }
    .mobile-menu {
      display: block;
    }
  }
`;

const ProfileButton = styled(Button)`
  height: 40px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  border-radius: 20px;

  &:hover {
    background: #f5f5f5;
  }
`;

const Navbar = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);

  const profileMenu = {
    items: [
      {
        key: "1",
        label: (
          <Space>
            <UserOutlined />
            <span>Profile</span>
          </Space>
        ),
        onClick: () => router.push("/profile"),
      },
      {
        key: "2",
        label: (
          <Space>
            <SettingOutlined />
            <span>Settings</span>
          </Space>
        ),
        onClick: () => router.push("/settings"),
      },
      {
        type: "divider",
      },
      {
        key: "3",
        label: (
          <Space>
            <LogoutOutlined />
            <span>Logout</span>
          </Space>
        ),
        onClick: () => signOut({ callbackUrl: "/login" }),
      },
    ],
  };

  return (
    <StyledHeader>
      <Link href="/" className="logo">
        Survey System
      </Link>

      <div className="menu-section">
        {session?.user ? (
          <Dropdown
            menu={profileMenu as any}
            trigger={["click"]}
            placement="bottomRight"
          >
            <ProfileButton type="text">
              <Avatar
                alt={session.user.name}
                icon={<UserOutlined />}
                size="small"
              />
              <Text strong>{session.user.name}</Text>
            </ProfileButton>
          </Dropdown>
        ) : (
          <Button type="primary" onClick={() => router.push("/login")}>
            Sign In
          </Button>
        )}

        <Button
          className="mobile-menu"
          icon={<MenuOutlined />}
          onClick={() => setMobileMenuVisible(!mobileMenuVisible)}
        />
      </div>
    </StyledHeader>
  );
};

export default Navbar;
