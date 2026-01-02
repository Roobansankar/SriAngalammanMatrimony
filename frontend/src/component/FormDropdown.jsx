import Dropdown from "react-bootstrap/Dropdown";

export default function FormDropdown({
  value,
  placeholder,
  options,
  onSelect,
  disabled = false,
}) {
  return (
    <Dropdown
      data-bs-theme="dark"
      className={`fixed-dropdown ${disabled ? "opacity-75" : ""}`}
    >
      <Dropdown.Toggle
        variant="secondary"
        className="w-100 text-start"
        disabled={disabled}
      >
        {value || placeholder}
      </Dropdown.Toggle>

      <Dropdown.Menu className="w-100">
        {options.length === 0 && (
          <Dropdown.Item disabled>No options</Dropdown.Item>
        )}

        {options.map((opt, idx) => (
          <Dropdown.Item
            key={idx}
            active={value === opt}
            onClick={() => onSelect(opt)}
          >
            {opt}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}
