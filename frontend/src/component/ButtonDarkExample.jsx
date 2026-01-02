import Dropdown from "react-bootstrap/Dropdown";
import "bootstrap/dist/css/bootstrap.min.css";
import "./dropdown.css";

function ButtonDarkExample() {
  return (
    <div style={{ width: "200px" }}>
      <Dropdown data-bs-theme="dark" className="fixed-dropdown">
        <Dropdown.Toggle
          id="dropdown-button-dark"
          variant="secondary"
          className="w-100"
        >
          Dropdown Button
        </Dropdown.Toggle>

        <Dropdown.Menu className="w-100">
          <Dropdown.Item active>Action</Dropdown.Item>
          <Dropdown.Item>Another action</Dropdown.Item>
          <Dropdown.Item>
            Something else Something else Something else
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item>Separated link</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}

export default ButtonDarkExample;
