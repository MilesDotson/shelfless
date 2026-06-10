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
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
        <span className="text-3xl font-black text-primary">Y</span>
      </div>
      <h2 className="text-xl font-black text-[#1A1A2E] mb-1">Your Profile</h2>
      <p className="text-sm text-gray-400">Coming soon — rep score, badges & history.</p>
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
