import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin } from 'lucide-react-native';

export interface LlcProjectLocation {
  id: string;
  company: string;
  llcName: string;
  projectName: string;
  codeName?: string;
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  status: string;
}

interface LlcMapProps {
  projects: LlcProjectLocation[];
}

function MapContent({ projects }: LlcMapProps) {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { MapContainer, TileLayer, Marker, Popup } = require('react-leaflet');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const L = require('leaflet');

  const center = useMemo<[number, number]>(() => {
    if (projects.length === 0) return [39.5, -98.35];
    const lat = projects.reduce((sum, p) => sum + p.latitude, 0) / projects.length;
    const lng = projects.reduce((sum, p) => sum + p.longitude, 0) / projects.length;
    return [lat, lng];
  }, [projects]);

  const yellowIcon = useMemo(() => {
    return L.divIcon({
      className: 'custom-llc-marker',
      html: `
        <div style="
          background-color: #F59E0B;
          width: 24px;
          height: 24px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 2px solid #fff;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        ">
          <div style="
            width: 12px;
            height: 12px;
            background-color: #1E3A5F;
            border-radius: 50%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          "></div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 24],
      popupAnchor: [0, -24],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MapContainer
      center={center}
      zoom={4}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />
      {projects.map((project) => (
        <Marker
          key={project.id}
          position={[project.latitude, project.longitude]}
          icon={yellowIcon}
        >
          <Popup>
            <div style={{
              minWidth: '200px',
              maxWidth: '300px',
              padding: '8px',
            }}>
              <div style={{
                fontSize: '10px',
                fontWeight: 700,
                color: '#F59E0B',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '4px',
              }}>
                {project.company}
              </div>
              
              <div style={{
                fontSize: '16px',
                fontWeight: 700,
                color: '#1E3A5F',
                marginBottom: '4px',
              }}>
                {project.projectName}
              </div>
              
              {project.codeName && (
                <div style={{
                  fontSize: '12px',
                  color: '#6B7280',
                  fontStyle: 'italic',
                  marginBottom: '8px',
                }}>
                  ({project.codeName})
                </div>
              )}
              
              <div style={{
                fontSize: '13px',
                fontWeight: 600,
                color: '#4B5563',
                marginBottom: '4px',
              }}>
                {project.llcName}
              </div>
              
              <div style={{
                fontSize: '13px',
                color: '#6B7280',
                marginBottom: '8px',
              }}>
                {project.city}, {project.state}
              </div>
              
              <div style={{
                display: 'inline-block',
                backgroundColor: '#F59E0B',
                padding: '4px 12px',
                borderRadius: '12px',
                marginBottom: '12px',
              }}>
                <div style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  color: '#1E3A5F',
                  textTransform: 'uppercase',
                }}>
                  {project.status}
                </div>
              </div>
              
              <button
                onClick={() => router.push(`/llc/${project.id}`)}
                style={{
                  width: '100%',
                  backgroundColor: '#1E3A5F',
                  color: '#F59E0B',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                View Details
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export function LlcMap({ projects }: LlcMapProps) {

  if (projects.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MapPin size={48} color="#9CA3AF" />
        <Text style={styles.emptyText}>No projects with coordinates available</Text>
      </View>
    );
  }

  if (Platform.OS !== 'web') {
    return (
      <View style={styles.emptyContainer}>
        <MapPin size={48} color="#9CA3AF" />
        <Text style={styles.emptyText}>Map is only available on web</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapContent projects={projects} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E5E7EB',
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#6B7280',
    marginTop: 16,
    textAlign: 'center',
  },
});
