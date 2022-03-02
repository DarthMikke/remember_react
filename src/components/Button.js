import React from "react";

/**
 * props should contain:
 * - caption
 * - visible (default: true)
 * - icon
 * - completion
 * - classNames: additional button classes
 * */
export default function (props) {
  let caption_visible = props.visible === undefined ? true : props.visible;
  let visible_classes = !caption_visible ? "visually-hidden visually-hidden-focusable" : null;
  let caption = <span className={visible_classes}>props.caption</span>;
  let icon = props.icon === undefined ? null : <i className={`bi bi-${props.icon}`}/>;
  let classes = "btn ms-1";
  if (props.classNames !== undefined) {
    classes = classes + " " + props.classNames;
  }

  return <a
    href={"#"}
    onClick={() => props.completion()}
    className={classes}>
    {icon} {caption}
  </a>
}