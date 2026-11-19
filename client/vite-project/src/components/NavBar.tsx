import { Box, Tabs, Tab, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

interface NavBarProps {
  value: number;
  onChange: (newValue: number) => void;
}

const NavBar = ({ value, onChange }: NavBarProps) => {
  const navigate = useNavigate();

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    onChange(newValue);
  };

  const handleLogOut = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="notes navigation"
        >
          <Tab label="Create Notes" {...a11yProps(0)} />
          <Tab label="All Notes" {...a11yProps(1)} />
        </Tabs>

        <Button
          type="button"
          variant="contained"
          color="error"
          onClick={handleLogOut}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
};

export default NavBar;
