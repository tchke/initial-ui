import * as React from "react";
import * as ReactDOM from "react-dom";
import './scss/index.scss';

import { Hello } from "./Hello";

ReactDOM.render(
    <Hello compiler="TypeScript" framework="React" />,
    document.getElementById("root")
);