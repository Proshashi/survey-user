import React from "react";
import { Layout as AntLayout, Breadcrumb, Spin } from "antd";
import styled from "styled-components";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
const { Content } = AntLayout;

const StyledLayout = styled(AntLayout)`
  min-height: 100vh;
`;

const MainContent = styled(Content)`
  margin: 24px;
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  min-height: 280px;
  position: relative;
`;

const ContentWrapper = styled.div`
  margin-top: 64px;
  transition: all 0.2s;
`;

const StyledBreadcrumb = styled(Breadcrumb)`
  margin: 16px 24px;
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

interface LayoutProps {
  children: React.ReactNode;
  loading?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, loading = false }) => {
  //   const pathname = usePathname();

  //   const pathSegments = pathname?.split("/").filter(Boolean) || [];

  return (
    <StyledLayout>
      <Navbar />
      <StyledLayout>
        <ContentWrapper>
          {/* <StyledBreadcrumb
            items={[
              { title: "Home" },
              ...pathSegments.map((segment) => ({
                title: segment.charAt(0).toUpperCase() + segment.slice(1),
              })),
            ]}
          /> */}
          <MainContent>
            {loading && (
              <LoadingOverlay>
                <Spin size="large" />
              </LoadingOverlay>
            )}
            {children}
          </MainContent>
        </ContentWrapper>
      </StyledLayout>
    </StyledLayout>
  );
};

export default Layout;
