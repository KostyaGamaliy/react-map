import React, { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { Point } from "../interface/Point";
import ObjectList from './ObjectList';

interface MapProps {
    points: Point[];
    onMapClick: (point: Point) => void;
    onMarkerClick: (point: Point) => void;
    selectedPointId: string | null;
    onPointSelect: (pointId: string | null) => void;
    onPointEdit: (point: Point) => void;
    onPointDelete: (pointId: string) => void;
    onObjectAdd: (pointId: string, objectName: string) => void;
    onObjectDelete: (pointId: string, objectName: string) => void;
    onObjectUpdate: (pointId: string, objectName: string | null, newData: string) => void;
    updatedData: string;
    onUpdatedDataChange: (data: string) => void;
}

const containerStyle = {
    width: '100%',
    height: '700px',
    margin: '0 auto',
};

function Map({
                 points,
                 onMapClick,
                 onMarkerClick,
                 selectedPointId,
                 onPointSelect,
                 onPointEdit,
                 onPointDelete,
                 onObjectAdd,
                 onObjectDelete,
                 onObjectUpdate,
                 updatedData,
                 onUpdatedDataChange,
             }: MapProps) {
    const [selectedPoint, setSelectedPoint] = useState<Point | null>(null);
    const [center, setCenter] = useState<{ lat: number; lng: number }>({ lat: 50.4501, lng: 30.5234 });
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: 'AIzaSyBYay7GlfUGXUspReF8GuM6HGpARHrik9U',
    });
    const [selectedPointObjects, setSelectedPointObjects] = useState<string[]>([]);
    const [newObjectName, setNewObjectName] = useState('');
    const [selectedObjectName, setSelectedObjectName] = useState<string | null>(null);
    const [localPoints, setLocalPoints] = useState<Point[]>([]);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setCenter({ lat: latitude, lng: longitude });
                },
                (error) => {
                    console.error('Error getting geolocation:', error);
                }
            );
        }

        const savedPoints = localStorage.getItem('points');
        if (savedPoints) {
            const parsedPoints: Point[] = JSON.parse(savedPoints);
            if (parsedPoints.length > 0) {
                const lastSelectedPoint = parsedPoints.find((point) => point.id === selectedPoint?.id);
                setSelectedPoint(lastSelectedPoint || null);
                if (lastSelectedPoint) {
                    setSelectedPointObjects(lastSelectedPoint.objects);
                }
            }
            setLocalPoints(parsedPoints);
        }
    }, []);

    useEffect(() => {
        const savedPoints = localStorage.getItem('points');
        if (savedPoints) {
            const parsedPoints: Point[] = JSON.parse(savedPoints);
            setLocalPoints(parsedPoints);
        }
    }, []);

    useEffect(() => {
        setLocalPoints(points);
        localStorage.setItem('points', JSON.stringify(points));
    }, [points]);

    useEffect(() => {
        if (selectedPointId) {
            const point = points.find((p) => p.id === selectedPointId);
            setSelectedPoint(point || null);
            if (point) {
                setCenter({ lat: point.lat, lng: point.lng });
                setSelectedPointObjects(point.objects);
            }
        } else {
            setSelectedPoint(null);
        }
    }, [selectedPointId, points]);

    const handleMapClick = (event: google.maps.MapMouseEvent) => {
        if (event.latLng) {
            const clickedPoint: Point = {
                id: '',
                lat: event.latLng.lat(),
                lng: event.latLng.lng(),
                description: '',
                objects: [],
            };

            const existingPoint = points.find(
                (point) => point.lat === clickedPoint.lat && point.lng === clickedPoint.lng
            );

            if (existingPoint) {
                onPointSelect(existingPoint.id);
            } else {
                const newPoint: Point = {
                    ...clickedPoint,
                    id: nanoid(),
                };
                setSelectedPoint(newPoint);
                onMapClick(newPoint);
                setSelectedPointObjects([]);
            }
        }
    };

    const handleMarkerClick = (point: Point) => {
        onMarkerClick(point);
        onPointSelect(point.id);
        setSelectedPointObjects(point.objects);
        setSelectedObjectName(null);
    };

    const handlePointDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (selectedPoint) {
            const updatedPoint: Point = {
                ...selectedPoint,
                description: event.target.value,
            };
            setSelectedPoint(updatedPoint);
            onPointEdit(updatedPoint);
            updateLocalPoints(updatedPoint);
        }
    };

    const handleDeletePoint = () => {
        if (selectedPoint) {
            onPointDelete(selectedPoint.id);
            setSelectedPoint(null);
            removeLocalPoint(selectedPoint.id);
        }
    };

    const handleObjectNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewObjectName(event.target.value);
    };

    const handleAddObject = () => {
        if (selectedPoint && newObjectName.trim() !== '') {
            onObjectAdd(selectedPoint.id, newObjectName);
            setSelectedPointObjects([...selectedPoint.objects, newObjectName]);
            setNewObjectName('');
            updateLocalPoints({ ...selectedPoint, objects: [...selectedPoint.objects, newObjectName] });
        }
    };

    const handleObjectDelete = (objectName: string) => {
        if (selectedPoint) {
            const updatedObjects = selectedPoint.objects.filter((object: string) => object !== objectName);
            const updatedPoint: Point = {
                ...selectedPoint,
                objects: updatedObjects,
            };
            setSelectedPoint(updatedPoint);
            onObjectDelete(selectedPoint.id, objectName);
            onPointEdit(updatedPoint);
            updateLocalPoints(updatedPoint);
            setSelectedObjectName(null);
        }
    };

    const handleObjectUpdate = (objectName: string, newData: string) => {
        if (selectedPoint) {
            const updatedObjects = selectedPoint.objects.map((object) =>
                object === objectName ? newData : object
            );
            const updatedPoint: Point = {
                ...selectedPoint,
                objects: updatedObjects,
            };
            setSelectedPoint(updatedPoint);
            onObjectUpdate(selectedPoint.id, objectName, newData);
            onPointEdit(updatedPoint);
            updateLocalPoints(updatedPoint);
            setSelectedObjectName(null);
        }
    };

    const updateLocalPoints = (updatedPoint: Point) => {
        const updatedPoints = localPoints.map((point) => {
            if (point.id === updatedPoint.id) {
                return updatedPoint;
            }
            return point;
        });
        setLocalPoints(updatedPoints);
        localStorage.setItem('points', JSON.stringify(updatedPoints));
    };

    const removeLocalPoint = (pointId: string) => {
        const updatedPoints = localPoints.filter((point) => point.id !== pointId);
        setLocalPoints(updatedPoints);
        localStorage.setItem('points', JSON.stringify(updatedPoints));
    };

    if (!isLoaded) {
        return <div>Loading Map...</div>;
    }

    return (
        <div className="map">
            <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10} onClick={handleMapClick}>
                {localPoints.map((point) => (
                    <Marker
                        key={point.id}
                        position={{ lat: point.lat, lng: point.lng }}
                        onClick={() => handleMarkerClick(point)}
                    />
                ))}
            </GoogleMap>
            {selectedPoint && (
                <div className="point-form">
                    <input
                        type="text"
                        value={selectedPoint.description}
                        onChange={handlePointDescriptionChange}
                        placeholder="Enter a description"
                    />
                    <button onClick={handleDeletePoint}>Delete Point</button>
                    <div className="object-list">
                        {selectedPoint.objects.length > 0 ? (
                            <ObjectList
                                objects={selectedPoint.objects}
                                onObjectDelete={handleObjectDelete}
                                onObjectUpdate={handleObjectUpdate}
                                selectedObjectName={selectedObjectName}
                                onObjectSelect={setSelectedObjectName}
                                updatedData={updatedData}
                                onUpdatedDataChange={onUpdatedDataChange}
                            />
                        ) : (
                            <p>No objects found.</p>
                        )}
                    </div>
                    <input
                        type="text"
                        value={newObjectName}
                        onChange={handleObjectNameChange}
                        placeholder="Enter an object name"
                    />
                    <button onClick={handleAddObject}>Add Object</button>
                </div>
            )}
        </div>
    );
}

export default Map;
