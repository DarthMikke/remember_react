import * as PropTypes from "prop-types";

export default function Dropdown({children, xOffset, visible}) {
  xOffset = xOffset === undefined ? 0 : `${xOffset}px`;
  return visible ? <ul className={"dropdown-menu"} style=
    {{
      display: "block",
      transform: `translate3D(${xOffset}, 40px, 0)`
    }}
  >
    {children}
  </ul> : <></>;
}

Dropdown.propTypes = {
  visible: PropTypes.bool
};
