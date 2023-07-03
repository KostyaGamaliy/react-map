import React from 'react';

interface ObjectListProps {
    objects: string[];
    onObjectDelete: (objectName: string) => void;
    onObjectUpdate: (objectName: string, newData: string) => void;
    selectedObjectName: string | null;
    onObjectSelect: (objectName: string | null) => void;
    updatedData: string;
    onUpdatedDataChange: (newData: string) => void;
}

function ObjectList({
                        objects,
                        onObjectDelete,
                        onObjectUpdate,
                        selectedObjectName,
                        onObjectSelect,
                        updatedData,
                        onUpdatedDataChange,
                    }: ObjectListProps) {
    const handleDelete = (objectName: string) => {
        onObjectDelete(objectName);
    };

    const handleUpdate = (objectName: string) => {
        if (updatedData.trim() !== '') {
            const updatedObjects = objects.map((obj) => {
                if (obj === objectName) {
                    return updatedData;
                } else {
                    return obj;
                }
            });

            objects.splice(0, objects.length, ...updatedObjects);

            onObjectUpdate(objectName, updatedData);
            onUpdatedDataChange('');
            onObjectSelect(null);
            console.log('objects', objects);
        }
    };

    return (
        <ul>
            {objects.map((objectName) => (
                <li key={objectName}>
                    {objectName}
                    <button onClick={() => handleDelete(objectName)}>Delete</button>
                    <button onClick={() => onObjectSelect(objectName)}>Update</button>
                    {selectedObjectName === objectName && (
                        <>
                            <input
                                type="text"
                                value={updatedData}
                                onChange={(e) => onUpdatedDataChange(e.target.value)}
                                placeholder="Enter updated data"
                            />
                            <button onClick={() => handleUpdate(objectName)}>Change</button>
                        </>
                    )}
                </li>
            ))}
        </ul>
    );
}

export default ObjectList;