import * as React from "react";
import { render } from "react-dom";
import { D3Demo } from "./d3-demo";
import { SvgDemo } from "./svg";
const App = () => {
  return (
    <div>
      <h2>Start editing to see some magic happen {"\u2728"}</h2>
      <SvgDemo />

      <D3Demo />
    </div>
  );
};

render(<App />, document.getElementById("root"));
