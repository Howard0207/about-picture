import React from "react";
import { Route } from "react-router-dom";

export default (route) => {
    return <Route path={route.path} render={(arr) => <route.component {...arr} routes={route.routes} />} />;
};
