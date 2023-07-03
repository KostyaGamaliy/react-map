import React from 'react';
import {Point} from "../interface/Point";

interface PointListProps {
    points: Point[];
    selectedPointId: string | null;
    onPointSelect: (pointId: string | null) => void;
}

function PointList({
                       points,
                       selectedPointId,
                       onPointSelect,
                   }: PointListProps) {
    const handlePointSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedPointId = event.target.value;
        onPointSelect(selectedPointId);
    };

    return (
        <div className="point-list">
            <select value={selectedPointId || ''} onChange={handlePointSelect}>
                <option value="">Select a point</option>
                {points.map((point) => (
                    <option key={point.id} value={point.id}>
                        {point.description}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default PointList;
