import * as React from 'react';
import { Link, Routes, Route } from "react-router";
const Lib1 = React.lazy(() => import('@acme/lib-1'));
const Lib2 = React.lazy(() => import('@acme/lib-2'));
const Lib3 = React.lazy(() => import('@acme/lib-3'));
const Lib4 = React.lazy(() => import('@acme/lib-4'));
const Lib5 = React.lazy(() => import('@acme/lib-5'));
const Lib6 = React.lazy(() => import('@acme/lib-6'));
const Lib7 = React.lazy(() => import('@acme/lib-7'));
const Lib8 = React.lazy(() => import('@acme/lib-8'));
const Lib9 = React.lazy(() => import('@acme/lib-9'));
const Lib10 = React.lazy(() => import('@acme/lib-10'));

export function App() {
  return (
    <>
      <ul>
        <Link to="/">Home</Link>
        <Link to="/lib-2">Lib 2</Link>
        <Link to="/lib-3">Lib 3</Link>
        <Link to="/lib-4">Lib 4</Link>
        <Link to="/lib-5">Lib 5</Link>
        <Link to="/lib-6">Lib 6</Link>
        <Link to="/lib-7">Lib 7</Link>
        <Link to="/lib-8">Lib 8</Link>
        <Link to="/lib-9">Lib 9</Link>
        <Link to="/lib-10">Lib 10</Link>
      </ul>
      <Routes>
        <Route index element={<Lib1 />} />
        <Route path="lib-2" element={<Lib2 />} />
        <Route path="lib-3" element={<Lib3 />} />
        <Route path="lib-4" element={<Lib4 />} />
        <Route path="lib-5" element={<Lib5 />} />
        <Route path="lib-6" element={<Lib6 />} />
        <Route path="lib-7" element={<Lib7 />} />
        <Route path="lib-8" element={<Lib8 />} />
        <Route path="lib-9" element={<Lib9 />} />
        <Route path="lib-10" element={<Lib10 />} />
      </Routes>
    </>
  );
}

export default App;


