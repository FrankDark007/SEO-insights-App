import { GoogleAuthState } from "../types";

const AUTH_STORAGE_KEY = "seo_insight_google_auth";

// Simulated Auth State
export const getAuthState = (): GoogleAuthState => {
  const data = localStorage.getItem(AUTH_STORAGE_KEY);
  return data ? JSON.parse(data) : { analytics: false, searchConsole: false };
};

export const saveAuthState = (state: GoogleAuthState) => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state));
};

export const initiateOAuth = (service: 'analytics' | 'searchConsole'): Promise<void> => {
  // Simulate network delay and OAuth popup flow
  return new Promise((resolve) => {
    setTimeout(() => {
      const state = getAuthState();
      state[service] = true;
      if (!state.accountEmail) {
          state.accountEmail = "frank@flooddoctor.com";
      }
      state.lastSync = new Date().toISOString();
      saveAuthState(state);
      resolve();
    }, 1500);
  });
};

export const disconnectService = (service: 'analytics' | 'searchConsole'): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const state = getAuthState();
      state[service] = false;
      saveAuthState(state);
      resolve();
    }, 500);
  });
};

export const refreshConnection = (service: 'analytics' | 'searchConsole'): Promise<void> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const state = getAuthState();
            state.lastSync = new Date().toISOString();
            saveAuthState(state);
            resolve();
        }, 1000);
    });
}