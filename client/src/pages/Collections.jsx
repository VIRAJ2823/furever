import React from "react";
import Originals from "./Originals";

/**
 * Backward compatibility wrapper:
 * Route `/collections` renders the new Furever Originals drop-based experience.
 */
export default function Collections() {
  return <Originals />;
}