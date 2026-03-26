// template
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Platform } from "react-native";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen name="map" options={{ title: "Data Center Map" }} />
      <Stack.Screen name="facility/[id]" options={{ title: "Facility Details" }} />
      <Stack.Screen name="tax-incentives" options={{ title: "Tax Incentive Explorer" }} />
      <Stack.Screen name="llc-tracker/index" options={{ title: "LLC Tracker" }} />
      <Stack.Screen name="llc-tracker/google" options={{ title: "Google LLC Tracker" }} />
      <Stack.Screen name="llc-tracker/meta" options={{ title: "Meta LLC Tracker" }} />
      <Stack.Screen name="susceptibility" options={{ title: "Susceptibility Calculator" }} />
      <Stack.Screen name="tools" options={{ title: "BEACON Tools" }} />
      <Stack.Screen name="about" options={{ title: "About & Methodology" }} />
      <Stack.Screen name="developer/lodestar" options={{ title: "LODESTAR" }} />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
    
    if (Platform.OS === 'web') {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      link.crossOrigin = '';
      document.head.appendChild(link);

      const style = document.createElement('style');
      style.textContent = `
        .leaflet-popup-content-wrapper {
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        .leaflet-popup-content {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .leaflet-popup-tip {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        @keyframes highlight-flash {
          0%, 100% {
            box-shadow: none;
          }
          50% {
            box-shadow: 0 0 0 4px #F59E0B;
          }
        }
        .highlight-flash {
          animation: highlight-flash 0.6s ease 3;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView>
        <RootLayoutNav />
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
