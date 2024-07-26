import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { hourglass } from "ldrs";
function Loadding() {
  hourglass.register();
  return (
    <Modal
      className="loadding"
      disableAutoFocus
      open
      aria-labelledby="server-modal-title"
      aria-describedby="server-modal-description"
      sx={{
        display: "flex",
        p: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box>
        <l-hourglass size="70" speed="2.4" color="#8bd8bd"></l-hourglass>
      </Box>
    </Modal>
  );
}
export default Loadding;
