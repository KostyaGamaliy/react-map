import React, { useState } from 'react';
import Map from './components/Map';
import { Point } from "./interface/Point";
import PointList from './components/PointList';

function App() {
  const [points, setPoints] = useState<Point[]>([]);
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null);
  const [updatedData, setUpdatedData] = useState('');

  const handleMapClick = (point: Point) => {
    const existingPoint = points.find((p) => p.lat === point.lat && p.lng === point.lng);

    if (existingPoint) {
      setSelectedPointId(existingPoint.id);
    } else {
      setPoints([...points, point]);
      setSelectedPointId(point.id);
    }
  };

  const handleMarkerClick = (point: Point) => {
    setSelectedPointId(point.id);
    console.log('Marker clicked:', point);
  };

  const handlePointEdit = (point: Point) => {
    const updatedPoints = points.map((p) => (p.id === point.id ? point : p));
    setPoints(updatedPoints);
  };

  const handlePointDelete = (pointId: string) => {
    const updatedPoints = points.filter((p) => p.id !== pointId);
    setPoints(updatedPoints);
    setSelectedPointId(null);
  };

  const handleObjectAdd = (pointId: string, objectName: string) => {
    const updatedPoints = points.map((p) => {
      if (p.id === pointId) {
        return {
          ...p,
          objects: [...p.objects, objectName],
        };
      }
      return p;
    });
    setPoints(updatedPoints);
  };

  const handleObjectDelete = (pointId: string, objectName: string) => {
    const updatedPoints = points.map((p) => {
      if (p.id === pointId) {
        return {
          ...p,
          objects: p.objects.filter((obj) => obj !== objectName),
        };
      }
      return p;
    });
    setPoints(updatedPoints);
  };

  return (
      <div className="app">
        <Map
            updatedData={updatedData}
            onUpdatedDataChange={setUpdatedData}
            points={points}
            onMapClick={handleMapClick}
            onMarkerClick={handleMarkerClick}
            selectedPointId={selectedPointId}
            onPointSelect={setSelectedPointId}
            onPointEdit={handlePointEdit}
            onPointDelete={handlePointDelete}
            onObjectAdd={handleObjectAdd}
            onObjectDelete={handleObjectDelete}
            onObjectUpdate={() => {}}
        />
        <PointList points={points} selectedPointId={selectedPointId} onPointSelect={setSelectedPointId} />
      </div>
  );
}

export default App;
