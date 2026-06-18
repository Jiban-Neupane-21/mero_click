/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';
import Login from './Login';
import AdminPanel from './AdminPanel';
import { supabase, isSupabaseConfigured } from "../utils/supabase"

interface AdminPortalProps {
  onDataChange?: () => void;
}

export default function AdminPortal({ onDataChange }: AdminPortalProps) {
  const [sessionUser, setSessionUser] = useState<string | null>(null);
  const [fetchingSession, setFetchingSession] = useState(true);

  useEffect(() => {
    const checkActiveSession = async () => {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data } = await supabase.auth.getSession();
          if (data?.session?.user) {
            setSessionUser(data.session.user.email || 'Admin');
          }
        } catch (err) {
          console.warn('Supabase auth check error:', err);
        }
      } else {
        // Fallback session persistence check
        const storedUser = localStorage.getItem('kathmandu_admin_session_user');
        if (storedUser) {
          setSessionUser(storedUser);
        }
      }
      setFetchingSession(false);
    };

    checkActiveSession();
  }, []);

  const handleLoginSuccess = (email: string) => {
    setSessionUser(email);
    if (!isSupabaseConfigured) {
      localStorage.setItem('kathmandu_admin_session_user', email);
    }
  };

  const handleLogout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('kathmandu_admin_session_user');
    setSessionUser(null);
  };

  if (fetchingSession) {
    return (
      <Box
        sx={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#030303',
        }}
      >
        <CircularProgress sx={{ color: '#E50914' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '85vh', backgroundColor: '#09090b' }}>
      {sessionUser ? (
        <AdminPanel
          userEmail={sessionUser}
          onLogout={handleLogout}
          onDataChange={onDataChange}
        />
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
    </Box>
  );
}
