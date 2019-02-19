import * as React from "react";
import request from './jsonproxy';

export interface HelloProps { compiler: string; framework: string; }

export const Hello = (props: HelloProps) => {
    return (
        <div>
            {request}
        </div>
    );
}