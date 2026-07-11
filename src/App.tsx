import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LocationProvider } from './context/LocationContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Feed from './pages/Feed';
import FindDetail from './pages/FindDetail';
import ReportFind from './pages/ReportFind/index';
import RequestFeed from './pages/RequestFeed';
import CreateRequest from './pages/CreateRequest';

function Profile() {
  return (
    <div className="px-4 py-8 text-center text-gray-500">
      <div className="w-20 h-20 border border-black bg-white flex items-center justify-center mx-auto mb-4">
        <span className="text-3xl font-black text-black">Y</span>
      </div>
      <p className="tape-label text-link mb-2">Operator Profile</p>
      <h2 className="tape-title text-3xl mb-2">Your Signal</h2>
      <p className="font-mono text-xs font-bold uppercase text-gray-400">Rep score, badges, and tape history coming soon.</p>
    </div>
  );
}

export default function App() {
  return (
    <LocationProvider>
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/feed"
          element={
            <Layout>
              <Feed />
            </Layout>
          }
        />
        <Route
          path="/find/:id"
          element={
            <Layout>
              <FindDetail />
            </Layout>
          }
        />
        <Route
          path="/report"
          element={
            <Layout>
              <ReportFind />
            </Layout>
          }
        />
        <Route
          path="/requests"
          element={
            <Layout>
              <RequestFeed />
            </Layout>
          }
        />
        <Route
          path="/requests/new"
          element={
            <Layout>
              <CreateRequest />
            </Layout>
          }
        />
        <Route
          path="/profile"
          element={
            <Layout>
              <Profile />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
    </LocationProvider>
  );
}
