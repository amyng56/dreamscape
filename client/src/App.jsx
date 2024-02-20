import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AuthLayout from './_auth/AuthLayout';
import { SigninForm, SignupForm } from './_auth/forms';
import RootLayout from './_root/RootLayout';
import {
  Home,
  CreatePost,
  Explore,
  PostCollections,
  AllUsers,
  EditPost,
  PostDetails,
  Profile,
  UpdateProfile,
} from './_root/pages';

const App = () => {
  return (
    <main className='flex h-screen'>
      <ToastContainer />

      <Routes>
        {/* public routes */}
        <Route element={<AuthLayout />}>
          <Route path='/sign-in' element={<SigninForm />} />
          <Route path='/sign-up' element={<SignupForm />} />
        </Route>

        {/* private routes */}
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path='/explore' element={<Explore />} />
          <Route path='/collections' element={<PostCollections />} />
          <Route path="/all-users" element={<AllUsers />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:id" element={<EditPost />} />
          <Route path="/posts/:id" element={<PostDetails />} />
          <Route path="/profile/:id/*" element={<Profile />} />
          <Route path="/update-profile/:id" element={<UpdateProfile />} />
        </Route>
      </Routes>
    </main>
  )
}

export default App