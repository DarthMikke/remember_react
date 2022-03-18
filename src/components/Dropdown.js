import * as PropTypes from "prop-types";

export default function Dropdown(props) {
  return props.visible ? <ul className={"dropdown-menu"} style=
    {{
      display: "block",
      transform: "translateY(40px)"
    }}
  >
    {props.children}
  </ul> : <></>;
}

Dropdown.propTypes = {
  visible: PropTypes.bool
};
