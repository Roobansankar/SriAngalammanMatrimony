import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  LayoutDashboard,
  Users,
  FileText,
  Building,
  Upload,
  ListChecks,
  CreditCard,
} from "lucide-react";

// In index.js or App.js
import "@fontsource/nunito";

// ✅ Nunito font
import "@fontsource/nunito/400.css";
import "@fontsource/nunito/500.css";
import "@fontsource/nunito/600.css";

const drawerWidth = 260;

const navLinks = [
  {
    name: "Dashboard",
    path: "/admin/homedashboard",
    icon: <LayoutDashboard size={18} />,
  },
  {
    name: "Company Info Form",
    path: "/admin/company-info",
    icon: <LayoutDashboard size={18} />,
  },
  { name: "Buyer Info Form", path: "/admin/buyer", icon: <Users size={18} /> },
  {
    name: "Voucher Entry",
    path: "/admin/voucher-entry",
    icon: <FileText size={18} />,
  },
  {
    name: "Billing Details",
    path: "/admin/billing-details",
    icon: <CreditCard size={18} />,
  },
  {
    name: "Company Details",
    path: "/admin/company-details",
    icon: <Building size={18} />,
  },
  {
    name: "Buyer Details",
    path: "/admin/buyer-details",
    icon: <Users size={18} />,
  },
  { name: "Upload PDF", path: "/admin/upload-pdf", icon: <Upload size={18} /> },
  {
    name: "Cleared List",
    path: "/admin/cleared",
    icon: <ListChecks size={18} />,
  },
  {
    name: "Credit Details",
    path: "/admin/credit-details",
    icon: <CreditCard size={18} />,
  },
];

export default function DashboardLayout() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    navigate("/admin/login", { replace: true });
  };

  const drawer = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#0f172a",
        color: "white",
        fontFamily: "Nunito, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Brand Name */}
      <Toolbar sx={{ px: 2, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <Typography
          noWrap
          sx={{
            fontWeight: 600,
            fontSize: "1.2rem",
            color: "#06b6d4",
            fontFamily: "Nunito, sans-serif",
          }}
        >
         SriAngalammanMatrimony
        </Typography>
      </Toolbar>

      {/* Sidebar Links */}
      <List
        sx={{
          mt: 2,
          px: 1,
          flexGrow: 1,
          overflowY: "auto",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {navLinks.map((item) => (
          <ListItem key={item.name} disablePadding sx={{ mb: 1.2 }}>
            {" "}
            {/* ✅ gap added */}
            <ListItemButton
              component={NavLink}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              disableRipple
              sx={{
                borderRadius: 1.5,
                py: 1,
                px: 1.6,
                fontFamily: "Nunito, sans-serif",
                fontSize: "0.95rem",
                fontWeight: 500,
                color: "rgba(255,255,255,0.85)",
                transition: "all 0.25s ease",
                "&.active": {
                  bgcolor: "#0891b2",
                  color: "#fff",
                  fontWeight: 600,
                  "& .MuiListItemIcon-root": { color: "#fff" },
                },
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.08)",
                  color: "#fff",
                },
              }}
            >
              <ListItemIcon sx={{ color: "inherit", minWidth: 34 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.name}
                primaryTypographyProps={{
                  fontFamily: "Nunito, sans-serif",
                  fontSize: "0.95rem",
                  fontWeight: 500,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", fontFamily: "Nunito, sans-serif" }}>
      <CssBaseline />

      {/* Top AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: "#0f172a",
          color: "white",
          fontFamily: "Nunito, sans-serif",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Mobile menu toggle */}
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Dashboard Title */}
          <Typography
            noWrap
            sx={{
              fontWeight: 500,
              fontSize: "1.05rem",
              fontFamily: "Nunito, sans-serif",
            }}
          >
            Admin Dashboard
          </Typography>

          {/* Logout Button on the right */}
          <Tooltip title="Logout">
            <IconButton color="inherit" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* Sidebar Navigation */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { width: drawerWidth, bgcolor: "#0f172a" },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              bgcolor: "#0f172a",
              color: "white",
              borderRight: "none",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 4 },
          width: { xs: "100%", sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
          bgcolor: "#eef2ff",
          minHeight: "100vh",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
